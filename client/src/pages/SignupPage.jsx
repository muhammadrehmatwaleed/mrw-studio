import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import toast from 'react-hot-toast';
import { api } from '../services/api';
import { setCredentials } from '../features/authSlice';

const schema = yup.object({
  name: yup.string().min(2).required(),
  email: yup.string().email().required(),
  password: yup.string().min(6).required(),
});

const SignupPage = () => {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({ resolver: yupResolver(schema) });
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onSubmit = async (values) => {
    try {
      const { data } = await api.post('/auth/signup', values);
      dispatch(setCredentials(data));
      toast.success('Account created');
      navigate('/');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Signup failed');
    }
  };

  return (
    <div className="mx-auto max-w-md rounded-2xl border bg-white p-6 shadow-lg dark:border-slate-700 dark:bg-slate-900">
      <h1 className="font-display text-3xl font-bold">Sign Up</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="mt-5 space-y-4">
        <div>
          <input {...register('name')} placeholder="Full name" className="w-full rounded-xl border px-4 py-3 dark:border-slate-700 dark:bg-slate-800" />
          <p className="mt-1 text-sm text-rose-500">{errors.name?.message}</p>
        </div>
        <div>
          <input {...register('email')} placeholder="Email" className="w-full rounded-xl border px-4 py-3 dark:border-slate-700 dark:bg-slate-800" />
          <p className="mt-1 text-sm text-rose-500">{errors.email?.message}</p>
        </div>
        <div>
          <input {...register('password')} type="password" placeholder="Password" className="w-full rounded-xl border px-4 py-3 dark:border-slate-700 dark:bg-slate-800" />
          <p className="mt-1 text-sm text-rose-500">{errors.password?.message}</p>
        </div>
        <button disabled={isSubmitting} className="w-full rounded-xl bg-blue-600 px-4 py-3 text-white">{isSubmitting ? 'Please wait...' : 'Create account'}</button>
      </form>
      <p className="mt-4 text-sm">Already have an account? <Link to="/login" className="text-blue-600">Login</Link></p>
    </div>
  );
};

export default SignupPage;
