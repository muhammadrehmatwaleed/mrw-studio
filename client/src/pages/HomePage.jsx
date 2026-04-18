import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiArrowRight, FiClock, FiHeadphones, FiMapPin, FiMail, FiPhone, FiShield, FiTruck } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { api } from '../services/api';
import HeroSlider from '../components/home/HeroSlider';
import CategoryGrid from '../components/home/CategoryGrid';
import ProductCard from '../components/ui/ProductCard';
import Loader from '../components/ui/Loader';
import ProductCardSkeleton from '../components/ui/ProductCardSkeleton';

const MotionDiv = motion.div;

const services = [
  {
    icon: FiTruck,
    title: 'Fast Nationwide Delivery',
    description: 'Get your orders delivered in 24-72 hours with live parcel tracking and secure packaging.',
  },
  {
    icon: FiShield,
    title: 'Verified Product Quality',
    description: 'Every listing is quality-checked before dispatch, so what you order is what you receive.',
  },
  {
    icon: FiHeadphones,
    title: '24/7 Customer Support',
    description: 'Need help with orders or returns? Our support team is available every day around the clock.',
  },
  {
    icon: FiClock,
    title: 'Hassle-Free Returns',
    description: 'Changed your mind? Return eligible items within 7 days with a smooth replacement process.',
  },
];

const productGallery = [
  {
    title: 'Urban Streetwear Capsule',
    image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=900&q=80',
  },
  {
    title: 'Smart Workspace Setup',
    image: 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&w=900&q=80',
  },
  {
    title: 'Warm Minimal Living',
    image: 'https://images.unsplash.com/photo-1484101403633-562f891dc89a?auto=format&fit=crop&w=900&q=80',
  },
  {
    title: 'Outdoor Performance Gear',
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=900&q=80',
  },
];

const HomePage = () => {
  const [categories, setCategories] = useState([]);
  const [trending, setTrending] = useState([]);
  const [offers, setOffers] = useState([]);
  const [contactForm, setContactForm] = useState({ name: '', email: '', message: '' });
  const [submittingContact, setSubmittingContact] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const [categoriesRes, trendingRes, offersRes] = await Promise.all([
        api.get('/categories'),
        api.get('/products/trending'),
        api.get('/offers').catch(() => ({ data: [] })),
      ]);
      setCategories(categoriesRes.data);
      setTrending(trendingRes.data);
      setOffers(Array.isArray(offersRes.data) ? offersRes.data : []);
      setLoading(false);
    };

    load().catch(() => setLoading(false));
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.16 }
    );

    const targets = document.querySelectorAll('.reveal-on-scroll');
    targets.forEach((target) => observer.observe(target));

    return () => observer.disconnect();
  }, [categories.length, trending.length, offers.length]);

  const onContactFieldChange = (event) => {
    const { name, value } = event.target;
    setContactForm((prev) => ({ ...prev, [name]: value }));
  };

  const onContactSubmit = async (event) => {
    event.preventDefault();

    if (!contactForm.name.trim() || !contactForm.email.trim() || !contactForm.message.trim()) {
      toast.error('Please fill out all contact fields');
      return;
    }

    setSubmittingContact(true);
    try {
      const { data } = await api.post('/contact', {
        name: contactForm.name,
        email: contactForm.email,
        message: contactForm.message,
      });

      toast.success(data?.message || 'Message sent successfully');
      setContactForm({ name: '', email: '', message: '' });
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Unable to send message right now');
    } finally {
      setSubmittingContact(false);
    }
  };

  const offerCards = offers.length
    ? offers
    : [
        {
          title: 'Weekend Flash Deal',
          subtitle: 'Up to 40% off on home essentials and decor picks.',
          highlight: 'Use code: WEEKEND40',
        },
        {
          title: 'Bundle & Save',
          subtitle: 'Buy any 2 fashion items and get an extra 15% discount.',
          highlight: 'Auto-applied at checkout',
        },
        {
          title: 'Free Delivery',
          subtitle: 'Enjoy free shipping on orders above $75 for a limited time.',
          highlight: 'No code required',
        },
      ];

  if (loading) {
    return (
      <div className="space-y-6">
        <Loader />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <MotionDiv key={index} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25, delay: index * 0.06 }}>
              <ProductCardSkeleton />
            </MotionDiv>
          ))}
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>ModernCart | Minimal eCommerce Experience</title>
        <meta name="description" content="Modern MERN eCommerce with smooth animations, premium cards, and responsive UX." />
      </Helmet>

      <HeroSlider />
      <CategoryGrid categories={categories} />

      <section className="reveal-on-scroll section-frame mt-18 p-6 sm:p-8" id="offers">
        <div className="mb-6 flex items-center justify-between gap-4">
          <h2 className="font-display text-3xl font-bold text-slate-900 dark:text-white sm:text-4xl">Live Offers</h2>
          <span className="rounded-full bg-amber-100 px-4 py-2 text-xs font-semibold tracking-[0.2em] text-amber-800 dark:bg-amber-300/10 dark:text-amber-300">
            LIMITED TIME
          </span>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {offerCards.map((offer, index) => (
            <article
              key={offer.title}
              style={{ animationDelay: `${index * 120}ms` }}
              className="reveal-on-scroll rounded-2xl border border-amber-200/60 bg-linear-to-br from-amber-50 via-white to-orange-100 p-6 shadow-lg shadow-orange-200/40 transition-transform duration-300 hover:-translate-y-1 dark:border-amber-300/20 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-orange-500">Special Offer</p>
              <h3 className="mt-3 font-display text-xl font-semibold text-slate-900 dark:text-slate-100">{offer.title}</h3>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{offer.subtitle}</p>
              <p className="mt-4 text-sm font-semibold text-orange-600 dark:text-orange-300">{offer.highlight}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="reveal-on-scroll mt-18" id="services">
        <h2 className="font-display text-3xl font-bold text-slate-900 dark:text-white sm:text-4xl">Our Services</h2>
        <p className="mt-3 max-w-3xl text-slate-600 dark:text-slate-300">
          Beyond products, we provide reliable services that make your shopping experience smooth, secure, and trustworthy.
        </p>
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {services.map((service, index) => {
            const Icon = service.icon;

            return (
              <article
                key={service.title}
                style={{ animationDelay: `${index * 100}ms` }}
                className="reveal-on-scroll glass-card neu-card rounded-2xl p-5 transition duration-300 hover:-translate-y-1 hover:shadow-xl dark:shadow-black/30"
              >
                <div className="inline-flex rounded-xl bg-sky-100 p-3 text-sky-700 dark:bg-sky-400/10 dark:text-sky-300">
                  <Icon size={20} />
                </div>
                <h3 className="mt-4 font-display text-lg font-semibold text-slate-900 dark:text-slate-100">{service.title}</h3>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{service.description}</p>
              </article>
            );
          })}
        </div>
      </section>

      <section className="reveal-on-scroll mt-18">
        <div className="mb-6 flex items-center justify-between gap-4">
          <h2 className="font-display text-3xl font-bold text-slate-900 dark:text-white sm:text-4xl">Trending Products</h2>
          <Link
            to="/shop"
            className="gradient-btn inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold text-white"
          >
            View all
            <FiArrowRight />
          </Link>
        </div>
        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {trending.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      </section>

      <section className="reveal-on-scroll mt-18">
        <div className="mb-6">
          <h2 className="font-display text-3xl font-bold text-slate-900 dark:text-white sm:text-4xl">More Product Looks</h2>
          <p className="mt-3 max-w-3xl text-slate-600 dark:text-slate-300">
            Browse fresh style inspiration from apparel, workspace, home decor, and outdoor collections.
          </p>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {productGallery.map((item, index) => (
            <article
              key={item.title}
              style={{ animationDelay: `${index * 120}ms` }}
              className="reveal-on-scroll group overflow-hidden rounded-2xl border border-white/60 bg-white shadow-lg shadow-slate-300/30 transition duration-300 hover:-translate-y-1 dark:border-slate-700 dark:bg-slate-900"
            >
              <div className="overflow-hidden">
                <img
                  src={item.image}
                  alt={item.title}
                  className="h-64 w-full object-cover transition duration-500 group-hover:scale-110"
                  loading="lazy"
                />
              </div>
              <div className="p-4">
                <p className="font-display text-lg font-semibold text-slate-900 dark:text-slate-100">{item.title}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section id="contact" className="reveal-on-scroll section-frame mt-18 overflow-hidden p-8">
        <div className="grid gap-8 lg:grid-cols-2">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sky-600 dark:text-sky-300">Contact Us</p>
            <h2 className="mt-3 font-display text-3xl font-bold text-slate-900 dark:text-slate-100 sm:text-4xl">We are here to help you anytime</h2>
            <p className="mt-4 text-slate-600 dark:text-slate-300">
              Questions about products, order updates, wholesale, or returns? Reach out and our support team will assist quickly.
            </p>
            <div className="mt-6 space-y-3 text-sm text-slate-700 dark:text-slate-200">
              <p className="inline-flex items-center gap-2"><FiPhone /> +92 300 1234567</p>
              <p className="inline-flex items-center gap-2"><FiMail /> support@moderncart.com</p>
              <p className="inline-flex items-center gap-2"><FiMapPin /> Modern Cart ,Pakistan</p>
            </div>
          </div>

          <form onSubmit={onContactSubmit} className="rounded-2xl border border-white/70 bg-white/90 p-5 shadow-lg backdrop-blur dark:border-slate-700 dark:bg-slate-900/60">
            <div className="grid gap-4">
              <input
                type="text"
                name="name"
                placeholder="Your Name"
                value={contactForm.name}
                onChange={onContactFieldChange}
                className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none ring-0 transition focus:border-sky-400 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
              />
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                value={contactForm.email}
                onChange={onContactFieldChange}
                className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none ring-0 transition focus:border-sky-400 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
              />
              <textarea
                rows={4}
                name="message"
                placeholder="How can we help?"
                value={contactForm.message}
                onChange={onContactFieldChange}
                className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none ring-0 transition focus:border-sky-400 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
              />
              <button
                type="submit"
                disabled={submittingContact}
                className="gradient-btn inline-flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
              >
                {submittingContact ? 'Sending...' : 'Send message'}
                <FiArrowRight />
              </button>
            </div>
          </form>
        </div>
      </section>
    </>
  );
};

export default HomePage;
