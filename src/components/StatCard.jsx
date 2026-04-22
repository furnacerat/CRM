import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import styles from './StatCard.module.css';

export default function StatCard({
  label,
  value,
  trend,
  trendValue,
  icon: Icon,
  variant = 'default',
  className = ''
}) {
  const TrendIcon = trend === 'up' ? TrendingUp : trend === 'down' ? TrendingDown : Minus;
  const trendColor = trend === 'up' ? 'up' : trend === 'down' ? 'down' : 'neutral';
  
  return (
    <motion.div 
      className={`${styles.card} ${styles[variant]} ${className}`}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
    >
      <div className={styles.header}>
        <span className={styles.label}>{label}</span>
        {Icon && <Icon className={styles.icon} />}
      </div>
      <div className={styles.value}>{value}</div>
      {trend && (
        <div className={`${styles.trend} ${styles[trendColor]}`}>
          <TrendIcon className={styles.trendIcon} />
          <span>{trendValue}</span>
        </div>
      )}
    </motion.div>
  );
}