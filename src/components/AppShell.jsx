import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Sidebar from './Sidebar';
import MobileBottomNav from './MobileBottomNav';
import styles from './AppShell.module.css';

export default function AppShell() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  
  return (
    <div className={styles.shell}>
      <Sidebar 
        isCollapsed={sidebarCollapsed} 
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} 
      />
      
      <main className={`${styles.main} ${sidebarCollapsed ? styles.expanded : ''}`}>
        <Outlet />
      </main>
      
      <MobileBottomNav />
    </div>
  );
}