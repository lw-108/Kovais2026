declare global {
  interface Window {
    Razorpay: any;
  }
}

export interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  image?: string;
  order_id?: string;
  handler: (response: RazorpayResponse) => void;
  prefill?: {
    name?: string;
    email?: string;
    contact?: string;
  };
  notes?: Record<string, string>;
  theme: {
    color: string;
  };
  modal: {
    backdropclose: boolean;
    escape: boolean;
    handleback: boolean;
    confirm_close: boolean;
    persist: string;
  };
  retry: {
    enabled: boolean;
    max_count: number;
  };
  timeout: number;
  callback_url?: string;
  redirect: boolean;
  config?: any;
}

export interface RazorpayResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

export class RazorpayPayment {
  private static loadScript(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (window.Razorpay) {
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.async = true;
      script.onload = () => resolve();
      script.onerror = () => reject(new Error('Failed to load Razorpay SDK'));
      document.head.appendChild(script);
    });
  }

  static async initializePayment(options: Partial<RazorpayOptions>): Promise<void> {
    try {
      await this.loadScript();

      const defaultOptions: RazorpayOptions = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: 0,
        currency: 'INR',
        name: 'Kovais 2026',
        description: 'Payment for recognition services',
        handler: (response: RazorpayResponse) => {
          console.log('Payment successful:', response);
          // Handle successful payment
          this.handlePaymentSuccess(response);
        },
        theme: {
          color: '#D4AF37' // Matching your gold theme
        },
        modal: {
          backdropclose: false,
          escape: false,
          handleback: false,
          confirm_close: true,
          persist: 'company'
        },
        retry: {
          enabled: true,
          max_count: 3
        },
        timeout: 300,
        redirect: true
      };

      const finalOptions = { ...defaultOptions, ...options };

      const rzp = new window.Razorpay(finalOptions);
      rzp.open();
    } catch (error) {
      console.error('Razorpay initialization error:', error);
      throw error;
    }
  }

  private static handlePaymentSuccess(response: RazorpayResponse) {
    // You can redirect to success page or show success message
    localStorage.setItem('razorpay_payment_id', response.razorpay_payment_id);
    
    // Show success message
    alert('Payment successful! Thank you for your purchase.');
    
    // Optionally redirect to success page
    // window.location.href = '/payment-success';
  }

  // Method for UPI payments
  static async initiateUPIPayment(amount: number, description: string) {
    return this.initializePayment({
      amount: amount * 100, // Razorpay expects amount in paise
      description,
      config: {
        display: {
          blocks: {
            banks: {
              name: 'Pay Using UPI',
              instruments: [
                {
                  method: 'upi',
                  flows: ['collect', 'intent', 'qr']
                }
              ]
            }
          },
          sequence: ['block.banks'],
          preferences: {
            show_default_blocks: false
          }
        }
      }
    });
  }

  // Method for Card payments
  static async initiateCardPayment(amount: number, description: string) {
    return this.initializePayment({
      amount: amount * 100,
      description,
      config: {
        display: {
          blocks: {
            banks: {
              name: 'Pay Using Card',
              instruments: [
                {
                  method: 'card'
                }
              ]
            }
          },
          sequence: ['block.banks'],
          preferences: {
            show_default_blocks: false
          }
        }
      }
    });
  }

  // Method for Net Banking
  static async initiateNetBankingPayment(amount: number, description: string) {
    return this.initializePayment({
      amount: amount * 100,
      description,
      config: {
        display: {
          blocks: {
            banks: {
              name: 'Pay Using Net Banking',
              instruments: [
                {
                  method: 'netbanking'
                }
              ]
            }
          },
          sequence: ['block.banks'],
          preferences: {
            show_default_blocks: false
          }
        }
      }
    });
  }

  // Method for all payment methods
  static async initiatePayment(amount: number, description: string) {
    return this.initializePayment({
      amount: amount * 100,
      description
    });
  }
}
