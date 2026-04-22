import { motion } from 'framer-motion';
import styles from './FilterChips.module.css';

export default function FilterChips({ options, value, onChange }) {
  return (
    <div className={styles.container}>
      {options.map((option) => (
        <button
          key={option.value}
          className={`${styles.chip} ${value === option.value ? styles.active : ''}`}
          onClick={() => onChange(option.value)}
        >
          {option.label}
          {option.count !== undefined && (
            <span className={styles.count}>{option.count}</span>
          )}
          {value === option.value && (
            <motion.div 
              className={styles.activeBg}
              layoutId="filterChip"
              transition={{ type: 'spring', stiffness: 500, damping: 30 }}
            />
          )}
        </button>
      ))}
    </div>
  );
}