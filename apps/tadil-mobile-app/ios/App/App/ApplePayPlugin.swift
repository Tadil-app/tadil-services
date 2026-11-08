import Foundation
import Capacitor
import PassKit

/// Native Apple Pay for the Capacitor checkout. The Moyasar JS form cannot
/// start an Apple Pay session inside WKWebView (`capacitor://localhost`).
@objc(ApplePayPlugin)
public class ApplePayPlugin: CAPPlugin, CAPBridgedPlugin {
    public let identifier = "ApplePayPlugin"
    public let jsName = "ApplePay"
    public let pluginMethods: [CAPPluginMethod] = [
        CAPPluginMethod(name: "isAvailable", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "pay", returnType: CAPPluginReturnPromise)
    ]

    private let supportedNetworks: [PKPaymentNetwork] = [.visa, .masterCard, .mada]
    private var session: ApplePaySession?

    @objc func isAvailable(_ call: CAPPluginCall) {
        let available = PKPaymentAuthorizationController.canMakePayments(usingNetworks: supportedNetworks)
        call.resolve(["available": available])
    }

    @objc func pay(_ call: CAPPluginCall) {
        guard PKPaymentAuthorizationController.canMakePayments(usingNetworks: supportedNetworks) else {
            call.reject("unavailable", "unavailable")
            return
        }

        guard let merchantId = call.getString("merchantId"), !merchantId.isEmpty else {
            call.reject("invalid_merchant", "invalid_merchant")
            return
        }
        guard let amount = call.getString("amount"), !amount.isEmpty else {
            call.reject("invalid_amount", "invalid_amount")
            return
        }
        guard let publishableApiKey = call.getString("publishableApiKey"), !publishableApiKey.isEmpty else {
            call.reject("invalid_key", "invalid_key")
            return
        }
        guard let orderId = call.getString("orderId"), !orderId.isEmpty else {
            call.reject("invalid_order", "invalid_order")
            return
        }

        let request = PKPaymentRequest()
        request.merchantIdentifier = merchantId
        request.countryCode = call.getString("countryCode") ?? "SA"
        request.currencyCode = call.getString("currencyCode") ?? "SAR"
        request.supportedNetworks = supportedNetworks
        request.merchantCapabilities = [.capability3DS, .capabilityCredit, .capabilityDebit]
        request.paymentSummaryItems = [
            PKPaymentSummaryItem(
                label: call.getString("label") ?? "Tadil",
                amount: NSDecimalNumber(string: amount),
                type: .final
            )
        ]

        let amountHalalas = call.getInt("amountHalalas")
            ?? Int(call.getDouble("amountHalalas") ?? 0)
        let payload = MoyasarApplePayPayload(
            amountHalalas: amountHalalas,
            description: call.getString("description") ?? "Tadil",
            publishableApiKey: publishableApiKey,
            orderId: orderId
        )

        DispatchQueue.main.async {
            let session = ApplePaySession(call: call, payload: payload)
            self.session = session
            session.onFinished = { [weak self] in
                self?.session = nil
            }
            session.present(request: request)
        }
    }
}

private struct MoyasarApplePayPayload {
    let amountHalalas: Int
    let description: String
    let publishableApiKey: String
    let orderId: String
}

private final class ApplePaySession: NSObject, PKPaymentAuthorizationControllerDelegate {
    private let call: CAPPluginCall
    private let payload: MoyasarApplePayPayload
    private var controller: PKPaymentAuthorizationController?
    private var settled = false
    var onFinished: (() -> Void)?

    init(call: CAPPluginCall, payload: MoyasarApplePayPayload) {
        self.call = call
        self.payload = payload
    }

    func present(request: PKPaymentRequest) {
        let controller = PKPaymentAuthorizationController(paymentRequest: request)
        controller.delegate = self
        self.controller = controller
        controller.present { [weak self] presented in
            if !presented {
                self?.reject("unavailable", "unavailable")
            }
        }
    }

    func paymentAuthorizationController(
        _ controller: PKPaymentAuthorizationController,
        didAuthorizePayment payment: PKPayment,
        handler completion: @escaping (PKPaymentAuthorizationResult) -> Void
    ) {
        Task {
            do {
                let result = try await Self.createMoyasarPayment(token: payment.token, payload: payload)
                if result.status == "paid", let id = result.id {
                    completion(PKPaymentAuthorizationResult(status: .success, errors: []))
                    resolve(id: id, status: result.status, message: result.message ?? "Succeeded")
                } else {
                    let message = result.message ?? "Payment failed"
                    completion(PKPaymentAuthorizationResult(status: .failure, errors: [
                        NSError(domain: "ApplePayError", code: -1, userInfo: [NSLocalizedDescriptionKey: message])
                    ]))
                    reject("failed", message)
                }
            } catch {
                completion(PKPaymentAuthorizationResult(status: .failure, errors: [error]))
                reject("failed", error.localizedDescription)
            }
        }
    }

    func paymentAuthorizationControllerDidFinish(_ controller: PKPaymentAuthorizationController) {
        controller.dismiss { [weak self] in
            self?.reject("canceled", "canceled")
            self?.onFinished?()
        }
    }

    private func resolve(id: String, status: String, message: String) {
        guard !settled else { return }
        settled = true
        call.resolve(["id": id, "status": status, "message": message])
    }

    private func reject(_ code: String, _ message: String) {
        guard !settled else { return }
        settled = true
        call.reject(message, code)
    }

    private static func createMoyasarPayment(
        token: PKPaymentToken,
        payload: MoyasarApplePayPayload
    ) async throws -> (id: String?, status: String, message: String?) {
        guard let url = URL(string: "https://api.moyasar.com/v1/payments") else {
            throw NSError(domain: "ApplePayError", code: -1, userInfo: [NSLocalizedDescriptionKey: "Invalid Moyasar URL"])
        }

        let tokenValue: Any
        if let object = try? JSONSerialization.jsonObject(with: token.paymentData) {
            tokenValue = object
        } else if let string = String(data: token.paymentData, encoding: .utf8) {
            tokenValue = string
        } else {
            throw NSError(domain: "ApplePayError", code: -1, userInfo: [NSLocalizedDescriptionKey: "Invalid Apple Pay token"])
        }

        let body: [String: Any] = [
            "amount": payload.amountHalalas,
            "currency": "SAR",
            "description": payload.description,
            "publishable_api_key": payload.publishableApiKey,
            "source": [
                "type": "applepay",
                "token": tokenValue
            ],
            "metadata": [
                "order_id": payload.orderId
            ]
        ]

        var request = URLRequest(url: url)
        request.httpMethod = "POST"
        request.setValue("application/json", forHTTPHeaderField: "Content-Type")
        request.setValue("application/json", forHTTPHeaderField: "Accept")
        request.httpBody = try JSONSerialization.data(withJSONObject: body)

        let (data, response) = try await URLSession.shared.data(for: request)
        let http = response as? HTTPURLResponse
        let json = (try? JSONSerialization.jsonObject(with: data)) as? [String: Any]

        let id = json?["id"] as? String
        let status = json?["status"] as? String
            ?? ((http?.statusCode ?? 500) >= 400 ? "failed" : "")
        let source = json?["source"] as? [String: Any]
        let message = (source?["message"] as? String)
            ?? (json?["message"] as? String)

        if http?.statusCode ?? 500 >= 400 {
            throw NSError(
                domain: "ApplePayError",
                code: http?.statusCode ?? -1,
                userInfo: [NSLocalizedDescriptionKey: message ?? "Moyasar rejected the payment"]
            )
        }

        return (id, status, message)
    }
}
