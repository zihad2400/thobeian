export function generateOrderNumber() {
  const date = new Date();
  const year = date.getFullYear().toString().slice(-2);
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const random = Math.floor(Math.random() * 100000)
    .toString()
    .padStart(5, "0");
  return `THB-${year}${month}${day}-${random}`;
}

export function generateTransactionId(prefix = "TXN") {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 10000)
    .toString()
    .padStart(4, "0");
  return `${prefix}-${timestamp}-${random}`;
}

export const SHIPPING_CHARGES = {
  inside_dhaka: 80,
  outside_dhaka: 130,
  express: 200,
};

export const COD_FEE = 0;
export const FREE_SHIPPING_ABOVE = 5000;
