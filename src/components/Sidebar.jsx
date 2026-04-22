import { NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  Users,
  UserCircle,
  FileText,
  Wrench,
  Receipt,
  FileBarChart,
  BarChart3,
  Settings,
  ChevronLeft,
  Briefcase
} from 'lucide-react';
import styles from './Sidebar.module.css';

const navItems = [
  { path: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { path: '/leads', icon: Users, label: 'Leads' },
  { path: '/customers', icon: UserCircle, label: 'Customers' },
  { path: '/estimates', icon: FileText, label: 'Estimates' },
  { path: '/jobs', icon: Wrench, label: 'Jobs' },
  { path: '/expenses', icon: Receipt, label: 'Expenses' },
  { path: '/invoices', icon: FileBarChart, label: 'Invoices' },
  { path: '/reports', icon: BarChart3, label: 'Reports' },
];

const bottomItems = [
  { path: '/settings', icon: Settings, label: 'Settings' },
];

export default function Sidebar({ isCollapsed, onToggle }) {
  const location = useLocation();
  
  return (
    <aside className={`${styles.sidebar} ${isCollapsed ? styles.collapsed : ''}`}>
      <div className={styles.logo}>
        <div className={styles.logoIcon}>
          <Briefcase size={22} />
        </div>
        <AnimatePresence>
          {!isCollapsed && (
            <motion.span 
              className={styles.logoText}
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: 'auto' }}
              exit={{ opacity: 0, width: 0 }}
            >
              Contractors CRM
            </motion.span>
          )}
        </AnimatePresence>
      </div>
      
      <nav className={styles.nav}>
        <div className={styles.navSection}>
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => 
                `${styles.navItem} ${isActive ? styles.active : ''}`
              }
            >
              <item.icon className={styles.navIcon} />
              <AnimatePresence>
                {!isCollapsed && (
                  <motion.span
                    className={styles.navLabel}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    {item.label}
                  </motion.span>
                )}
              </AnimatePresence>
              {location.pathname === item.path && (
                <motion.div 
                  className={styles.activeIndicator}
                  layoutId="activeNav"
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                />
              )}
            </NavLink>
          ))}
        </div>
        
        <div className={styles.navBottom}>
          {bottomItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => 
                `${styles.navItem} ${isActive ? styles.active : ''}`
              }
            >
              <item.icon className={styles.navIcon} />
              <AnimatePresence>
                {!isCollapsed && (
                  <motion.span
                    className={styles.navLabel}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    {item.label}
                  </motion.span>
                )}
              </AnimatePresence>
            </NavLink>
          ))}
        </div>
      </nav>
      
      <button className={styles.toggle} onClick={onToggle}>
        <ChevronLeft className={`${styles.toggleIcon} ${isCollapsed ? styles.rotated : ''}`} />
      </button>
    </aside>
  );
}