import { Link, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { FiShoppingBag, FiX } from 'react-icons/fi';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart, removeFromCart } from '../../features/cartSlice';
import QuantityControl from '../ui/QuantityControl';

const MotionButton = motion.button;
const MotionAside = motion.aside;

const CartDrawer = ({ isOpen, onClose }) => {
  const { items } = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const subtotal = items.reduce((acc, item) => acc + item.price * item.qty, 0);
  const shipping = items.length ? 10 : 0;
  const total = subtotal + shipping;

  const checkoutHandler = () => {
    onClose();
    navigate('/checkout');
  };

  return (
    <AnimatePresence>
      {isOpen ? (
        <>
          <MotionButton
            aria-label="Close cart drawer"
            className="fixed inset-0 z-70 bg-slate-950/50 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
          />

          <MotionAside
            className="fixed right-0 top-0 z-80 flex h-full w-full max-w-md flex-col border-l border-white/30 bg-white/88 p-5 shadow-2xl shadow-black/20 backdrop-blur-xl dark:border-slate-700/50 dark:bg-slate-950/88"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 32 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-cyan-600 dark:text-cyan-300">Quick Cart</p>
                <h2 className="font-display text-2xl font-bold text-slate-900 dark:text-slate-100">Your Items</h2>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="rounded-full border border-slate-200 p-2 text-slate-700 transition hover:scale-105 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
              >
                <FiX size={18} />
              </button>
            </div>

            <div className="mt-6 flex-1 space-y-4 overflow-y-auto pr-1">
              {items.length ? (
                items.map((item) => (
                  <article
                    key={item.product}
                    className="glass-card flex items-center gap-3 rounded-2xl p-3"
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      loading="lazy"
                      className="h-20 w-20 rounded-xl object-cover"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-display text-base font-semibold text-slate-900 dark:text-slate-100">{item.name}</p>
                      <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-300">${item.price}</p>
                      <div className="mt-2">
                        <QuantityControl
                          value={item.qty}
                          onChange={(qty) => dispatch(addToCart({ ...item, qty }))}
                        />
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => dispatch(removeFromCart(item.product))}
                      className="rounded-lg bg-rose-100 px-2.5 py-1.5 text-xs font-semibold text-rose-600 transition hover:bg-rose-200 dark:bg-rose-500/15 dark:text-rose-300"
                    >
                      Remove
                    </button>
                  </article>
                ))
              ) : (
                <div className="flex h-full min-h-52 flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white/50 text-center dark:border-slate-700 dark:bg-slate-900/40">
                  <FiShoppingBag size={34} className="text-slate-400 dark:text-slate-500" />
                  <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">Your cart is waiting for something great.</p>
                  <Link
                    to="/shop"
                    onClick={onClose}
                    className="mt-3 rounded-full bg-slate-900 px-4 py-2 text-xs font-semibold text-white dark:bg-slate-100 dark:text-slate-900"
                  >
                    Explore products
                  </Link>
                </div>
              )}
            </div>

            <div className="mt-5 rounded-2xl border border-white/50 bg-white/55 p-4 shadow-sm dark:border-slate-700 dark:bg-slate-900/60">
              <div className="flex items-center justify-between text-sm text-slate-600 dark:text-slate-300">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="mt-2 flex items-center justify-between text-sm text-slate-600 dark:text-slate-300">
                <span>Shipping</span>
                <span>${shipping.toFixed(2)}</span>
              </div>
              <div className="mt-3 flex items-center justify-between text-lg font-semibold text-slate-900 dark:text-slate-100">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>

              <button
                type="button"
                disabled={!items.length}
                onClick={checkoutHandler}
                className="gradient-btn mt-4 w-full rounded-xl px-4 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
              >
                Go to checkout
              </button>
            </div>
          </MotionAside>
        </>
      ) : null}
    </AnimatePresence>
  );
};

export default CartDrawer;
