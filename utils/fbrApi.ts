import { CompletedOrder, FbrSettings } from '../types';

/**
 * Simulates sending a finalized invoice to the FBR's official API endpoint.
 * In a real-world application, this function would make an actual HTTP POST request.
 * For this demo, it constructs and logs the payload to the console.
 * @param order - The completed order object.
 * @param settings - The current FBR settings containing credentials.
 */
export const sendInvoiceToFBR = (order: CompletedOrder, settings: FbrSettings): void => {
  // Construct the payload according to FBR API specifications.
  // Note: Some fields like BuyerNTN or PCTCode are placeholders.
  const fbrPayload = {
    SellerNTN: settings.ntn,
    POSID: settings.posId,
    InvoiceNumber: order.fbrInvoiceNumber,
    DateTime: order.date.toISOString(),
    BuyerNTN: '', // Assuming not collected for B2C transactions
    BuyerName: order.customer?.name || 'Walk-in Customer',
    BuyerPhoneNumber: '', // Assuming not collected
    TotalBillAmount: order.total,
    TotalQuantity: order.cartItems.reduce((acc, item) => acc + item.quantity, 0),
    TotalSaleValue: order.subtotal,
    TotalTaxCharged: order.tax,
    PaymentMode: order.paymentMethod === 'Card' ? 2 : 1, // Example mapping: 1=Cash, 2=Card
    Items: order.cartItems.map(item => ({
      ItemCode: String(item.id),
      ItemName: item.name,
      Quantity: item.quantity,
      PCTCode: "1101.0010", // Placeholder PCT code
      TaxRate: order.taxRate,
      SaleValue: item.price * item.quantity,
      TaxCharged: (item.price * item.quantity) * (1 - (order.discountAmount || 0) / order.subtotal) * order.taxRate,
      Discount: 0, // Item-level discount would be calculated here if applicable
    })),
  };

  console.log("--- Sending Invoice to FBR (Simulation) ---");
  console.log("Endpoint: https://iris.fbr.gov.pk/api/pos/v1/invoice");
  console.log("Payload:", JSON.stringify(fbrPayload, null, 2));

  // In a real application, the following fetch call would be made:
  /*
  fetch('https://iris.fbr.gov.pk/api/pos/v1/invoice', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${settings.apiKey}`
    },
    body: JSON.stringify(fbrPayload)
  })
  .then(async response => {
    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`FBR API responded with status ${response.status}: ${errorText}`);
    }
    return response.json();
  })
  .then(data => {
    console.log('FBR API Success Response:', data);
    // You might want to store the FBR response invoice number here
  })
  .catch(error => {
    console.error('FBR API Submission Error:', error);
    // Implement retry logic or save for later submission
  });
  */
};
