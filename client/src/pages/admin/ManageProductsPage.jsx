import { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { Dialog, DialogBackdrop, DialogPanel } from '@headlessui/react';
import { api, authHeader } from '../../services/api';

const initialForm = { name: '', description: '', category: '', price: 0, stock: 0, images: [''] };

const ManageProductsPage = () => {
  const { token } = useSelector((state) => state.auth);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(initialForm);
  const [uploading, setUploading] = useState(false);

  const load = useCallback(async () => {
    const [productRes, categoryRes] = await Promise.all([api.get('/products'), api.get('/categories')]);
    setProducts(productRes.data.products);
    setCategories(categoryRes.data);
  }, []);

  useEffect(() => {
    load().catch(() => {});
  }, [load]);

  const submit = async (e) => {
    e.preventDefault();
    const payload = { ...form, images: form.images.filter(Boolean) };

    try {
      if (editingId) {
        await api.put(`/products/${editingId}`, payload, authHeader(token));
        toast.success('Product updated');
      } else {
        await api.post('/products', payload, authHeader(token));
        toast.success('Product created');
      }
      setOpen(false);
      setEditingId(null);
      setForm(initialForm);
      load();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Save failed');
    }
  };

  const edit = (product) => {
    setEditingId(product._id);
    setForm({
      name: product.name,
      description: product.description,
      category: product.category?._id || product.category,
      price: product.price,
      stock: product.stock,
      images: product.images?.length ? product.images : [''],
    });
    setOpen(true);
  };

  const remove = async (id) => {
    await api.delete(`/products/${id}`, authHeader(token));
    toast.success('Product deleted');
    load();
  };

  const uploadImageHandler = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      const body = new FormData();
      body.append('image', file);

      const { data } = await api.post('/upload', body, {
        ...authHeader(token),
        headers: {
          ...authHeader(token).headers,
          'Content-Type': 'multipart/form-data',
        },
      });

      setForm((prev) => ({ ...prev, images: [data.url] }));
      toast.success('Image uploaded');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  return (
    <section className="rounded-2xl border bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold">Manage Products</h1>
        <button onClick={() => { setEditingId(null); setForm(initialForm); setOpen(true); }} className="rounded-lg bg-blue-600 px-4 py-2 text-white">Add Product</button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead><tr className="border-b dark:border-slate-700"><th className="py-2">Name</th><th>Price</th><th>Stock</th><th>Actions</th></tr></thead>
          <tbody>
            {products.map((p) => (
              <tr key={p._id} className="border-b dark:border-slate-800">
                <td className="py-2">{p.name}</td><td>${p.price}</td><td>{p.stock}</td>
                <td className="space-x-2 py-2">
                  <button onClick={() => edit(p)} className="rounded bg-slate-200 px-2 py-1 text-sm dark:bg-slate-700">Edit</button>
                  <button onClick={() => remove(p._id)} className="rounded bg-rose-100 px-2 py-1 text-sm text-rose-600">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Dialog open={open} onClose={() => setOpen(false)} className="relative z-50">
        <DialogBackdrop className="fixed inset-0 bg-black/30" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <DialogPanel className="w-full max-w-xl rounded-2xl bg-white p-5 dark:bg-slate-900">
            <h2 className="font-display text-xl font-bold">{editingId ? 'Edit' : 'Add'} Product</h2>
            <form onSubmit={submit} className="mt-4 space-y-3">
              <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Name" className="w-full rounded-lg border px-3 py-2 dark:border-slate-700 dark:bg-slate-800" />
              <textarea required value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} placeholder="Description" className="w-full rounded-lg border px-3 py-2 dark:border-slate-700 dark:bg-slate-800" />
              <select required value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="w-full rounded-lg border px-3 py-2 dark:border-slate-700 dark:bg-slate-800">
                <option value="">Select category</option>
                {categories.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}
              </select>
              <div className="grid grid-cols-2 gap-3">
                <input type="number" required value={form.price} onChange={(e) => setForm({ ...form, price: Number(e.target.value) })} placeholder="Price" className="rounded-lg border px-3 py-2 dark:border-slate-700 dark:bg-slate-800" />
                <input type="number" required value={form.stock} onChange={(e) => setForm({ ...form, stock: Number(e.target.value) })} placeholder="Stock" className="rounded-lg border px-3 py-2 dark:border-slate-700 dark:bg-slate-800" />
              </div>
              <input value={form.images[0] || ''} onChange={(e) => setForm({ ...form, images: [e.target.value] })} placeholder="Image URL" className="w-full rounded-lg border px-3 py-2 dark:border-slate-700 dark:bg-slate-800" />
              <input type="file" accept="image/*" onChange={uploadImageHandler} className="w-full rounded-lg border px-3 py-2 dark:border-slate-700 dark:bg-slate-800" />
              {uploading && <p className="text-sm text-slate-500">Uploading image...</p>}
              <button className="w-full rounded-lg bg-blue-600 px-4 py-2 text-white">Save Product</button>
            </form>
          </DialogPanel>
        </div>
      </Dialog>
    </section>
  );
};

export default ManageProductsPage;
