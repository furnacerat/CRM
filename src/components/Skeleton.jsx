import { motion } from 'framer-motion';
import styles from './Skeleton.module.css';

export default function Skeleton({ 
  width, 
  height, 
  variant = 'text',
  className = '',
}) {
  const variants = {
    text: { width: '100%', height: '1em' },
    avatar: { width: 48, height: 48, borderRadius: '50%' },
    card: { width: '100%', height: 120 },
    button: { width: 100, height: 40 },
  };
  
  return (
    <motion.div
      className={`${styles.skeleton} ${className}`}
      style={{
        width: width || variants[variant]?.width,
        height: height || variants[variant]?.height,
        ...variants[variant],
      }}
      animate={{ opacity: [0.5, 1, 0.5] }}
      transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
    />
  );
}

export function SkeletonCard() {
  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <Skeleton variant="avatar" />
        <div className={styles.cardMeta}>
          <Skeleton width="60%" height={14} />
          <Skeleton width="40%" height={12} />
        </div>
      </div>
      <Skeleton height={12} />
      <Skeleton width="80%" height={12} />
    </div>
  );
}

export function SkeletonList({ count = 4 }) {
  return (
    <div className={styles.list}>
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}