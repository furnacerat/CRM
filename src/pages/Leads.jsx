import { Users, Plus } from 'lucide-react';
import { PageHeader } from '../components/TopHeader';
import Card from '../components/Card';
import Button from '../components/Button';
import EmptyState from '../components/EmptyState';
import FilterChips from '../components/FilterChips';
import { useState } from 'react';
import styles from './ListPage.module.css';

const filterOptions = [
  { value: 'all', label: 'All', count: 24 },
  { value: 'new', label: 'New', count: 8 },
  { value: 'contacted', label: 'Contacted', count: 12 },
  { value: 'qualified', label: 'Qualified', count: 4 },
];

export default function Leads() {
  const [filter, setFilter] = useState('all');
  
  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <PageHeader title="Leads" subtitle="Manage your potential customers">
          <Button icon={Plus}>Add Lead</Button>
        </PageHeader>
        
        <FilterChips 
          options={filterOptions} 
          value={filter} 
          onChange={setFilter} 
        />
        
        <div className={styles.content}>
          <Card className={styles.card}>
            <div className={styles.listHeader}>
              <span className={styles.colName}>Name</span>
              <span className={styles.colEmail}>Email</span>
              <span className={styles.colPhone}>Phone</span>
              <span className={styles.colStatus}>Status</span>
              <span className={styles.colDate}>Added</span>
            </div>
            <div className={styles.list}>
              {[1,2,3,4,5].map((i) => (
                <div key={i} className={styles.listItem}>
                  <div className={styles.colName}>
                    <div className={styles.avatar}>JD</div>
                    <div className={styles.info}>
                      <span className={styles.title}>John Doe {i}</span>
                      <span className={styles.subtitle}>Kitchen remodel</span>
                    </div>
                  </div>
                  <div className={styles.colEmail}>john{i}@email.com</div>
                  <div className={styles.colPhone}>(555) 123-456{i}</div>
                  <div className={styles.colStatus}>
                    <span className={`${styles.status} ${styles[filterOptions[parseInt(filter==='all'?1:filter==='new'?2:filter==='contacted'?3:4)%4]?.value]}`}>
                      {filterOptions[parseInt(filter==='all'?1:filter==='new'?2:filter==='contacted'?3:4)%4]?.label || 'New'}
                    </span>
                  </div>
                  <div className={styles.colDate}>Apr {20-i}</div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}