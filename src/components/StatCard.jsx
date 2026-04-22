import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import styles from './StatCard.module.css';

export default function StatCard({
  label,
  value,
  trend,
  trendValue,
  icon: Icon,
  highlight = false,
  className = ''
}) {
  const TrendIcon = trend === 'up' ? TrendingUp : trend === 'down' ? TrendingDown : Minus;
  const trendClass = trend === 'up' ? styles.up : trend === 'down' ? styles.down : styles.neutral;
  
  return (
    <motion.div 
      className={`${styles.card} ${highlight ? styles.highlight : ''} ${className}`}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
    >
      <div className={styles.header}>
        <span className={styles.label}>{label}</span>
        {Icon && <Icon className={styles.icon} />}
      </div>
      <div className={`${styles.value} ${highlight ? styles.highlight : ''}`}>
        {value}
      </div>
      {trend && (
        <div className={`${styles.trend} ${trendClass}`}>
          <TrendIcon className={styles.trendIcon} />
          <span>{trendValue}</span>
        </div>
      )}
    </motion.div>
  );
}