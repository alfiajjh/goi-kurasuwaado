import { motion, type HTMLMotionProps } from 'motion/react';

const variants = {
  default: {
    whileTap: { scale: 0.97 },
    transition: { type: 'spring', stiffness: 500, damping: 30 },
  },
  bounce: {
    whileTap: { scale: 0.95 },
    transition: { type: 'spring', stiffness: 400, damping: 17 },
  },
  soft: {
    whileTap: { scale: 0.98 },
    transition: { type: 'spring', stiffness: 600, damping: 40 },
  },
  pop: {
    whileTap: { scale: 0.93, y: 2 },
    transition: { type: 'spring', stiffness: 500, damping: 15 },
  },
} as const;

type PressableVariant = keyof typeof variants;

type Props = HTMLMotionProps<'button'> & {
  variant?: PressableVariant;
};

export default function Pressable({ variant = 'default', ...props }: Props) {
  const v = variants[variant];
  return (
    <motion.button
      whileTap={v.whileTap}
      transition={v.transition}
      {...props}
    />
  );
}
