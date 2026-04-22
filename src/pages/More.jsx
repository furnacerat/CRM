import { MoreHorizontal, Users, UserCircle, FileText, Wrench, Receipt, FileBarChart, BarChart3, Settings } from 'lucide-react';
import { PageHeader } from '../components/TopHeader';
import Card from '../components/Card';
import styles from './More.module.css';

export default function More() {
  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <PageHeader title="More" subtitle="Additional options" />
        
        <div className={styles.menu}>
          {[
            { icon: Users, label: 'Leads', path: '/leads' },
            { icon: UserCircle, label: 'Customers', path: '/customers' },
            { icon: FileText, label: 'Estimates', path: '/estimates' },
            { icon: Wrench, label: 'Jobs', path: '/jobs' },
            { icon: Receipt, label: 'Expenses', path: '/expenses' },
            { icon: FileBarChart, label: 'Invoices', path: '/invoices' },
            { icon: BarChart3, label: 'Reports', path: '/reports' },
            { icon: Settings, label: 'Settings', path: '/settings' },
          ].map((item) => (
            <a key={item.path} href={item.path} className={styles.menuItem}>
              <div className={styles.menuIcon}>
                <item.icon size={22} />
              </div>
              <span className={styles.menuLabel}>{item.label}</span>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}