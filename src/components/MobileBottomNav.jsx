import { NavLink, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  Users,
  UserCircle,
  FileText,
  Wrench,
  Receipt,
  FileBarChart,
  BarChart3,
  Plus,
  MoreHorizontal,
} from 'lucide-react';
import styles from './MobileBottomNav.module.css';

const navItems = [
  { path: '/', icon: LayoutDashboard, label: 'Home' },
  { path: '/leads', icon: Users, label: 'Leads' },
  { path: '/', icon: Plus, label: 'Create', isAction: true },
  { path: '/jobs', icon: Wrench, label: 'Jobs' },
  { path: '/more', icon: MoreHorizontal, label: 'More' },
];

export default function MobileBottomNav() {
  const location = useLocation();
  
  return (
    <nav className={styles.nav}>
      {navItems.map((item) => (
        <NavLink
          key={item.path + item.label}
          to={item.path}
          className={({ isActive }) => 
            `${styles.item} ${item.isAction ? styles.action : ''} ${isActive ? styles.active : ''}`
          }
        >
          {item.isAction ? (
            <div className={styles.actionButton}>
              <item.icon className={styles.actionIcon} />
            </div>
          ) : (
            <>
              <item.icon className={styles.icon} />
              <span className={styles.label}>{item.label}</span>
            </>
          )}
          {location.pathname === item.path && !item.isAction && (
            <motion.div 
              className={styles.indicator}
              layoutId="mobileNav"
              transition={{ type: 'spring', stiffness: 500, damping: 30 }}
            />
          )}
        </NavLink>
      ))}
    </nav>
  );
}