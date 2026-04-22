import { forwardRef } from 'react';
import { motion } from 'framer-motion';
import styles from './Button.module.css';

const Button = forwardRef(({
  children,
  variant = 'primary',
  size = 'md',
  icon: Icon,
  iconPosition = 'left',
  loading = false,
  disabled = false,
  fullWidth = false,
  className = '',
  ...props
}, ref) => {
  const Component = props.href ? motion.a : motion.button;
  
  return (
    <Component
      ref={ref}
      className={`${styles.button} ${styles[variant]} ${styles[size]} ${fullWidth ? styles.fullWidth : ''} ${className}`}
      disabled={disabled || loading}
      whileTap={{ scale: 0.98 }}
      {...props}
    >
      {loading ? (
        <span className={styles.spinner} />
      ) : (
        <>
          {Icon && iconPosition === 'left' && <Icon className={styles.icon} />}
          {children}
          {Icon && iconPosition === 'right' && <Icon className={styles.icon} />}
        </>
      )}
    </Component>
  );
});

Button.displayName = 'Button';

export default Button;