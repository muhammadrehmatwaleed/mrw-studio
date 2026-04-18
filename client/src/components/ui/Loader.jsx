const Loader = () => {
  return (
    <div className="flex min-h-55 items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="relative">
          <span className="absolute inset-0 rounded-full bg-cyan-500/30 blur-md" />
          <div className="relative h-12 w-12 animate-spin rounded-full border-4 border-slate-300/90 border-t-cyan-500 dark:border-slate-700 dark:border-t-cyan-300" />
        </div>
        <p className="text-xs font-medium tracking-[0.16em] text-slate-500 dark:text-slate-300">LOADING</p>
      </div>
    </div>
  );
};

export default Loader;
