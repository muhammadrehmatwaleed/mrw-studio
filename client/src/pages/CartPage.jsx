import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart, removeFromCart } from '../features/cartSlice';
import QuantityControl from '../components/ui/QuantityControl';

const CartPage = () => {
  const { items } = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const subtotal = items.reduce((acc, item) => acc + item.price * item.qty, 0);

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
      <section className="space-y-4">
        {items.length === 0 ? (
          <p className="section-frame p-6 text-sm text-slate-700 dark:text-slate-200">Your cart is empty. <Link to="/shop" className="font-semibold text-cyan-600 dark:text-cyan-300">Go shopping</Link></p>
        ) : (
          items.map((item) => (
            <article key={item.product} className="glass-card flex flex-col gap-4 rounded-2xl p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-4">
                <img src={item.image} alt={item.name} loading="lazy" className="h-20 w-20 rounded-xl object-cover" />
                <div>
                  <h3 className="font-display text-lg font-semibold">{item.name}</h3>
                  <p className="text-slate-500">${item.price}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <QuantityControl
                  value={item.qty}
                  onChange={(qty) => dispatch(addToCart({ ...item, qty }))}
                />
                <button onClick={() => dispatch(removeFromCart(item.product))} className="rounded-lg bg-rose-100 px-3 py-2 text-rose-600 transition hover:bg-rose-200 dark:bg-rose-500/15 dark:text-rose-300">
                  Remove
                </button>
              </div>
            </article>
          ))
        )}
      </section>

      <aside className="section-frame h-fit p-6">
        <h2 className="font-display text-xl font-bold">Order Summary</h2>
        <div className="mt-4 flex justify-between"><span>Subtotal</span><span>${subtotal.toFixed(2)}</span></div>
        <div className="mt-2 flex justify-between"><span>Shipping</span><span>${items.length ? '10.00' : '0.00'}</span></div>
        <div className="mt-2 flex justify-between text-lg font-semibold"><span>Total</span><span>${(subtotal + (items.length ? 10 : 0)).toFixed(2)}</span></div>
        <button
          onClick={() => navigate('/checkout')}
          disabled={!items.length}
          className="gradient-btn mt-5 w-full rounded-xl px-4 py-3 font-medium text-white disabled:opacity-40"
        >
          Proceed to Checkout
        </button>
      </aside>
    </div>
  );
};

export default CartPage;
