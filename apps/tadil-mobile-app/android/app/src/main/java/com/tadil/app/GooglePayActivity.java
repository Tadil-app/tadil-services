package com.tadil.app;

import android.app.Activity;
import android.content.Intent;
import android.os.Bundle;

import com.google.android.gms.wallet.AutoResolveHelper;
import com.google.android.gms.wallet.PaymentData;
import com.google.android.gms.wallet.PaymentDataRequest;
import com.google.android.gms.wallet.PaymentsClient;
import com.google.android.gms.wallet.Wallet;
import com.google.android.gms.wallet.WalletConstants;

import org.json.JSONObject;

public class GooglePayActivity extends Activity {
    public static final String EXTRA_REQUEST_JSON = "paymentDataRequest";
    public static final String EXTRA_ENVIRONMENT = "environment";
    public static final String EXTRA_TOKEN = "token";
    public static final String EXTRA_ERROR = "error";

    private static final int LOAD_PAYMENT_DATA_REQUEST_CODE = 991;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        if (savedInstanceState != null) return;

        String requestJson = getIntent().getStringExtra(EXTRA_REQUEST_JSON);
        int environment = getIntent().getIntExtra(
            EXTRA_ENVIRONMENT,
            WalletConstants.ENVIRONMENT_TEST
        );
        if (requestJson == null || requestJson.isEmpty()) {
            fail("invalid_request");
            return;
        }

        try {
            PaymentsClient client = Wallet.getPaymentsClient(
                this,
                new Wallet.WalletOptions.Builder().setEnvironment(environment).build()
            );
            AutoResolveHelper.resolveTask(
                client.loadPaymentData(PaymentDataRequest.fromJson(requestJson)),
                this,
                LOAD_PAYMENT_DATA_REQUEST_CODE
            );
        } catch (Exception error) {
            fail(error.getMessage() != null ? error.getMessage() : "failed");
        }
    }

    @Override
    protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
        if (requestCode != LOAD_PAYMENT_DATA_REQUEST_CODE) return;

        if (resultCode == RESULT_OK && data != null) {
            PaymentData paymentData = PaymentData.getFromIntent(data);
            String token = extractToken(paymentData);
            if (token == null || token.isEmpty()) {
                fail("failed");
                return;
            }
            Intent result = new Intent();
            result.putExtra(EXTRA_TOKEN, token);
            setResult(RESULT_OK, result);
            finish();
            return;
        }

        if (resultCode == RESULT_CANCELED) {
            setResult(RESULT_CANCELED);
            finish();
            return;
        }

        String message = "failed";
        if (data != null) {
            com.google.android.gms.common.api.Status status =
                AutoResolveHelper.getStatusFromIntent(data);
            if (status != null && status.getStatusMessage() != null) {
                message = status.getStatusMessage();
            }
        }
        fail(message);
    }

    private void fail(String message) {
        Intent error = new Intent();
        error.putExtra(EXTRA_ERROR, message);
        setResult(RESULT_FIRST_USER, error);
        finish();
    }

    private static String extractToken(PaymentData paymentData) {
        if (paymentData == null) return null;
        try {
            JSONObject json = new JSONObject(paymentData.toJson());
            return json
                .getJSONObject("paymentMethodData")
                .getJSONObject("tokenizationData")
                .getString("token");
        } catch (Exception ignored) {
            return null;
        }
    }
}
