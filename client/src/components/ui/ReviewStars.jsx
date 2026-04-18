import { FiStar } from 'react-icons/fi';

const ReviewStars = ({ value }) => {
  return (
    <div className="flex items-center gap-1 text-amber-400">
      {[1, 2, 3, 4, 5].map((star) => (
        <FiStar key={star} className={star <= Math.round(value) ? 'fill-current' : ''} />
      ))}
      <span className="ml-2 text-sm text-slate-500 dark:text-slate-400">{value?.toFixed?.(1) || '0.0'}</span>
    </div>
  );
};

export default ReviewStars;
