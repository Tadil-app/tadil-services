package com.tadil.app;

import android.app.Activity;
import android.content.Intent;

import androidx.activity.result.ActivityResult;

import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.ActivityCallback;
import com.getcapacitor.annotation.CapacitorPlugin;
import com.google.android.gms.tasks.Task;
import com.google.android.gms.wallet.IsReadyToPayRequest;
import com.google.android.gms.wallet.PaymentsClient;
import com.google.android.gms.wallet.Wallet;
import com.google.android.gms.wallet.WalletConstants;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.io.BufferedReader;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.nio.charset.StandardCharsets;

// Native Google Pay for the Capacitor checkout. The Moyasar JS form cannot
// start a Google Pay session inside the Android WebView.
@CapacitorPlugin(name = "GooglePay")
public class GooglePayPlugin extends Plugin {

    @PluginMethod
    public void isAvailable(PluginCall call) {
        Activity activity = getActivity();
        if (activity == null) {
            JSObject ret = new JSObject();
            ret.put("available", false);
            call.resolve(ret);
            return;
        }

        try {
            PaymentsClient client = paymentsClient(activity, environmentFrom(call));
            IsReadyToPayRequest request = IsReadyToPayRequest.fromJson(isReadyToPayJson());
            Task<Boolean> task = client.isReadyToPay(request);
            task.addOnCompleteListener(activity, completed -> {
                JSObject ret = new JSObject();
                boolean available = false;
                if (completed.isSuccessful()) {
                    Boolean result = completed.getResult();
                    available = result != null && result;
                }
                ret.put("available", available);
                call.resolve(ret);
            });
        } catch (Exception error) {
            JSObject ret = new JSObject();
            ret.put("available", false);
            call.resolve(ret);
        }
    }

    @PluginMethod
    public void pay(PluginCall call) {
        Activity activity = getActivity();
        if (activity == null) {
            call.reject("unavailable", "unavailable");
            return;
        }

        String merchantId = call.getString("merchantId");
        String amount = call.getString("amount");
        String publishableApiKey = call.getString("publishableApiKey");
        String orderId = call.getString("orderId");
        if (merchantId == null || merchantId.isEmpty()) {
            call.reject("invalid_merchant", "invalid_merchant");
            return;
        }
        if (amount == null || amount.isEmpty()) {
            call.reject("invalid_amount", "invalid_amount");
            return;
        }
        if (publishableApiKey == null || publishableApiKey.isEmpty()) {
            call.reject("invalid_key", "invalid_key");
            return;
        }
        if (orderId == null || orderId.isEmpty()) {
            call.reject("invalid_order", "invalid_order");
            return;
        }

        String gatewayMerchantId = call.getString("gatewayMerchantId");
        if (gatewayMerchantId == null || gatewayMerchantId.isEmpty()) {
            gatewayMerchantId = merchantId;
        }

        try {
            String requestJson = paymentDataRequestJson(
                merchantId,
                gatewayMerchantId,
                call.getString("countryCode", "SA"),
                call.getString("currencyCode", "SAR"),
                call.getString("label", "Tadil"),
                amount
            );
            Intent intent = new Intent(activity, GooglePayActivity.class);
            intent.putExtra(GooglePayActivity.EXTRA_REQUEST_JSON, requestJson);
            intent.putExtra(GooglePayActivity.EXTRA_ENVIRONMENT, environmentFrom(call));
            startActivityForResult(call, intent, "handleGooglePayResult");
        } catch (Exception error) {
            call.reject("failed", error.getMessage() != null ? error.getMessage() : "failed");
        }
    }

    @ActivityCallback
    private void handleGooglePayResult(PluginCall call, ActivityResult result) {
        if (call == null) return;

        if (result.getResultCode() == Activity.RESULT_CANCELED) {
            call.reject("canceled", "canceled");
            return;
        }

        Intent data = result.getData();
        if (result.getResultCode() != Activity.RESULT_OK || data == null) {
            String message = data != null ? data.getStringExtra(GooglePayActivity.EXTRA_ERROR) : null;
            call.reject(message != null ? message : "failed", "failed");
            return;
        }

        String token = data.getStringExtra(GooglePayActivity.EXTRA_TOKEN);
        if (token == null || token.isEmpty()) {
            call.reject("failed", "failed");
            return;
        }

        Integer amountHalalas = call.getInt("amountHalalas");
        if (amountHalalas == null) {
            Double asDouble = call.getDouble("amountHalalas");
            amountHalalas = asDouble != null ? asDouble.intValue() : 0;
        }
        String description = call.getString("description", "Tadil");
        String publishableApiKey = call.getString("publishableApiKey");
        String orderId = call.getString("orderId");

        final int amount = amountHalalas;
        new Thread(() -> {
            try {
                JSONObject payment = createMoyasarPayment(
                    token,
                    amount,
                    description,
                    publishableApiKey,
                    orderId
                );
                String status = payment.optString("status", "failed");
                String id = payment.optString("id", "");
                JSONObject source = payment.optJSONObject("source");
                String message = source != null ? source.optString("message", "") : "";
                if (message.isEmpty()) {
                    message = payment.optString("message", "Succeeded");
                }
                if (!"paid".equals(status) || id.isEmpty()) {
                    call.reject(message.isEmpty() ? "Payment failed" : message, "failed");
                    return;
                }
                JSObject ret = new JSObject();
                ret.put("id", id);
                ret.put("status", status);
                ret.put("message", message.isEmpty() ? "Succeeded" : message);
                call.resolve(ret);
            } catch (Exception error) {
                call.reject(
                    error.getMessage() != null ? error.getMessage() : "Moyasar rejected the payment",
                    "failed"
                );
            }
        }).start();
    }

    private PaymentsClient paymentsClient(Activity activity, int environment) {
        return Wallet.getPaymentsClient(
            activity,
            new Wallet.WalletOptions.Builder().setEnvironment(environment).build()
        );
    }

    private static int environmentFrom(PluginCall call) {
        String environment = call.getString("environment", "TEST");
        if ("PRODUCTION".equals(environment)) {
            return WalletConstants.ENVIRONMENT_PRODUCTION;
        }
        return WalletConstants.ENVIRONMENT_TEST;
    }

    private static JSONArray allowedAuthMethods() {
        return new JSONArray().put("CRYPTOGRAM_3DS");
    }

    private static JSONArray allowedCardNetworks() {
        return new JSONArray().put("VISA").put("MASTERCARD");
    }

    private static String isReadyToPayJson() throws JSONException {
        JSONObject card = new JSONObject()
            .put("type", "CARD")
            .put("parameters", new JSONObject()
                .put("allowedAuthMethods", allowedAuthMethods())
                .put("allowedCardNetworks", allowedCardNetworks()));
        return new JSONObject()
            .put("apiVersion", 2)
            .put("apiVersionMinor", 0)
            .put("allowedPaymentMethods", new JSONArray().put(card))
            .put("existingPaymentMethodRequired", true)
            .toString();
    }

    private static String paymentDataRequestJson(
        String merchantId,
        String gatewayMerchantId,
        String countryCode,
        String currencyCode,
        String label,
        String amount
    ) throws JSONException {
        JSONObject tokenization = new JSONObject()
            .put("type", "PAYMENT_GATEWAY")
            .put("parameters", new JSONObject()
                .put("gateway", "moyasar")
                .put("gatewayMerchantId", gatewayMerchantId));
        JSONObject card = new JSONObject()
            .put("type", "CARD")
            .put("parameters", new JSONObject()
                .put("allowedAuthMethods", allowedAuthMethods())
                .put("allowedCardNetworks", allowedCardNetworks()))
            .put("tokenizationSpecification", tokenization);
        JSONObject merchantInfo = new JSONObject().put("merchantName", label);
        if (merchantId != null && !merchantId.isEmpty()) {
            merchantInfo.put("merchantId", merchantId);
        }
        return new JSONObject()
            .put("apiVersion", 2)
            .put("apiVersionMinor", 0)
            .put("allowedPaymentMethods", new JSONArray().put(card))
            .put("transactionInfo", new JSONObject()
                .put("totalPriceStatus", "FINAL")
                .put("totalPrice", amount)
                .put("currencyCode", currencyCode)
                .put("countryCode", countryCode))
            .put("merchantInfo", merchantInfo)
            .toString();
    }

    private static JSONObject createMoyasarPayment(
        String token,
        int amountHalalas,
        String description,
        String publishableApiKey,
        String orderId
    ) throws Exception {
        JSONObject source = new JSONObject().put("type", "googlepay");
        try {
            source.put("token", new JSONObject(token));
        } catch (JSONException ignored) {
            source.put("token", token);
        }

        JSONObject body = new JSONObject()
            .put("amount", amountHalalas)
            .put("currency", "SAR")
            .put("description", description)
            .put("publishable_api_key", publishableApiKey)
            .put("source", source)
            .put("metadata", new JSONObject().put("order_id", orderId));

        URL url = new URL("https://api.moyasar.com/v1/payments");
        HttpURLConnection connection = (HttpURLConnection) url.openConnection();
        try {
            connection.setRequestMethod("POST");
            connection.setDoOutput(true);
            connection.setConnectTimeout(20000);
            connection.setReadTimeout(20000);
            connection.setRequestProperty("Content-Type", "application/json");
            connection.setRequestProperty("Accept", "application/json");
            byte[] payload = body.toString().getBytes(StandardCharsets.UTF_8);
            try (OutputStream output = connection.getOutputStream()) {
                output.write(payload);
            }

            int status = connection.getResponseCode();
            InputStream stream = status >= 400
                ? connection.getErrorStream()
                : connection.getInputStream();
            String responseText = readStream(stream);
            JSONObject json;
            try {
                json = new JSONObject(responseText);
            } catch (JSONException ignored) {
                json = new JSONObject();
            }

            if (status >= 400) {
                JSONObject errorSource = json.optJSONObject("source");
                String message = errorSource != null ? errorSource.optString("message") : "";
                if (message.isEmpty()) {
                    message = json.optString("message", "Moyasar rejected the payment");
                }
                throw new Exception(message);
            }
            return json;
        } finally {
            connection.disconnect();
        }
    }

    private static String readStream(InputStream stream) throws Exception {
        if (stream == null) return "";
        StringBuilder builder = new StringBuilder();
        try (BufferedReader reader = new BufferedReader(
            new InputStreamReader(stream, StandardCharsets.UTF_8)
        )) {
            String line;
            while ((line = reader.readLine()) != null) {
                builder.append(line);
            }
        }
        return builder.toString();
    }
}
