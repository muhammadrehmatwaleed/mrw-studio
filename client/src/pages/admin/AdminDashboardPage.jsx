import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { api, authHeader } from '../../services/api';
import Loader from '../../components/ui/Loader';

const AdminDashboardPage = () => {
  const { token } = useSelector((state) => state.auth);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    api.get('/admin/stats', authHeader(token)).then((res) => setStats(res.data));
  }, [token]);

  if (!stats) return <Loader />;

  const cards = [
    { label: 'Users', value: stats.counts.users },
    { label: 'Products', value: stats.counts.products },
    { label: 'Orders', value: stats.counts.orders },
    { label: 'Sales', value: `$${stats.totalSales.toFixed(2)}` },
  ];

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => (
          <article key={card.label} className="rounded-2xl border border-white/60 bg-white/80 p-5 shadow-md backdrop-blur dark:border-slate-700 dark:bg-slate-900/70">
            <p className="text-sm text-slate-500">{card.label}</p>
            <h3 className="mt-2 font-display text-3xl font-bold text-slate-900 dark:text-slate-100">{card.value}</h3>
          </article>
        ))}
      </div>

      <section className="rounded-2xl border bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900">
        <h2 className="font-display text-xl font-bold">Sales Analytics</h2>
        <div className="mt-6 h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={stats.salesByMonth.map((x) => ({ month: x._id, sales: x.total }))}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="sales" stroke="#2563eb" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </section>
    </div>
  );
};

export default AdminDashboardPage;
