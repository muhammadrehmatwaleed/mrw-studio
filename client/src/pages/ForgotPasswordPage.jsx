import { useState } from 'react';
import toast from 'react-hot-toast';
import { api } from '../services/api';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.post('/auth/forgot-password', { email });
      toast.success(data.message);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Request failed');
    }
  };

  return (
    <div className="mx-auto max-w-md rounded-2xl border bg-white p-6 shadow-lg dark:border-slate-700 dark:bg-slate-900">
      <h1 className="font-display text-3xl font-bold">Forgot Password</h1>
      <p className="mt-2 text-sm text-slate-500">Enter your email to receive reset instructions.</p>
      <form onSubmit={submitHandler} className="mt-5 space-y-4">
        <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" required placeholder="Email" className="w-full rounded-xl border px-4 py-3 dark:border-slate-700 dark:bg-slate-800" />
        <button className="w-full rounded-xl bg-blue-600 px-4 py-3 text-white">Send Reset Link</button>
      </form>
    </div>
  );
};

export default ForgotPasswordPage;
