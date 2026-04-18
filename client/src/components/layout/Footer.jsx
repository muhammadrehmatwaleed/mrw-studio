import { Link } from 'react-router-dom';
import { FiInstagram, FiMail, FiMapPin, FiPhone, FiTwitter } from 'react-icons/fi';

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-20 border-t border-slate-200/70 bg-linear-to-br from-slate-950 via-slate-900 to-cyan-950/60 text-slate-200">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-4 lg:px-8">
        <div>
          <h3 className="font-display text-2xl font-bold text-white">ModernCart</h3>
          <p className="mt-4 text-sm text-slate-300">
            Premium products, fast delivery, and stylish shopping experiences built for modern lifestyles.
          </p>
          <div className="mt-4 flex items-center gap-3 text-slate-300">
            <a href="#" className="rounded-full border border-slate-700 p-2 transition hover:border-cyan-400 hover:text-cyan-300" aria-label="Twitter">
              <FiTwitter />
            </a>
            <a href="#" className="rounded-full border border-slate-700 p-2 transition hover:border-cyan-400 hover:text-cyan-300" aria-label="Instagram">
              <FiInstagram />
            </a>
          </div>
        </div>

        <div>
          <h4 className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-300">Quick Links</h4>
          <div className="mt-4 flex flex-col gap-2 text-sm text-slate-300">
            <Link to="/" className="transition hover:text-white">Home</Link>
            <Link to="/shop" className="transition hover:text-white">Shop</Link>
            <a href="/#services" className="transition hover:text-white">Services</a>
            <a href="/#offers" className="transition hover:text-white">Offers</a>
            <a href="/#contact" className="transition hover:text-white">Contact</a>
          </div>
        </div>

        <div>
          <h4 className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-300">Customer Care</h4>
          <div className="mt-4 flex flex-col gap-2 text-sm text-slate-300">
            <p>24/7 support assistance</p>
            <p>Easy exchange & returns</p>
            <p>Secure card payments</p>
            <p>Live order tracking</p>
          </div>
        </div>

        <div>
          <h4 className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-300">Contact Info</h4>
          <div className="mt-4 space-y-3 text-sm text-slate-300">
            <p className="inline-flex items-center gap-2"><FiPhone /> +92 300 1234567</p>
            <p className="inline-flex items-center gap-2"><FiMail /> support@moderncart.com</p>
            <p className="inline-flex items-center gap-2"><FiMapPin /> Modern Cart ,Pakistan</p>
          </div>
        </div>
      </div>

      <div className="border-t border-slate-700/70 py-4 text-center text-xs tracking-wide text-slate-400">
        <p>Copyright {year} Muhammad Rehmat Waleed. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
