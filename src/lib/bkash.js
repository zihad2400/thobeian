import axios from "axios";

const BKASH_CONFIG = {
  appKey: process.env.BKASH_APP_KEY,
  appSecret: process.env.BKASH_APP_SECRET,
  username: process.env.BKASH_USERNAME,
  password: process.env.BKASH_PASSWORD,
  baseURL: process.env.BKASH_BASE_URL || "https://checkout.pay.bka.sh/v1.2.0-beta",
  isSandbox: process.env.BKASH_IS_SANDBOX === "true",
};

let tokenCache = {
  id_token: null,
  refresh_token: null,
  expires_at: 0,
};

// ===== 1. Grant Token =====
export async function grantToken() {
  // Return cached if valid
  if (tokenCache.id_token && Date.now() < tokenCache.expires_at - 60000) {
    return tokenCache.id_token;
  }

  const response = await axios.post(
    `${BKASH_CONFIG.baseURL}/tokenized/checkout/token/grant`,
    {
      app_key: BKASH_CONFIG.appKey,
      app_secret: BKASH_CONFIG.appSecret,
    },
    {
      headers: {
        "Content-Type": "application/json",
        username: BKASH_CONFIG.username,
        password: BKASH_CONFIG.password,
      },
    }
  );

  if (response.data?.id_token) {
    tokenCache.id_token = response.data.id_token;
    tokenCache.refresh_token = response.data.refresh_token;
    tokenCache.expires_at = Date.now() + (response.data.expires_in || 3600) * 1000;
  }

  return tokenCache.id_token;
}

// ===== 2. Create Payment =====
export async function createPayment({
  amount,
  orderId,
  payerReference = "01700000000",
  callbackURL,
}) {
  const token = await grantToken();

  const response = await axios.post(
    `${BKASH_CONFIG.baseURL}/tokenized/checkout/create`,
    {
      mode: "0011",
      payerReference,
      callbackURL,
      amount: String(amount),
      currency: "BDT",
      intent: "sale",
      merchantInvoiceNumber: orderId,
    },
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
        "X-APP-Key": BKASH_CONFIG.appKey,
      },
    }
  );

  return response.data;
}

// ===== 3. Execute Payment =====
export async function executePayment(paymentID) {
  const token = await grantToken();

  const response = await axios.post(
    `${BKASH_CONFIG.baseURL}/tokenized/checkout/execute`,
    { paymentID },
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
        "X-APP-Key": BKASH_CONFIG.appKey,
      },
    }
  );

  return response.data;
}

// ===== 4. Query Payment =====
export async function queryPayment(paymentID) {
  const token = await grantToken();

  const response = await axios.post(
    `${BKASH_CONFIG.baseURL}/tokenized/checkout/payment/status`,
    { paymentID },
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
        "X-APP-Key": BKASH_CONFIG.appKey,
      },
    }
  );

  return response.data;
}

// ===== 5. Refund Payment =====
export async function refundPayment({ paymentID, trxID, amount, reason }) {
  const token = await grantToken();

  const response = await axios.post(
    `${BKASH_CONFIG.baseURL}/tokenized/checkout/payment/refund`,
    {
      paymentID,
      trxID,
      amount: String(amount),
      sku: "refund",
      reason: reason || "Customer refund",
    },
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
        "X-APP-Key": BKASH_CONFIG.appKey,
      },
    }
  );

  return response.data;
}

export { BKASH_CONFIG };
