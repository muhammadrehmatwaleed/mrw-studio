import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js';
import toast from 'react-hot-toast';

const cardStyle = {
  style: {
    base: {
      fontSize: '16px',
      color: '#0f172a',
      '::placeholder': { color: '#64748b' },
    },
    invalid: {
      color: '#dc2626',
    },
  },
};

const StripeCardForm = ({ amount, onPaid, disabled }) => {
  const stripe = useStripe();
  const elements = useElements();

  const handlePay = async () => {
    if (!stripe || !elements) {
      toast.error('Stripe is loading. Please try again.');
      return;
    }

    const card = elements.getElement(CardElement);
    if (!card) {
      toast.error('Card input is unavailable');
      return;
    }

    const result = await stripe.confirmCardPayment(amount.clientSecret, {
      payment_method: { card },
    });

    if (result.error) {
      toast.error(result.error.message || 'Card payment failed');
      return;
    }

    if (result.paymentIntent?.status === 'succeeded') {
      onPaid(result.paymentIntent);
    } else {
      toast.error('Payment was not completed');
    }
  };

  return (
    <div className="space-y-3 rounded-xl border border-slate-200 p-4 dark:border-slate-700">
      <p className="text-sm text-slate-500 dark:text-slate-300">Secure card payment powered by Stripe</p>
      <div className="rounded-lg border border-slate-200 bg-white px-3 py-3 dark:border-slate-700 dark:bg-slate-800">
        <CardElement options={cardStyle} />
      </div>
      <button
        type="button"
        onClick={handlePay}
        disabled={disabled || !stripe}
        className="w-full rounded-xl bg-blue-600 px-4 py-3 font-medium text-white transition-all hover:shadow-lg disabled:opacity-50"
      >
        Pay ${amount.totalLabel}
      </button>
    </div>
  );
};

export default StripeCardForm;
