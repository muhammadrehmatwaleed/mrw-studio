import { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { api, authHeader } from '../../services/api';

const ManageUsersPage = () => {
  const { token } = useSelector((state) => state.auth);
  const [users, setUsers] = useState([]);

  const load = useCallback(
    () => api.get('/users', authHeader(token)).then((res) => setUsers(res.data)),
    [token]
  );

  useEffect(() => {
    load().catch(() => {});
  }, [load]);

  const remove = async (id) => {
    try {
      await api.delete(`/users/${id}`, authHeader(token));
      toast.success('User deleted');
      load();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Delete failed');
    }
  };

  return (
    <section className="rounded-2xl border bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900">
      <h1 className="font-display text-2xl font-bold">Manage Users</h1>
      <div className="mt-4 overflow-x-auto">
        <table className="w-full text-left">
          <thead><tr className="border-b dark:border-slate-700"><th className="py-2">Name</th><th>Email</th><th>Role</th><th>Actions</th></tr></thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id} className="border-b dark:border-slate-800">
                <td className="py-2">{user.name}</td><td>{user.email}</td><td>{user.role}</td>
                <td>{user.role !== 'admin' && <button onClick={() => remove(user._id)} className="rounded bg-rose-100 px-2 py-1 text-sm text-rose-600">Delete</button>}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default ManageUsersPage;
