import crypto from "crypto";
import axios from "axios";

const NAGAD_CONFIG = {
  merchantId: process.env.NAGAD_MERCHANT_ID,
  merchantNumber: process.env.NAGAD_MERCHANT_NUMBER,
  merchantPrivateKey: process.env.NAGAD_MERCHANT_PRIVATE_KEY,
  pgwPublicKey: process.env.NAGAD_PGW_PUBLIC_KEY,
  baseURL: process.env.NAGAD_BASE_URL || "https://sandbox-ssl.mynagad.com",
  isSandbox: process.env.NAGAD_IS_SANDBOX === "true",
};

// ===== Generate Random String =====
function generateRandomString(length = 40) {
  return crypto.randomBytes(length).toString("hex").substring(0, length);
}

// ===== Sign Data with Merchant Private Key =====
function signData(data, privateKey) {
  try {
    const signer = crypto.createSign("SHA256");
    signer.update(data);
    signer.end();
    return signer.sign(privateKey, "base64");
  } catch (error) {
    console.error("Sign error:", error.message);
    throw error;
  }
}

// ===== Encrypt Data with PGW Public Key =====
function encryptData(data, publicKey) {
  try {
    const encrypted = crypto.publicEncrypt(
      {
        key: publicKey,
        padding: crypto.constants.RSA_PKCS1_PADDING,
      },
      Buffer.from(data)
    );
    return encrypted.toString("base64");
  } catch (error) {
    console.error("Encrypt error:", error.message);
    throw error;
  }
}

// ===== Decrypt with Merchant Private Key =====
function decryptData(encryptedData, privateKey) {
  try {
    const decrypted = crypto.privateDecrypt(
      {
        key: privateKey,
        padding: crypto.constants.RSA_PKCS1_PADDING,
      },
      Buffer.from(encryptedData, "base64")
    );
    return decrypted.toString("utf8");
  } catch (error) {
    console.error("Decrypt error:", error.message);
    throw error;
  }
}

// ===== Build Sensitive Data =====
function buildSensitiveData(merchantId, orderId, amount, callbackURL) {
  const dateTime = new Date()
    .toISOString()
    .replace(/[-:T.]/g, "")
    .substring(0, 14);

  const sensitiveData = {
    merchantId: merchantId,
    datetime: dateTime,
    orderId: orderId,
    currencyCode: "050",
    amount: String(amount),
    challenge: generateRandomString(40),
  };

  // Build query string (alphabetical order)
  const dataString = Object.keys(sensitiveData)
    .sort()
    .map((key) => `${key}=${sensitiveData[key]}`)
    .join("&");

  return {
    sensitiveData,
    dataString,
    dateTime,
  };
}

// ===== Initialize Nagad Payment =====
export async function initializePayment({ orderId, amount, callbackURL }) {
  const { sensitiveData, dataString, dateTime } = buildSensitiveData(
    NAGAD_CONFIG.merchantId,
    orderId,
    amount,
    callbackURL
  );

  // Sign sensitive data
  const signature = signData(dataString, NAGAD_CONFIG.merchantPrivateKey);

  // Encrypt sensitive data
  const encryptedSensitiveData = encryptData(
    dataString,
    NAGAD_CONFIG.pgwPublicKey
  );

  // Build request body
  const requestBody = {
    accountNumber: NAGAD_CONFIG.merchantNumber,
    dateTime: dateTime,
    sensitiveData: encryptedSensitiveData,
    signature: signature,
  };

  // Call Nagad API
  const response = await axios.post(
    `${NAGAD_CONFIG.baseURL}/api/dfs/check-out/initialize/${NAGAD_CONFIG.merchantId}/${orderId}`,
    requestBody,
    {
      headers: {
        "Content-Type": "application/json",
        "X-KM-Api-Version": "v-0.2.0",
        "X-KM-IP-V4": "127.0.0.1",
        "X-KM-Client-Type": "PC_WEB",
      },
    }
  );

  return response.data;
}

// ===== Complete Payment =====
export async function completePayment({ paymentReferenceId, orderId, amount }) {
  const dateTime = new Date()
    .toISOString()
    .replace(/[-:T.]/g, "")
    .substring(0, 14);

  const sensitiveData = {
    merchantId: NAGAD_CONFIG.merchantId,
    orderId: orderId,
    currencyCode: "050",
    amount: String(amount),
    challenge: generateRandomString(40),
  };

  const dataString = Object.keys(sensitiveData)
    .sort()
    .map((key) => `${key}=${sensitiveData[key]}`)
    .join("&");

  const signature = signData(dataString, NAGAD_CONFIG.merchantPrivateKey);
  const encryptedSensitiveData = encryptData(
    dataString,
    NAGAD_CONFIG.pgwPublicKey
  );

  const requestBody = {
    sensitiveData: encryptedSensitiveData,
    signature: signature,
  };

  const response = await axios.post(
    `${NAGAD_CONFIG.baseURL}/api/dfs/check-out/complete/${paymentReferenceId}`,
    requestBody,
    {
      headers: {
        "Content-Type": "application/json",
        "X-KM-Api-Version": "v-0.2.0",
        "X-KM-IP-V4": "127.0.0.1",
        "X-KM-Client-Type": "PC_WEB",
      },
    }
  );

  return response.data;
}

// ===== Verify Payment =====
export async function verifyPayment(paymentReferenceId) {
  const response = await axios.get(
    `${NAGAD_CONFIG.baseURL}/api/dfs/verify/payment/${paymentReferenceId}`,
    {
      headers: {
        "X-KM-Api-Version": "v-0.2.0",
        "X-KM-IP-V4": "127.0.0.1",
        "X-KM-Client-Type": "PC_WEB",
      },
    }
  );

  return response.data;
}

// ===== Decrypt Callback =====
export function decryptCallback(encryptedData) {
  return decryptData(encryptedData, NAGAD_CONFIG.merchantPrivateKey);
}

export { NAGAD_CONFIG };
