import { motion } from 'framer-motion';

const MotionDiv = motion.div;
const MotionSpan = motion.span;

const floatingShapes = [
  {
    className: 'left-[6%] top-[16%] h-28 w-28 md:h-40 md:w-40',
    duration: 11,
    delay: 0.2,
    color: 'bg-cyan-400/25 dark:bg-cyan-500/20',
  },
  {
    className: 'right-[8%] top-[28%] h-24 w-24 md:h-32 md:w-32',
    duration: 9,
    delay: 0.6,
    color: 'bg-fuchsia-300/25 dark:bg-fuchsia-500/18',
  },
  {
    className: 'left-[14%] bottom-[8%] h-20 w-20 md:h-28 md:w-28',
    duration: 13,
    delay: 0.4,
    color: 'bg-amber-300/25 dark:bg-amber-400/16',
  },
  {
    className: 'right-[18%] bottom-[12%] h-32 w-32 md:h-44 md:w-44',
    duration: 10,
    delay: 0,
    color: 'bg-indigo-300/25 dark:bg-indigo-500/16',
  },
];

const AnimatedBackground = () => {
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <MotionDiv
        className="absolute inset-0"
        animate={{
          backgroundPosition: ['0% 0%', '100% 100%', '0% 0%'],
        }}
        transition={{ duration: 24, repeat: Infinity, ease: 'easeInOut' }}
        style={{
          backgroundImage:
            'radial-gradient(circle at 12% 20%, rgba(8,145,178,0.2) 0%, transparent 34%), radial-gradient(circle at 86% 18%, rgba(251,146,60,0.15) 0%, transparent 31%), radial-gradient(circle at 52% 88%, rgba(79,70,229,0.14) 0%, transparent 30%)',
        }}
      />

      <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(255,255,255,0.5)_0%,rgba(255,255,255,0.1)_50%,rgba(255,255,255,0.38)_100%)] dark:bg-[linear-gradient(120deg,rgba(2,6,23,0.88)_0%,rgba(2,6,23,0.65)_52%,rgba(2,6,23,0.9)_100%)]" />

      {floatingShapes.map((shape) => (
        <MotionSpan
          key={shape.className}
          className={`absolute rounded-full blur-3xl ${shape.className} ${shape.color}`}
          animate={{
            y: [0, -20, 16, 0],
            x: [0, 12, -8, 0],
            scale: [1, 1.08, 0.96, 1],
          }}
          transition={{
            duration: shape.duration,
            delay: shape.delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}

      <div className="noise-overlay absolute inset-0 opacity-40 dark:opacity-30" />
    </div>
  );
};

export default AnimatedBackground;
