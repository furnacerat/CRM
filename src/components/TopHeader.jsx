import { Menu, Bell, Search, Plus } from 'lucide-react';
import { motion } from 'framer-motion';
import Button from './Button';
import styles from './TopHeader.module.css';

export default function TopHeader({ 
  title, 
  subtitle,
  showMenu = false,
  onMenuClick,
  actions,
  showSearch = true,
  showNotification = true,
}) {
  return (
    <header className={styles.header}>
      <div className={styles.left}>
        {showMenu && (
          <button className={styles.menuButton} onClick={onMenuClick}>
            <Menu size={22} />
          </button>
        )}
        <div className={styles.titleArea}>
          <h1 className={styles.title}>{title}</h1>
          {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
        </div>
      </div>
      
      <div className={styles.right}>
        {showSearch && (
          <button className={styles.iconButton}>
            <Search size={20} />
          </button>
        )}
        {showNotification && (
          <button className={styles.iconButton}>
            <Bell size={20} />
            <span className={styles.notificationDot} />
          </button>
        )}
        {actions}
      </div>
    </header>
  );
}

export function PageHeader({ 
  title, 
  subtitle,
  children,
  large = false,
}) {
  return (
    <div className={`${styles.pageHeader} ${large ? styles.large : ''}`}>
      <div className={styles.pageHeaderContent}>
        <h1 className={styles.pageTitle}>{title}</h1>
        {subtitle && <p className={styles.pageSubtitle}>{subtitle}</p>}
      </div>
      {children && <div className={styles.pageHeaderActions}>{children}</div>}
    </div>
  );
}