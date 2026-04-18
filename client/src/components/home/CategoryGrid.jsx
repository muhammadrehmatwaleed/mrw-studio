const CategoryGrid = ({ categories = [] }) => {
  return (
    <section className="mt-16">
      <h2 className="font-display text-3xl font-bold text-slate-900 dark:text-white">Featured Categories</h2>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {categories.map((category, index) => (
          <div
            key={category._id}
            style={{ transitionDelay: `${index * 60}ms` }}
            className="glass-card neu-card group rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-cyan-300/20"
          >
            <p className="text-sm uppercase tracking-wider text-cyan-600 dark:text-cyan-300">Category</p>
            <h3 className="mt-2 font-display text-xl text-slate-900 transition-colors group-hover:text-cyan-600 dark:text-slate-100 dark:group-hover:text-cyan-300">{category.name}</h3>
          </div>
        ))}
      </div>
    </section>
  );
};

export default CategoryGrid;
