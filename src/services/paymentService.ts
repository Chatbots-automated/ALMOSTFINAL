import axios from 'axios';

const API_BASE_URL = 'https://api.test.maksekeskus.ee/v1'; // Change to LIVE for production

interface TransactionRequest {
  amount: number;
  reference: string;
  email: string;
  returnUrl: string;
  cancelUrl: string;
  notificationUrl: string;
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
    const response = await fetch('https://hook.eu2.make.com/yw5ie28y0kmrkeafigpynd289dk6u1qh', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        transaction: {
          amount: amount.toFixed(2),
          currency: 'EUR',
          reference,
          merchant_data: `Order ID: ${reference}`,
          recurring_required: false,
          transaction_url: {
            return_url: {
              url: returnUrl,
              method: 'GET',
            },
            cancel_url: {
              url: cancelUrl,
              method: 'GET',
            },
            notification_url: {
              url: notificationUrl,
              method: 'POST',
            },
          },
        },
        customer: {
          email,
          country: 'ee',
          locale: 'ee',
        },
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to create transaction');
    }

    const data = await response.json();
    return data._links.payment_methods;
  } catch (error) {
    console.error('Payment error:', error);
    throw new Error('Failed to create transaction');
  }
};

export const verifyPayment = async (transactionId: string): Promise<boolean> => {
  try {
    const response = await fetch(`https://hook.eu2.make.com/yw5ie28y0kmrkeafigpynd289dk6u1qh/verify`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ transactionId }),
    });

    if (!response.ok) {
      throw new Error('Failed to verify payment');
    }

    const data = await response.json();
    return data.status === 'completed';
  } catch (error) {
    console.error('Payment verification error:', error);
    throw new Error('Failed to verify payment');
  }
};