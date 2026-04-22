import { UserCircle, Plus } from 'lucide-react';
import { PageHeader } from '../components/TopHeader';
import Card from '../components/Card';
import Button from '../components/Button';
import EmptyState from '../components/EmptyState';
import FilterChips from '../components/FilterChips';
import Badge from '../components/Badge';
import { useState } from 'react';
import styles from './ListPage.module.css';

const filterOptions = [
  { value: 'all', label: 'All', count: 18 },
  { value: 'residential', label: 'Residential', count: 14 },
  { value: 'commercial', label: 'Commercial', count: 4 },
];

const customers = [
  { id: 1, name: 'Sarah Johnson', email: 'sarah@email.com', phone: '(555) 234-5678', type: 'residential', jobs: 3, total: '$24,500' },
  { id: 2, name: 'Mike Williams', email: 'mike.w@email.com', phone: '(555) 345-6789', type: 'residential', jobs: 2, total: '$12,800' },
  { id: 3, name: 'Thompson Realty', email: 'contact@thompson.com', phone: '(555) 456-7890', type: 'commercial', jobs: 8, total: '$89,200' },
  { id: 4, name: 'Emily Davis', email: 'emily.d@email.com', phone: '(555) 567-8901', type: 'residential', jobs: 1, total: '$4,200' },
  { id: 5, name: 'Robert Chen', email: 'robert.chen@email.com', phone: '(555) 678-9012', type: 'residential', jobs: 2, total: '$15,600' },
];

export default function Customers() {
  const [filter, setFilter] = useState('all');
  
  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <PageHeader title="Customers" subtitle="Your client database">
          <Button icon={Plus}>Add Customer</Button>
        </PageHeader>
        
        <FilterChips 
          options={filterOptions} 
          value={filter} 
          onChange={setFilter} 
        />
        
        <div className={styles.content}>
          <Card className={styles.card}>
            <div className={styles.listHeader}>
              <span className={styles.colName}>Customer</span>
              <span className={styles.colEmail}>Contact</span>
              <span className={styles.colPhone}>Phone</span>
              <span className={styles.colStatus}>Type</span>
              <span className={styles.colDate}>Jobs</span>
            </div>
            <div className={styles.list}>
              {customers.map((customer) => (
                <div key={customer.id} className={styles.listItem}>
                  <div className={styles.colName}>
                    <div className={styles.avatar}>
                      <UserCircle size={20} />
                    </div>
                    <div className={styles.info}>
                      <span className={styles.title}>{customer.name}</span>
                      <span className={styles.subtitle}>{customer.total} total</span>
                    </div>
                  </div>
                  <div className={styles.colEmail}>{customer.email}</div>
                  <div className={styles.colPhone}>{customer.phone}</div>
                  <div className={styles.colStatus}>
                    <Badge variant={customer.type === 'commercial' ? 'info' : 'default'} size="sm">
                      {customer.type}
                    </Badge>
                  </div>
                  <div className={styles.colDate}>{customer.jobs}</div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}