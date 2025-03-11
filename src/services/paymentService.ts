import axios from 'axios';

interface TransactionRequest {
  amount: number;
  reference: string;
  email: string;
  returnUrl: string;
  cancelUrl: string;
  notificationUrl: string;
}

interface TransactionResponse {
  id: string;
  status: 'pending' | 'completed' | 'failed';
  _links: {
    payment_methods: string;
  };
}

export const createTransaction = async ({
  amount,
  reference,
  email,
  returnUrl,
  cancelUrl,
  notificationUrl
}: TransactionRequest): Promise<string> => {
  try {
    console.log("Creating transaction with MakeCommerce API:", {
      amount,
      reference,
      email,
      returnUrl,
      cancelUrl,
      notificationUrl
    });

    const response = await fetch('https://api.test.maksekeskus.ee/v1/transactions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Basic ' + btoa(`${process.env.VITE_MAKECOMMERCE_STORE_ID}:${process.env.VITE_MAKECOMMERCE_SECRET_KEY}`)
      },
      body: JSON.stringify({
        transaction: {
          amount: amount.toFixed(2),
          currency: 'EUR',
          reference,
          merchant_data: `Order ID: ${reference}`,
          recurring_required: false,
          transaction_url: {
            return_url: { url: returnUrl, method: 'GET' },
            cancel_url: { url: cancelUrl, method: 'GET' },
            notification_url: { url: notificationUrl, method: 'POST' },
          },
        },
        customer: {
          email,
          country: 'LT',
          locale: 'LT',
        },
        app_info: {
          module: 'ÉLIDA',
          platform: 'React',
          platform_version: '1.0'
        }
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error("Payment API Error:", errorData);
      throw new Error(errorData.message || "Failed to create transaction.");
    }

    const data = await response.json();
    console.log("Transaction response:", data);

    if (data._links?.payment_methods) {
      console.log("Found payment URL:", data._links.payment_methods);
      return data._links.payment_methods;
    }

    throw new Error("Payment URL missing in response.");
  } catch (error) {
    console.error("Payment error:", error);
    throw new Error("Failed to create transaction.");
  }
};

export const getTransactionStatus = async (transactionId: string): Promise<'pending' | 'completed' | 'failed'> => {
  try {
    console.log("Fetching transaction status for ID:", transactionId);

    const response = await fetch(`https://api.test.maksekeskus.ee/v1/transactions/${transactionId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Basic ' + btoa(`${process.env.VITE_MAKECOMMERCE_STORE_ID}:${process.env.VITE_MAKECOMMERCE_SECRET_KEY}`)
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch transaction status.");
    }

    const data = await response.json();
    console.log("Transaction status response:", data);

    return data.status || 'pending';
  } catch (error) {
    console.error("Error fetching transaction status:", error);
    throw error;
  }
};

export const verifyPayment = async (transactionId: string): Promise<boolean> => {
  try {
    console.log("Verifying payment:", transactionId);

    const response = await fetch(`https://api.test.maksekeskus.ee/v1/transactions/${transactionId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Basic ' + btoa(`${process.env.VITE_MAKECOMMERCE_STORE_ID}:${process.env.VITE_MAKECOMMERCE_SECRET_KEY}`)
      },
    });

    if (!response.ok) {
      throw new Error("Failed to verify payment.");
    }

    const data = await response.json();
    console.log("Verification response:", data);

    return data.status === 'completed';
  } catch (error) {
    console.error("Payment verification error:", error);
    throw error;
  }
};