const ProductCardSkeleton = () => {
  return (
    <article className="glass-card overflow-hidden rounded-3xl p-4">
      <div className="skeleton h-56 w-full rounded-2xl" />
      <div className="mt-4 space-y-3">
        <div className="skeleton h-3 w-24 rounded-full" />
        <div className="skeleton h-6 w-5/6 rounded-full" />
        <div className="flex items-center justify-between">
          <div className="skeleton h-5 w-20 rounded-full" />
          <div className="skeleton h-4 w-16 rounded-full" />
        </div>
        <div className="skeleton h-10 w-full rounded-xl" />
      </div>
    </article>
  );
};

export default ProductCardSkeleton;
