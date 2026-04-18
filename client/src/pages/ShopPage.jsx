import { useEffect, useMemo, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { api } from '../services/api';
import ProductCard from '../components/ui/ProductCard';
import ProductCardSkeleton from '../components/ui/ProductCardSkeleton';

const MotionDiv = motion.div;

const ShopPage = () => {
  const [searchParams] = useSearchParams();
  const initialSearch = searchParams.get('search') || '';
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(initialSearch);
  const [sort, setSort] = useState('newest');
  const [category, setCategory] = useState('');

  useEffect(() => {
    api.get('/categories').then((res) => setCategories(res.data));
  }, []);

  useEffect(() => {
    api
      .get('/products', { params: { search, sort, category } })
      .then((res) => setProducts(res.data.products))
      .finally(() => setLoading(false));
  }, [search, sort, category]);

  const onSearchChange = (event) => {
    setLoading(true);
    setSearch(event.target.value);
  };

  const onSortChange = (event) => {
    setLoading(true);
    setSort(event.target.value);
  };

  const onCategoryChange = (value) => {
    setLoading(true);
    setCategory(value);
  };

  const categoryName = useMemo(() => {
    return categories.find((c) => c._id === category)?.name || 'All';
  }, [categories, category]);

  return (
    <>
      <Helmet><title>Shop | ModernCart</title></Helmet>

      <MotionDiv
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className="section-frame mb-6 flex flex-col gap-4 p-4 md:flex-row md:items-center"
      >
        <input
          value={search}
          onChange={onSearchChange}
          placeholder="Search products..."
          className="w-full rounded-xl border border-white/70 bg-white/85 px-4 py-2.5 outline-none transition focus:border-cyan-400 focus:ring-4 focus:ring-cyan-300/35 dark:border-slate-700 dark:bg-slate-900/80 dark:focus:ring-cyan-500/20"
        />

        <select value={sort} onChange={onSortChange} className="rounded-xl border border-white/70 bg-white/85 px-4 py-2.5 outline-none transition focus:border-cyan-400 focus:ring-4 focus:ring-cyan-300/35 dark:border-slate-700 dark:bg-slate-900/80 dark:focus:ring-cyan-500/20">
          <option value="newest">Newest</option>
          <option value="priceAsc">Price: Low to High</option>
          <option value="priceDesc">Price: High to Low</option>
          <option value="popularity">Popularity</option>
        </select>
      </MotionDiv>

      <div className="grid gap-6 lg:grid-cols-[240px_1fr]">
        <aside className="section-frame p-4">
          <h3 className="font-display text-lg font-semibold">Categories</h3>
          <button onClick={() => onCategoryChange('')} className={`mt-3 block w-full rounded-lg px-3 py-2 text-left text-sm transition ${!category ? 'gradient-btn text-white' : 'hover:bg-slate-100 dark:hover:bg-slate-800'}`}>
            All
          </button>
          {categories.map((c) => (
            <button
              key={c._id}
              onClick={() => onCategoryChange(c._id)}
              className={`mt-2 block w-full rounded-lg px-3 py-2 text-left text-sm transition ${category === c._id ? 'gradient-btn text-white' : 'hover:bg-slate-100 dark:hover:bg-slate-800'}`}
            >
              {c.name}
            </button>
          ))}
        </aside>

        <section>
          <p className="mb-4 text-sm text-slate-500 dark:text-slate-300">Showing category: {categoryName}</p>
          {loading ? (
            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {Array.from({ length: 6 }).map((_, index) => (
                <MotionDiv
                  key={index}
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.28, delay: index * 0.05 }}
                >
                  <ProductCardSkeleton />
                </MotionDiv>
              ))}
            </div>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}

          {!loading && products.length === 0 ? (
            <div className="section-frame mt-5 p-6 text-center">
              <p className="text-sm text-slate-600 dark:text-slate-300">No products match this filter. Try another search or category.</p>
            </div>
          ) : null}
        </section>
      </div>
    </>
  );
};

export default ShopPage;
