import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { api, authHeader } from '../services/api';
import Loader from '../components/ui/Loader';

const OrderConfirmationPage = () => {
  const { id } = useParams();
  const { token } = useSelector((state) => state.auth);
  const [order, setOrder] = useState(null);

  useEffect(() => {
    api.get(`/orders/${id}`, authHeader(token)).then((res) => setOrder(res.data));
  }, [id, token]);

  if (!order) return <Loader />;

  return (
    <div className="mx-auto max-w-3xl rounded-2xl border bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900">
      <h1 className="font-display text-3xl font-bold text-slate-900 dark:text-white">Order Confirmed</h1>
      <p className="mt-2 text-slate-500">Order ID: {order._id}</p>
      <p className="mt-1 text-slate-500">Status: {order.status}</p>

      <div className="mt-6 space-y-3">
        {order.items.map((item) => (
          <div key={item._id} className="flex items-center justify-between rounded-xl border p-3 dark:border-slate-700">
            <div className="flex items-center gap-3">
              <img src={item.image} alt={item.name} className="h-14 w-14 rounded-lg object-cover" />
              <div>
                <p className="font-medium">{item.name}</p>
                <p className="text-sm text-slate-500">Qty: {item.qty}</p>
              </div>
            </div>
            <p className="font-semibold">${(item.qty * item.price).toFixed(2)}</p>
          </div>
        ))}
      </div>

      <div className="mt-6 text-right text-xl font-semibold">Total: ${order.totalAmount.toFixed(2)}</div>
    </div>
  );
};

export default OrderConfirmationPage;
