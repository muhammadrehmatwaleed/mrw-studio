import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { api, authHeader } from '../services/api';
import { setCredentials } from '../features/authSlice';

const UserDashboardPage = () => {
  const dispatch = useDispatch();
  const { token, user } = useSelector((state) => state.auth);
  const [orders, setOrders] = useState([]);
  const [profile, setProfile] = useState({ name: user?.name || '', email: user?.email || '', password: '' });

  useEffect(() => {
    api.get('/orders/mine', authHeader(token)).then((res) => setOrders(res.data));
  }, [token]);

  const updateProfile = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.put('/auth/me', profile, authHeader(token));
      dispatch(setCredentials(data));
      toast.success('Profile updated');
      setProfile((prev) => ({ ...prev, password: '' }));
    } catch (error) {
      toast.error(error.response?.data?.message || 'Update failed');
    }
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[360px_1fr]">
      <section className="rounded-2xl border bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900">
        <h1 className="font-display text-2xl font-bold">Profile</h1>
        <form onSubmit={updateProfile} className="mt-4 space-y-3">
          <input value={profile.name} onChange={(e) => setProfile({ ...profile, name: e.target.value })} className="w-full rounded-lg border px-3 py-2 dark:border-slate-700 dark:bg-slate-800" />
          <input value={profile.email} onChange={(e) => setProfile({ ...profile, email: e.target.value })} className="w-full rounded-lg border px-3 py-2 dark:border-slate-700 dark:bg-slate-800" />
          <input type="password" value={profile.password} onChange={(e) => setProfile({ ...profile, password: e.target.value })} placeholder="New password (optional)" className="w-full rounded-lg border px-3 py-2 dark:border-slate-700 dark:bg-slate-800" />
          <button className="w-full rounded-lg bg-blue-600 px-4 py-2 text-white">Save Changes</button>
        </form>
      </section>

      <section className="rounded-2xl border bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900">
        <h2 className="font-display text-2xl font-bold">Order History</h2>
        <div className="mt-4 space-y-3">
          {orders.map((order) => (
            <article key={order._id} className="rounded-xl border p-4 dark:border-slate-700">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="text-sm text-slate-500">{new Date(order.createdAt).toLocaleDateString()}</p>
                <span className="rounded-full bg-slate-100 px-3 py-1 text-sm dark:bg-slate-800">{order.status}</span>
              </div>
              <p className="mt-2 font-medium">{order.items.length} items</p>
              <p className="text-lg font-semibold">${order.totalAmount.toFixed(2)}</p>
            </article>
          ))}
          {!orders.length && <p className="text-slate-500">No orders yet.</p>}
        </div>
      </section>
    </div>
  );
};

export default UserDashboardPage;
