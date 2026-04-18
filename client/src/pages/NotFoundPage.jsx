import { Link } from 'react-router-dom';

const NotFoundPage = () => {
  return (
    <div className="mx-auto max-w-xl rounded-2xl border bg-white p-10 text-center shadow-sm dark:border-slate-700 dark:bg-slate-900">
      <h1 className="font-display text-4xl font-bold">404</h1>
      <p className="mt-2 text-slate-500">The page you are looking for does not exist.</p>
      <Link to="/" className="mt-5 inline-block rounded-xl bg-blue-600 px-5 py-2 text-white">Back to Home</Link>
    </div>
  );
};

export default NotFoundPage;
