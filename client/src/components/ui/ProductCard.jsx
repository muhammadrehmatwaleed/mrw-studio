import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiShoppingBag, FiZap } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import { addToCart } from '../../features/cartSlice';

const MotionSpan = motion.span;
const MotionButton = motion.button;

const ProductCard = ({ product }) => {
  const dispatch = useDispatch();
  const [imageLoaded, setImageLoaded] = useState(false);

  const badge = useMemo(() => {
    if (product.isFeatured) return { label: 'Trending', tone: 'from-cyan-500 to-blue-600' };
    if (product.soldCount > 20 || product.numReviews > 12) return { label: 'Hot', tone: 'from-orange-500 to-rose-500' };
    if (product.createdAt && product.numReviews <= 2) {
      return { label: 'New', tone: 'from-emerald-500 to-lime-500' };
    }
    return { label: 'Sale', tone: 'from-violet-500 to-indigo-500' };
  }, [product.createdAt, product.isFeatured, product.numReviews, product.soldCount]);

  const addToCartHandler = () => {
    dispatch(
      addToCart({
        product: product._id,
        name: product.name,
        image: product.images?.[0],
        price: product.price,
        qty: 1,
      })
    );
    toast.success(`${product.name} added to cart`);
  };

  return (
    <article className="group glass-card relative overflow-hidden rounded-3xl border border-white/60 p-4 shadow-lg shadow-slate-200/35 transition-all duration-500 hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-cyan-400/15 dark:border-slate-700 dark:shadow-black/30">
      <MotionSpan
        className="absolute -right-6 -top-8 h-28 w-28 rounded-full bg-cyan-200/35 blur-2xl dark:bg-cyan-400/15"
        animate={{ scale: [1, 1.16, 1], opacity: [0.55, 0.88, 0.55] }}
        transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
      />

      <Link to={`/product/${product._id}`}>
        <div className="relative overflow-hidden rounded-2xl">
          {!imageLoaded ? <div className="skeleton absolute inset-0 z-10" /> : null}
          <img
            src={product.images?.[0]}
            alt={product.name}
            loading="lazy"
            onLoad={() => setImageLoaded(true)}
            className={`h-56 w-full object-cover transition-all duration-700 group-hover:scale-112 ${
              imageLoaded ? 'opacity-100' : 'opacity-0'
            }`}
          />

          <MotionSpan
            className={`absolute left-3 top-3 rounded-full bg-linear-to-r ${badge.tone} px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-white`}
            animate={{ y: [0, -2, 0] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
          >
            {badge.label}
          </MotionSpan>
        </div>
      </Link>

      <div className="pt-4">
        <p className="text-xs uppercase tracking-wider text-cyan-600 dark:text-cyan-300">{product.category?.name || 'General'}</p>
        <Link to={`/product/${product._id}`} className="mt-1 block font-display text-lg font-semibold text-slate-900 transition-colors group-hover:text-cyan-600 dark:text-slate-100 dark:group-hover:text-cyan-300">
          {product.name}
        </Link>
        <div className="mt-2 flex items-center justify-between">
          <span className="text-lg font-semibold text-slate-900 dark:text-slate-100">${product.price}</span>
          <span className="inline-flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
            <FiZap className="text-amber-500" />
            {product.numReviews} reviews
          </span>
        </div>

        <MotionButton
          type="button"
          whileTap={{ scale: 0.97 }}
          onClick={addToCartHandler}
          className="gradient-btn mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-white"
        >
          <FiShoppingBag />
          Add to Cart
        </MotionButton>
      </div>
    </article>
  );
};

export default ProductCard;
