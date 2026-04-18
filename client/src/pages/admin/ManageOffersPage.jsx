import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useSelector } from 'react-redux';
import { api, authHeader } from '../../services/api';

const initialForm = {
  title: '',
  subtitle: '',
  highlight: '',
  order: 0,
  isActive: true,
};

const ManageOffersPage = () => {
  const { token } = useSelector((state) => state.auth);
  const [offers, setOffers] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(initialForm);

  const load = async () => {
    const { data } = await api.get('/offers/admin', authHeader(token));
    setOffers(data);
  };

  useEffect(() => {
    let cancelled = false;

    api
      .get('/offers/admin', authHeader(token))
      .then(({ data }) => {
        if (!cancelled) setOffers(data);
      })
      .catch(() => {
        if (!cancelled) toast.error('Failed to load offers');
      });

    return () => {
      cancelled = true;
    };
  }, [token]);

  const resetForm = () => {
    setEditingId(null);
    setForm(initialForm);
  };

  const submit = async (event) => {
    event.preventDefault();

    try {
      if (editingId) {
        await api.put(`/offers/${editingId}`, form, authHeader(token));
        toast.success('Offer updated');
      } else {
        await api.post('/offers', form, authHeader(token));
        toast.success('Offer created');
      }

      resetForm();
      load();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Unable to save offer');
    }
  };

  const startEdit = (offer) => {
    setEditingId(offer._id);
    setForm({
      title: offer.title,
      subtitle: offer.subtitle,
      highlight: offer.highlight,
      order: offer.order,
      isActive: offer.isActive,
    });
  };

  const remove = async (id) => {
    try {
      await api.delete(`/offers/${id}`, authHeader(token));
      toast.success('Offer deleted');
      load();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Delete failed');
    }
  };

  const toggleActive = async (offer) => {
    try {
      await api.put(
        `/offers/${offer._id}`,
        { isActive: !offer.isActive },
        authHeader(token)
      );
      toast.success('Offer status updated');
      load();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Status update failed');
    }
  };

  return (
    <section className="rounded-2xl border bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900">
      <h1 className="font-display text-2xl font-bold">Manage Offers</h1>

      <form onSubmit={submit} className="mt-4 space-y-3 rounded-xl border p-4 dark:border-slate-700">
        <input
          required
          value={form.title}
          onChange={(event) => setForm((prev) => ({ ...prev, title: event.target.value }))}
          placeholder="Offer title"
          className="w-full rounded-lg border px-3 py-2 dark:border-slate-700 dark:bg-slate-800"
        />
        <textarea
          required
          rows={2}
          value={form.subtitle}
          onChange={(event) => setForm((prev) => ({ ...prev, subtitle: event.target.value }))}
          placeholder="Offer subtitle"
          className="w-full rounded-lg border px-3 py-2 dark:border-slate-700 dark:bg-slate-800"
        />
        <input
          required
          value={form.highlight}
          onChange={(event) => setForm((prev) => ({ ...prev, highlight: event.target.value }))}
          placeholder="Highlight text"
          className="w-full rounded-lg border px-3 py-2 dark:border-slate-700 dark:bg-slate-800"
        />
        <div className="grid gap-3 sm:grid-cols-2">
          <input
            type="number"
            min={0}
            value={form.order}
            onChange={(event) => setForm((prev) => ({ ...prev, order: Number(event.target.value) }))}
            placeholder="Display order"
            className="w-full rounded-lg border px-3 py-2 dark:border-slate-700 dark:bg-slate-800"
          />
          <label className="flex items-center gap-2 rounded-lg border px-3 py-2 dark:border-slate-700">
            <input
              type="checkbox"
              checked={form.isActive}
              onChange={(event) => setForm((prev) => ({ ...prev, isActive: event.target.checked }))}
            />
            Active offer
          </label>
        </div>

        <div className="flex gap-2">
          <button className="rounded-lg bg-blue-600 px-4 py-2 text-white">
            {editingId ? 'Update Offer' : 'Add Offer'}
          </button>
          {editingId && (
            <button type="button" onClick={resetForm} className="rounded-lg bg-slate-200 px-4 py-2 dark:bg-slate-700">
              Cancel
            </button>
          )}
        </div>
      </form>

      <div className="mt-5 space-y-2">
        {offers.map((offer) => (
          <article key={offer._id} className="rounded-xl border p-4 dark:border-slate-700">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h2 className="font-display text-lg font-semibold">{offer.title}</h2>
                <p className="text-sm text-slate-600 dark:text-slate-300">{offer.subtitle}</p>
                <p className="mt-1 text-sm font-medium text-orange-500">{offer.highlight}</p>
                <p className="mt-1 text-xs text-slate-500">Order: {offer.order} | Status: {offer.isActive ? 'Active' : 'Inactive'}</p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => startEdit(offer)} className="rounded bg-slate-200 px-2 py-1 text-sm dark:bg-slate-700">Edit</button>
                <button onClick={() => toggleActive(offer)} className="rounded bg-amber-100 px-2 py-1 text-sm text-amber-700">Toggle</button>
                <button onClick={() => remove(offer._id)} className="rounded bg-rose-100 px-2 py-1 text-sm text-rose-600">Delete</button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};

export default ManageOffersPage;