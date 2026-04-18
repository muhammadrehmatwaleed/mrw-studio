const QuantityControl = ({ value, min = 1, max = 99, onChange }) => {
  const decrease = () => onChange(Math.max(min, value - 1));
  const increase = () => onChange(Math.min(max, value + 1));

  return (
    <div className="inline-flex items-center rounded-xl border border-white/60 bg-white/70 shadow-sm backdrop-blur dark:border-slate-700 dark:bg-slate-900/80">
      <button type="button" onClick={decrease} className="px-3 py-2 text-lg text-slate-700 transition hover:text-cyan-600 dark:text-slate-200 dark:hover:text-cyan-300">-</button>
      <span className="w-10 text-center text-sm font-semibold text-slate-800 dark:text-slate-100">{value}</span>
      <button type="button" onClick={increase} className="px-3 py-2 text-lg text-slate-700 transition hover:text-cyan-600 dark:text-slate-200 dark:hover:text-cyan-300">+</button>
    </div>
  );
};

export default QuantityControl;
