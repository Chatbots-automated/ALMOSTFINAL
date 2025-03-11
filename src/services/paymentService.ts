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
    console.log('Creating transaction with data:', {
      amount,
      reference,
      email,
      returnUrl,
      cancelUrl,
      notificationUrl
    });

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
          country: 'lt',
          locale: 'lt',
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
      console.error('Payment API Error:', errorData);
      throw new Error(errorData.message || 'Failed to create transaction');
    }

    const data = await response.json();
    console.log('Transaction response:', data);

    // Check if we have a transaction ID and payment URL
    if (!data.id || !data._links?.payment_methods) {
      throw new Error('Invalid response from payment service');
    }

    // Start polling for transaction status
    const maxAttempts = 10;
    let attempts = 0;
    
    while (attempts < maxAttempts) {
      const status = await getTransactionStatus(data.id);
      
      if (status === 'completed') {
        return data._links.payment_methods;
      }
      
      if (status === 'failed') {
        throw new Error('Transaction failed');
      }
      
      // Wait 2 seconds before next attempt
      await new Promise(resolve => setTimeout(resolve, 2000));
      attempts++;
    }

    // If we reach here, return the payment URL for the pending transaction
    return data._links.payment_methods;
  } catch (error) {
    console.error('Payment error:', error);
    throw new Error('Failed to create transaction');
  }
};

export const getTransactionStatus = async (transactionId: string): Promise<'pending' | 'completed' | 'failed'> => {
  try {
    console.log('Fetching transaction status for ID:', transactionId);

    const response = await fetch(`https://hook.eu2.make.com/yw5ie28y0kmrkeafigpynd289dk6u1qh/status/${transactionId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch transaction status');
    }

    const data = await response.json();
    console.log('Transaction status response:', data);

    return data.status;
  } catch (error) {
    console.error('Error fetching transaction status:', error);
    throw error;
  }
};

export const verifyPayment = async (transactionId: string): Promise<boolean> => {
  try {
    console.log('Verifying payment:', transactionId);

    const response = await fetch(`https://hook.eu2.make.com/yw5ie28y0kmrkeafigpynd289dk6u1qh/verify`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ transactionId }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('Payment verification error:', errorData);
      throw new Error('Failed to verify payment');
    }

    const data = await response.json();
    console.log('Verification response:', data);

    return data.status === 'completed';
  } catch (error) {
    console.error('Payment verification error:', error);
    throw new Error('Failed to verify payment');
  }
};