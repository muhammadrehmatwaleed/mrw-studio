import { NavLink, Outlet } from 'react-router-dom';

const links = [
  { to: '/admin', label: 'Overview' },
  { to: '/admin/products', label: 'Products' },
  { to: '/admin/offers', label: 'Offers' },
  { to: '/admin/categories', label: 'Categories' },
  { to: '/admin/orders', label: 'Orders' },
  { to: '/admin/users', label: 'Users' },
];

const AdminLayout = () => {
  return (
    <div className="grid gap-6 lg:grid-cols-[240px_1fr]">
      <aside className="h-fit rounded-2xl border border-white/60 bg-white/80 p-4 shadow-lg backdrop-blur dark:border-slate-700 dark:bg-slate-900/70">
        <h2 className="font-display text-xl font-bold">Admin Panel</h2>
        <nav className="mt-4 space-y-2">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === '/admin'}
              className={({ isActive }) =>
                `block rounded-xl px-3 py-2 transition-all ${isActive ? 'bg-blue-600 text-white' : 'hover:bg-slate-100 dark:hover:bg-slate-800'}`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>
      </aside>

      <main><Outlet /></main>
    </div>
  );
};

export default AdminLayout;
