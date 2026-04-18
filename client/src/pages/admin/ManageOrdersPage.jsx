import { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { api, authHeader } from '../../services/api';

const statuses = ['Pending', 'Shipped', 'Delivered'];

const ManageOrdersPage = () => {
  const { token } = useSelector((state) => state.auth);
  const [orders, setOrders] = useState([]);

  const load = useCallback(
    () => api.get('/orders', authHeader(token)).then((res) => setOrders(res.data)),
    [token]
  );

  useEffect(() => {
    load().catch(() => {});
  }, [load]);

  const updateStatus = async (id, status) => {
    await api.put(`/orders/${id}/status`, { status }, authHeader(token));
    toast.success('Order updated');
    load();
  };

  return (
    <section className="rounded-2xl border bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900">
      <h1 className="font-display text-2xl font-bold">Manage Orders</h1>
      <div className="mt-4 overflow-x-auto">
        <table className="w-full text-left">
          <thead><tr className="border-b dark:border-slate-700"><th className="py-2">Order ID</th><th>User</th><th>Total</th><th>Status</th></tr></thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id} className="border-b dark:border-slate-800">
                <td className="py-2 text-xs">{order._id}</td>
                <td>{order.userId?.name}</td>
                <td>${order.totalAmount.toFixed(2)}</td>
                <td>
                  <select value={order.status} onChange={(e) => updateStatus(order._id, e.target.value)} className="rounded border px-2 py-1 dark:border-slate-700 dark:bg-slate-800">
                    {statuses.map((status) => <option key={status} value={status}>{status}</option>)}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default ManageOrdersPage;
