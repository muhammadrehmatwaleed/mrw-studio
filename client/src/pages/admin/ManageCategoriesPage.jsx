import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { api, authHeader } from '../../services/api';

const ManageCategoriesPage = () => {
  const { token } = useSelector((state) => state.auth);
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editingName, setEditingName] = useState('');

  const load = () => api.get('/categories').then((res) => setCategories(res.data));

  useEffect(() => {
    load();
  }, []);

  const addCategory = async (e) => {
    e.preventDefault();
    await api.post('/categories', { name }, authHeader(token));
    toast.success('Category added');
    setName('');
    load();
  };

  const deleteCategory = async (id) => {
    await api.delete(`/categories/${id}`, authHeader(token));
    toast.success('Category deleted');
    load();
  };

  const startEdit = (category) => {
    setEditingId(category._id);
    setEditingName(category.name);
  };

  const saveEdit = async () => {
    if (!editingName.trim()) return;
    await api.put(`/categories/${editingId}`, { name: editingName }, authHeader(token));
    toast.success('Category updated');
    setEditingId(null);
    setEditingName('');
    load();
  };

  return (
    <section className="rounded-2xl border bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900">
      <h1 className="font-display text-2xl font-bold">Manage Categories</h1>

      <form onSubmit={addCategory} className="mt-4 flex gap-2">
        <input value={name} onChange={(e) => setName(e.target.value)} required placeholder="New category" className="w-full rounded-lg border px-3 py-2 dark:border-slate-700 dark:bg-slate-800" />
        <button className="rounded-lg bg-blue-600 px-4 py-2 text-white">Add</button>
      </form>

      <div className="mt-4 space-y-2">
        {categories.map((category) => (
          <div key={category._id} className="flex items-center justify-between rounded-xl border p-3 dark:border-slate-700">
            {editingId === category._id ? (
              <input
                value={editingName}
                onChange={(e) => setEditingName(e.target.value)}
                className="mr-3 w-full rounded-lg border px-2 py-1 dark:border-slate-700 dark:bg-slate-800"
              />
            ) : (
              <span>{category.name}</span>
            )}

            <div className="flex items-center gap-2">
              {editingId === category._id ? (
                <>
                  <button onClick={saveEdit} className="rounded bg-blue-600 px-2 py-1 text-white">Save</button>
                  <button onClick={() => setEditingId(null)} className="rounded bg-slate-200 px-2 py-1 dark:bg-slate-700">Cancel</button>
                </>
              ) : (
                <button onClick={() => startEdit(category)} className="rounded bg-slate-200 px-2 py-1 dark:bg-slate-700">Edit</button>
              )}
              <button onClick={() => deleteCategory(category._id)} className="rounded bg-rose-100 px-2 py-1 text-rose-600">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ManageCategoriesPage;
