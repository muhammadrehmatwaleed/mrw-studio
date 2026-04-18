import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { api } from '../services/api';
import { setCredentials, logout } from '../features/authSlice';

const schema = yup.object({
  email: yup.string().email().required(),
  password: yup.string().required(),
});

const AdminLoginPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: yupResolver(schema) });

  const onSubmit = async (values) => {
    try {
      const { data } = await api.post('/auth/login', values);
      if (data?.user?.role !== 'admin') {
        dispatch(logout());
        toast.error('Admin access only');
        return;
      }

      dispatch(setCredentials(data));
      toast.success('Admin login successful');
      navigate('/admin');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Admin login failed');
    }
  };

  return (
    <div className="mx-auto max-w-md rounded-2xl border bg-white p-6 shadow-lg dark:border-slate-700 dark:bg-slate-900">
      <h1 className="font-display text-3xl font-bold">Admin Login</h1>
      <p className="mt-2 text-sm text-slate-500">Use administrator credentials to access the control panel.</p>
      <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50/90 p-4 text-sm dark:border-amber-500/30 dark:bg-amber-950/20">
        <p className="font-semibold text-amber-800 dark:text-amber-200">Demo Admin Access (Portfolio)</p>
        <p className="mt-2 text-slate-700 dark:text-slate-300">Admin: admin@example.com / Admin123!</p>
        <button
          type="button"
          onClick={() => {
            setValue('email', 'admin@example.com');
            setValue('password', 'Admin123!');
          }}
          className="mt-3 rounded-lg bg-amber-600 px-3 py-1.5 text-xs font-semibold text-white"
        >
          Use Demo Admin
        </button>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="mt-5 space-y-4">
        <div>
          <input
            {...register('email')}
            placeholder="Admin email"
            className="w-full rounded-xl border px-4 py-3 dark:border-slate-700 dark:bg-slate-800"
          />
          <p className="mt-1 text-sm text-rose-500">{errors.email?.message}</p>
        </div>
        <div>
          <input
            {...register('password')}
            type="password"
            placeholder="Password"
            className="w-full rounded-xl border px-4 py-3 dark:border-slate-700 dark:bg-slate-800"
          />
          <p className="mt-1 text-sm text-rose-500">{errors.password?.message}</p>
        </div>
        <button disabled={isSubmitting} className="w-full rounded-xl bg-blue-600 px-4 py-3 text-white">
          {isSubmitting ? 'Please wait...' : 'Login as Admin'}
        </button>
      </form>
      <p className="mt-4 text-sm">User account? <Link to="/login" className="text-blue-600">Go to user login</Link></p>
    </div>
  );
};

export default AdminLoginPage;
