import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import { api, authHeader } from '../services/api';
import { addToCart } from '../features/cartSlice';
import ReviewStars from '../components/ui/ReviewStars';
import QuantityControl from '../components/ui/QuantityControl';
import ProductCard from '../components/ui/ProductCard';
import Loader from '../components/ui/Loader';
import 'swiper/css';
import 'swiper/css/navigation';

const ProductDetailPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.auth);
  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [qty, setQty] = useState(1);
  const [comment, setComment] = useState('');
  const [rating, setRating] = useState(5);

  useEffect(() => {
    const load = async () => {
      const productRes = await api.get(`/products/${id}`);
      setProduct(productRes.data);
      const relatedRes = await api.get('/products', { params: { category: productRes.data.category?._id } });
      setRelated(relatedRes.data.products.filter((p) => p._id !== id).slice(0, 8));
    };
    load();
  }, [id]);

  if (!product) return <Loader />;

  const addToCartHandler = () => {
    dispatch(
      addToCart({
        product: product._id,
        name: product.name,
        image: product.images[0],
        price: product.price,
        qty,
      })
    );
    toast.success('Added to cart');
  };

  const submitReview = async (e) => {
    e.preventDefault();
    if (!token) return toast.error('Please login to review');

    try {
      await api.post(`/products/${id}/reviews`, { rating, comment }, authHeader(token));
      toast.success('Review submitted');
      setComment('');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Could not submit review');
    }
  };

  return (
    <div className="space-y-12">
      <div className="grid gap-8 lg:grid-cols-2">
        <Swiper modules={[Navigation]} navigation className="rounded-2xl shadow-lg">
          {product.images.map((image) => (
            <SwiperSlide key={image}>
              <img src={image} alt={product.name} loading="lazy" className="h-105 w-full object-cover transition-transform duration-500 hover:scale-105" />
            </SwiperSlide>
          ))}
        </Swiper>

        <div>
          <p className="text-sm uppercase tracking-wide text-blue-500">{product.category?.name}</p>
          <h1 className="mt-2 font-display text-4xl font-bold text-slate-900 dark:text-white">{product.name}</h1>
          <div className="mt-3"><ReviewStars value={product.rating} /></div>
          <p className="mt-6 text-slate-600 dark:text-slate-300">{product.description}</p>
          <p className="mt-6 text-3xl font-semibold text-slate-900 dark:text-white">${product.price}</p>
          <p className="mt-2 text-sm text-slate-500">Stock: {product.stock > 0 ? 'In Stock' : 'Out of Stock'}</p>

          <div className="mt-6 flex items-center gap-4">
            <QuantityControl value={qty} max={product.stock || 1} onChange={setQty} />
            <button
              onClick={addToCartHandler}
              className="gradient-btn rounded-xl px-6 py-3 font-medium text-white transition-all duration-300 hover:scale-105 hover:shadow-lg"
            >
              Add to Cart
            </button>
          </div>
        </div>
      </div>

      <section className="section-frame p-6">
        <h2 className="font-display text-2xl font-bold">Reviews & Ratings</h2>
        <form onSubmit={submitReview} className="mt-4 space-y-3">
          <select value={rating} onChange={(e) => setRating(Number(e.target.value))} className="w-full rounded-lg border px-3 py-2 dark:bg-slate-800">
            {[5, 4, 3, 2, 1].map((r) => (
              <option key={r} value={r}>{r} Stars</option>
            ))}
          </select>
          <textarea value={comment} onChange={(e) => setComment(e.target.value)} rows={3} className="w-full rounded-lg border px-3 py-2 dark:bg-slate-800" placeholder="Write your review..." required />
          <button className="gradient-btn rounded-lg px-5 py-2 text-white">Submit Review</button>
        </form>

        <div className="mt-6 space-y-3">
          {product.reviews?.map((review) => (
            <div key={review._id} className="rounded-xl border border-slate-200 p-3 dark:border-slate-700">
              <div className="flex items-center justify-between">
                <p className="font-medium">{review.name}</p>
                <ReviewStars value={review.rating} />
              </div>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{review.comment}</p>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="font-display text-2xl font-bold text-slate-900 dark:text-white">Related Products</h2>
        <Swiper
          slidesPerView={1.1}
          spaceBetween={16}
          breakpoints={{ 640: { slidesPerView: 2 }, 1024: { slidesPerView: 3 } }}
          className="mt-4"
        >
          {related.map((item) => (
            <SwiperSlide key={item._id}><ProductCard product={item} /></SwiperSlide>
          ))}
        </Swiper>
      </section>
    </div>
  );
};

export default ProductDetailPage;
