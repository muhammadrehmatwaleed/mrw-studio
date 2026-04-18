import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { api, authHeader } from '../services/api';
import { clearCart } from '../features/cartSlice';
import StripeCardForm from '../components/checkout/StripeCardForm';

const stripePromise = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY
  ? loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY)
  : null;

const CheckoutPage = () => {
  const { items } = useSelector((state) => state.cart);
  const { token } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    fullName: '',
    address: '',
    city: '',
    postalCode: '',
    country: '',
    paymentMethod: 'card',
  });
  const [intentData, setIntentData] = useState(null);
  const [loadingIntent, setLoadingIntent] = useState(false);

  const subtotal = items.reduce((acc, item) => acc + item.price * item.qty, 0);
  const totalAmount = subtotal + (items.length ? 10 : 0);

  const changeHandler = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    if (form.paymentMethod === 'card') {
      toast.error('Complete the Stripe card payment section first');
      return;
    }

    try {
      const payload = {
        items,
        shippingAddress: {
          fullName: form.fullName,
          address: form.address,
          city: form.city,
          postalCode: form.postalCode,
          country: form.country,
        },
        paymentMethod: form.paymentMethod,
        totalAmount,
      };

      const { data } = await api.post('/orders', payload, authHeader(token));
      dispatch(clearCart());
      toast.success('Order placed successfully');
      navigate(`/order-confirmation/${data._id}`);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Checkout failed');
    }
  };

  const createIntentHandler = async () => {
    if (!token) return;
    if (!stripePromise) {
      toast.error('Missing Stripe publishable key in client env');
      return;
    }

    try {
      setLoadingIntent(true);
      const amountInCents = Math.round(totalAmount * 100);
      const { data } = await api.post(
        '/payments/create-intent',
        { amount: amountInCents, currency: 'usd', metadata: { source: 'checkout' } },
        authHeader(token)
      );

      setIntentData({ clientSecret: data.clientSecret, totalLabel: totalAmount.toFixed(2) });
      toast.success('Card session ready');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Could not initialize Stripe payment');
    } finally {
      setLoadingIntent(false);
    }
  };

  const placeOrderAfterPayment = async (paymentIntent) => {
    try {
      const payload = {
        items,
        shippingAddress: {
          fullName: form.fullName,
          address: form.address,
          city: form.city,
          postalCode: form.postalCode,
          country: form.country,
        },
        paymentMethod: form.paymentMethod,
        totalAmount,
        paymentResult: {
          id: paymentIntent.id,
          status: paymentIntent.status,
          updateTime: new Date().toISOString(),
          emailAddress: paymentIntent.receipt_email || '',
        },
      };

      const { data } = await api.post('/orders', payload, authHeader(token));
      dispatch(clearCart());
      toast.success('Order placed successfully');
      navigate(`/order-confirmation/${data._id}`);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Order creation failed after payment');
    }
  };

  return (
    <form onSubmit={submitHandler} className="grid gap-6 lg:grid-cols-[1fr_320px]">
      <section className="space-y-4 rounded-2xl border bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900">
        <h1 className="font-display text-2xl font-bold">Billing & Shipping</h1>
        {['fullName', 'address', 'city', 'postalCode', 'country'].map((field) => (
          <input
            key={field}
            name={field}
            value={form[field]}
            onChange={changeHandler}
            placeholder={field.replace(/([A-Z])/g, ' $1')}
            className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none ring-blue-200 focus:ring dark:border-slate-700 dark:bg-slate-800"
            required
          />
        ))}

        <select name="paymentMethod" value={form.paymentMethod} onChange={changeHandler} className="w-full rounded-xl border border-slate-200 px-4 py-3 dark:border-slate-700 dark:bg-slate-800">
          <option value="card">Card (Stripe)</option>
          <option value="paypal">PayPal (Mock)</option>
        </select>

        {form.paymentMethod === 'card' && (
          <div className="space-y-3">
            {!intentData && (
              <button
                type="button"
                onClick={createIntentHandler}
                disabled={loadingIntent || !items.length}
                className="w-full rounded-xl bg-slate-900 px-4 py-3 font-medium text-white transition-all hover:shadow-lg disabled:opacity-40 dark:bg-slate-100 dark:text-slate-900"
              >
                {loadingIntent ? 'Initializing secure payment...' : 'Initialize Card Payment'}
              </button>
            )}

            {intentData && stripePromise && (
              <Elements stripe={stripePromise} options={{ clientSecret: intentData.clientSecret }}>
                <StripeCardForm amount={intentData} onPaid={placeOrderAfterPayment} disabled={!items.length} />
              </Elements>
            )}
          </div>
        )}
      </section>

      <aside className="h-fit rounded-2xl border bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900">
        <h2 className="font-display text-xl font-bold">Order Summary</h2>
        <p className="mt-3 text-sm text-slate-500">{items.length} items</p>
        <div className="mt-4 flex justify-between"><span>Subtotal</span><span>${subtotal.toFixed(2)}</span></div>
        <div className="mt-2 flex justify-between"><span>Shipping</span><span>${items.length ? '10.00' : '0.00'}</span></div>
        <div className="mt-2 flex justify-between text-lg font-semibold"><span>Total</span><span>${totalAmount.toFixed(2)}</span></div>
        <button
          disabled={form.paymentMethod === 'card'}
          className="mt-5 w-full rounded-xl bg-blue-600 px-4 py-3 font-medium text-white transition-all hover:shadow-lg disabled:opacity-40"
        >
          {form.paymentMethod === 'card' ? 'Use Stripe Card Box Above' : 'Pay & Confirm'}
        </button>
      </aside>
    </form>
  );
};

export default CheckoutPage;
