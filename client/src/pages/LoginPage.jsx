import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import toast from 'react-hot-toast';
import { api } from '../services/api';
import { setCredentials } from '../features/authSlice';

const schema = yup.object({
  email: yup.string().email().required(),
  password: yup.string().required(),
});

const LoginPage = () => {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: yupResolver(schema) });
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onSubmit = async (values) => {
    try {
      const { data } = await api.post('/auth/login', values);
      dispatch(setCredentials(data));
      toast.success('Welcome back');
      navigate('/');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="mx-auto max-w-md rounded-2xl border bg-white p-6 shadow-lg dark:border-slate-700 dark:bg-slate-900">
      <h1 className="font-display text-3xl font-bold">Login</h1>
      <div className="mt-4 rounded-xl border border-sky-200 bg-sky-50/80 p-4 text-sm dark:border-sky-500/30 dark:bg-sky-950/30">
        <p className="font-semibold text-sky-800 dark:text-sky-200">Demo Login (Portfolio)</p>
        <p className="mt-2 text-slate-700 dark:text-slate-300">User: user@example.com / User123!</p>
        <div className="mt-3 flex gap-2">
          <button
            type="button"
            onClick={() => {
              setValue('email', 'user@example.com');
              setValue('password', 'User123!');
            }}
            className="rounded-lg bg-sky-600 px-3 py-1.5 text-xs font-semibold text-white"
          >
            Use Demo User
          </button>
        </div>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="mt-5 space-y-4">
        <div>
          <input {...register('email')} placeholder="Email" className="w-full rounded-xl border px-4 py-3 dark:border-slate-700 dark:bg-slate-800" />
          <p className="mt-1 text-sm text-rose-500">{errors.email?.message}</p>
        </div>
        <div>
          <input {...register('password')} type="password" placeholder="Password" className="w-full rounded-xl border px-4 py-3 dark:border-slate-700 dark:bg-slate-800" />
          <p className="mt-1 text-sm text-rose-500">{errors.password?.message}</p>
        </div>
        <button disabled={isSubmitting} className="w-full rounded-xl bg-blue-600 px-4 py-3 text-white">{isSubmitting ? 'Please wait...' : 'Login'}</button>
      </form>
      <div className="mt-4 flex justify-between text-sm">
        <Link to="/signup" className="text-blue-600">Create account</Link>
        <Link to="/forgot-password" className="text-blue-600">Forgot password?</Link>
      </div>
      <p className="mt-3 text-sm">Admin? <Link to="/admin/login" className="text-blue-600">Sign in here</Link></p>
    </div>
  );
};

export default LoginPage;
