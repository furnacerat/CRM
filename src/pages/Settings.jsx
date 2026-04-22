import { Settings as SettingsIcon, User, Building, Bell, CreditCard, Shield, HelpCircle, LogOut } from 'lucide-react';
import { PageHeader } from '../components/TopHeader';
import Card, { CardHeader, CardTitle, CardContent } from '../components/Card';
import Badge from '../components/Badge';
import styles from './Settings.module.css';

const menuItems = [
  { icon: User, label: 'Profile', description: 'Your personal information' },
  { icon: Building, label: 'Business', description: 'Company details' },
  { icon: Bell, label: 'Notifications', description: 'Alert preferences' },
  { icon: CreditCard, label: 'Billing', description: 'Subscription and payment' },
  { icon: Shield, label: 'Security', description: 'Password and 2FA' },
  { icon: HelpCircle, label: 'Help', description: 'Support and FAQ' },
];

export default function Settings() {
  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <PageHeader title="Settings" subtitle="Manage your account" />
        
        <div className={styles.menu}>
          {menuItems.map((item, i) => (
            <button key={item.label} className={styles.menuItem}>
              <div className={styles.menuIcon}>
                <item.icon size={22} />
              </div>
              <div className={styles.menuContent}>
                <span className={styles.menuLabel}>{item.label}</span>
                <span className={styles.menuDesc}>{item.description}</span>
              </div>
            </button>
          ))}
          
          <button className={`${styles.menuItem} ${styles.logout}`}>
            <div className={styles.menuIcon}>
              <LogOut size={22} />
            </div>
            <div className={styles.menuContent}>
              <span className={styles.menuLabel}>Log Out</span>
              <span className={styles.menuDesc}>Sign out of your account</span>
            </div>
          </button>
        </div>
        
        <div className={styles.version}>
          <span>Contractors CRM v1.0.0</span>
        </div>
      </div>
    </div>
  );
}