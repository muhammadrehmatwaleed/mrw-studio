import { useEffect, useMemo, useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { FiChevronDown, FiMoon, FiSearch, FiShoppingCart, FiSun, FiUser } from 'react-icons/fi';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../features/authSlice';
import { api } from '../../services/api';

const navClass = ({ isActive }) =>
  `transition-all duration-300 ${isActive ? 'text-cyan-600 dark:text-cyan-300' : 'text-slate-700 dark:text-slate-200 hover:text-cyan-500'}`;

const MotionDiv = motion.div;
const MotionSpan = motion.span;

const Navbar = ({ theme, setTheme, onCartOpen }) => {
  const { user } = useSelector((state) => state.auth);
  const { items } = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchSuggestions, setSearchSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const itemCount = useMemo(() => items.reduce((acc, item) => acc + item.qty, 0), [items]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });

    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const cleanValue = searchTerm.trim();
    if (cleanValue.length < 2) {
      return;
    }

    const timeoutId = setTimeout(async () => {
      try {
        const { data } = await api.get('/products', {
          params: { search: cleanValue, pageSize: 5, sort: 'popularity' },
        });
        setSearchSuggestions(data?.products || []);
      } catch {
        setSearchSuggestions([]);
      }
    }, 220);

    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  const logoutHandler = () => {
    dispatch(logout());
    navigate('/login');
  };

  const openProductFromSuggestion = (id) => {
    setShowSuggestions(false);
    setSearchTerm('');
    navigate(`/product/${id}`);
  };

  const onSearchSubmit = (event) => {
    event.preventDefault();
    const cleanValue = searchTerm.trim();
    if (!cleanValue) return;

    setShowSuggestions(false);
    navigate(`/shop?search=${encodeURIComponent(cleanValue)}`);
  };

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'border-b border-white/45 bg-white/66 shadow-lg shadow-slate-300/25 backdrop-blur-2xl dark:border-slate-700/50 dark:bg-slate-900/72 dark:shadow-black/30'
          : 'border-b border-transparent bg-white/40 backdrop-blur-xl dark:bg-slate-900/45'
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link to="/" className="font-display text-2xl font-bold text-slate-900 dark:text-white">
          MRW Studio
        </Link>

        <nav className="hidden items-center gap-6 lg:flex">
          <NavLink to="/" className={navClass}>Home</NavLink>
          <NavLink to="/shop" className={navClass}>Shop</NavLink>
          <div className="group relative">
            <button type="button" className="inline-flex items-center gap-1.5 text-slate-700 transition-colors hover:text-cyan-500 dark:text-slate-200 dark:hover:text-cyan-300">
              Collections
              <FiChevronDown className="text-sm transition-transform duration-300 group-hover:rotate-180" />
            </button>
            <div className="pointer-events-none absolute left-0 top-full mt-3 w-52 translate-y-2 rounded-2xl border border-white/50 bg-white/90 p-2 opacity-0 shadow-xl shadow-slate-300/20 backdrop-blur-xl transition-all duration-300 group-hover:pointer-events-auto group-hover:translate-y-0 group-hover:opacity-100 dark:border-slate-700 dark:bg-slate-900/90 dark:shadow-black/35">
              <a href="/#offers" className="block rounded-xl px-3 py-2 text-sm text-slate-700 transition hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800">Offers</a>
              <a href="/#services" className="mt-1 block rounded-xl px-3 py-2 text-sm text-slate-700 transition hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800">Services</a>
              <a href="/#contact" className="mt-1 block rounded-xl px-3 py-2 text-sm text-slate-700 transition hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800">Contact</a>
            </div>
          </div>
          <a href="/#services" className="text-slate-700 transition-colors duration-300 hover:text-blue-500 dark:text-slate-200 dark:hover:text-blue-400">Services</a>
          <NavLink to="/dashboard" className={navClass}>Dashboard</NavLink>
          {user?.role === 'admin' && <NavLink to="/admin" className={navClass}>Admin</NavLink>}
        </nav>

        <div className="relative mx-5 hidden w-full max-w-sm flex-1 xl:block">
          <form onSubmit={onSearchSubmit}>
            <FiSearch className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 dark:text-slate-300" />
            <input
              type="search"
              value={searchTerm}
              onFocus={() => setShowSuggestions(true)}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Search premium picks..."
              className="w-full rounded-full border border-white/70 bg-white/78 py-2.5 pl-11 pr-4 text-sm text-slate-900 outline-none transition focus:border-cyan-400 focus:ring-4 focus:ring-cyan-300/35 dark:border-slate-700 dark:bg-slate-900/70 dark:text-slate-100 dark:focus:ring-cyan-500/20"
            />
          </form>

          <AnimatePresence>
            {showSuggestions && searchTerm.trim().length > 1 ? (
              <MotionDiv
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 8 }}
                transition={{ duration: 0.18 }}
                className="absolute left-0 right-0 top-[calc(100%+10px)] z-30 rounded-2xl border border-white/60 bg-white/92 p-2 shadow-2xl shadow-slate-300/30 backdrop-blur-xl dark:border-slate-700 dark:bg-slate-900/92 dark:shadow-black/30"
              >
                {searchSuggestions.length ? (
                  searchSuggestions.map((suggestion) => (
                    <button
                      type="button"
                      key={suggestion._id}
                      onMouseDown={(event) => event.preventDefault()}
                      onClick={() => openProductFromSuggestion(suggestion._id)}
                      className="group flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left transition hover:bg-slate-100 dark:hover:bg-slate-800"
                    >
                      <img
                        src={suggestion.images?.[0]}
                        alt={suggestion.name}
                        loading="lazy"
                        className="h-11 w-11 rounded-lg object-cover"
                      />
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-slate-900 dark:text-slate-100">{suggestion.name}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-300">${suggestion.price}</p>
                      </div>
                    </button>
                  ))
                ) : (
                  <p className="px-3 py-2 text-sm text-slate-500 dark:text-slate-300">No products found yet.</p>
                )}
              </MotionDiv>
            ) : null}
          </AnimatePresence>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="rounded-full border border-slate-200 bg-white/65 p-2 text-slate-700 transition-all hover:scale-105 hover:shadow-md dark:border-slate-700 dark:bg-slate-900/70 dark:text-slate-200"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <FiSun /> : <FiMoon />}
          </button>

          <button
            type="button"
            onClick={onCartOpen}
            className="relative rounded-full border border-slate-200 bg-white/65 p-2 text-slate-700 transition-all hover:scale-105 hover:shadow-md dark:border-slate-700 dark:bg-slate-900/70 dark:text-slate-200"
            aria-label="Open cart"
          >
            <FiShoppingCart />
            {!!itemCount && (
              <MotionSpan
                initial={{ scale: 0.7, opacity: 0.5 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: 'spring', stiffness: 400, damping: 18 }}
                className="absolute -right-1 -top-1 rounded-full bg-cyan-600 px-1.5 text-xs text-white"
              >
                {itemCount}
              </MotionSpan>
            )}
          </button>

          <Link
            to="/cart"
            className="hidden rounded-full border border-slate-200 bg-white/65 px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:shadow-md dark:border-slate-700 dark:bg-slate-900/70 dark:text-slate-200 sm:inline-flex"
          >
            Cart page
          </Link>

          {user ? (
            <button onClick={logoutHandler} className="gradient-btn rounded-full px-4 py-2 text-sm font-medium text-white transition-all hover:shadow-lg">
              Logout
            </button>
          ) : (
            <Link to="/login" className="gradient-btn rounded-full px-4 py-2 text-sm font-medium text-white transition-all hover:shadow-lg">
              <span className="inline-flex items-center gap-2"><FiUser /> Login</span>
            </Link>
          )}
        </div>
      </div>

      <div className="border-t border-white/40 px-4 py-2 md:hidden dark:border-slate-700/40">
        <div className="mx-auto flex max-w-7xl items-center gap-4 overflow-x-auto text-sm">
          <a href="/#offers" className="whitespace-nowrap text-slate-700 transition-colors hover:text-blue-500 dark:text-slate-200 dark:hover:text-blue-400">Offers</a>
          <a href="/#services" className="whitespace-nowrap text-slate-700 transition-colors hover:text-blue-500 dark:text-slate-200 dark:hover:text-blue-400">Services</a>
          <a href="/#contact" className="whitespace-nowrap text-slate-700 transition-colors hover:text-blue-500 dark:text-slate-200 dark:hover:text-blue-400">Contact</a>
          <Link to="/shop" className="whitespace-nowrap text-slate-700 transition-colors hover:text-blue-500 dark:text-slate-200 dark:hover:text-blue-400">Trending</Link>
        </div>
      </div>

      {showSuggestions ? <button className="fixed inset-0 z-20" type="button" onClick={() => setShowSuggestions(false)} aria-label="Close suggestions" /> : null}
    </header>
  );
};

export default Navbar;
