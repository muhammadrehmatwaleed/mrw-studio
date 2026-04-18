import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import { Link } from 'react-router-dom';
import { FiArrowRight } from 'react-icons/fi';
import 'swiper/css';
import 'swiper/css/pagination';

const slides = [
  {
    title: 'Elevate Everyday Living',
    subtitle: 'Discover curated essentials with premium quality and minimalist design for every room and routine.',
    image: 'https://images.unsplash.com/photo-1555529771-35a47c7f02f3?auto=format&fit=crop&w=1600&q=80',
    tag: 'Premium Home Picks',
  },
  {
    title: 'Modern Looks, Timeless Feel',
    subtitle: 'New arrivals crafted to blend comfort, style, and performance from streetwear to workwear.',
    image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=1600&q=80',
    tag: 'New Season Drop',
  },
  {
    title: 'Gear Up For Every Journey',
    subtitle: 'Travel, fitness, and everyday tech curated to move with your lifestyle.',
    image: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1600&q=80',
    tag: 'Adventure Essentials',
  },
];

const HeroSlider = () => {
  return (
    <Swiper
      modules={[Autoplay, Pagination]}
      autoplay={{ delay: 4000 }}
      pagination={{ clickable: true }}
      loop
      className="hero-swiper overflow-hidden rounded-3xl shadow-2xl shadow-sky-200/35"
    >
      {slides.map((slide) => (
        <SwiperSlide key={slide.title}>
          <div className="relative h-[66vh]" style={{ minHeight: '430px' }}>
            <img src={slide.image} alt={slide.title} className="h-full w-full object-cover" loading="lazy" />
            <div className="absolute inset-0 bg-linear-to-r from-slate-950/78 via-slate-900/52 to-transparent" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_15%,rgba(14,165,233,0.22),transparent_35%)]" />

            <div className="absolute left-7 top-1/2 max-w-2xl -translate-y-1/2 text-white sm:left-12 lg:left-16">
              <p className="mb-4 inline-flex rounded-full border border-white/30 bg-white/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.2em] backdrop-blur">
                {slide.tag}
              </p>
              <h1 className="font-display text-4xl font-extrabold leading-tight sm:text-5xl lg:text-6xl">{slide.title}</h1>
              <p className="mt-4 max-w-xl text-sm text-slate-100 sm:text-base">{slide.subtitle}</p>
              <div className="mt-7 flex flex-wrap items-center gap-3">
                <Link
                  to="/shop"
                  className="gradient-btn inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-semibold text-white"
                >
                  Shop now
                  <FiArrowRight />
                </Link>
                <a
                  href="/#offers"
                  className="inline-flex items-center gap-2 rounded-full border border-white/45 bg-white/10 px-5 py-3 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/20"
                >
                  View offers
                </a>
              </div>
            </div>
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

export default HeroSlider;
