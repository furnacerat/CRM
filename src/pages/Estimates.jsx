import { FileText, Plus, Clock, CheckCircle, Send, X } from 'lucide-react';
import { PageHeader } from '../components/TopHeader';
import Card from '../components/Card';
import Button from '../components/Button';
import Badge from '../components/Badge';
import FilterChips from '../components/FilterChips';
import { useState } from 'react';
import styles from './ListPage.module.css';

const filterOptions = [
  { value: 'all', label: 'All', count: 12 },
  { value: 'draft', label: 'Draft', count: 4 },
  { value: 'sent', label: 'Sent', count: 5 },
  { value: 'accepted', label: 'Accepted', count: 3 },
];

const estimates = [
  { id: 1, customer: 'Sarah Johnson', project: 'Kitchen Remodel', amount: '$24,500', status: 'sent', date: 'Apr 20' },
  { id: 2, customer: 'Mike Williams', project: 'Bathroom Update', amount: '$12,800', status: 'draft', date: 'Apr 19' },
  { id: 3, customer: 'Emily Davis', project: 'Deck Installation', amount: '$8,400', status: 'accepted', date: 'Apr 18' },
  { id: 4, customer: 'Robert Chen', project: 'Full Renovation', amount: '$45,200', status: 'sent', date: 'Apr 17' },
  { id: 5, customer: 'Lisa Anderson', project: 'Garage Build', amount: '$18,900', status: 'draft', date: 'Apr 16' },
];

export default function Estimates() {
  const [filter, setFilter] = useState('all');
  
  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <PageHeader title="Estimates" subtitle="Track and manage your estimates">
          <Button icon={Plus}>New Estimate</Button>
        </PageHeader>
        
        <FilterChips 
          options={filterOptions} 
          value={filter} 
          onChange={setFilter} 
        />
        
        <div className={styles.content}>
          <Card className={styles.card}>
            <div className={styles.listHeader}>
              <span className={styles.colName}>Project</span>
              <span className={styles.colEmail}>Customer</span>
              <span className={styles.colPhone}>Amount</span>
              <span className={styles.colStatus}>Status</span>
              <span className={styles.colDate}>Date</span>
            </div>
            <div className={styles.list}>
              {estimates.map((estimate) => (
                <div key={estimate.id} className={styles.listItem}>
                  <div className={styles.colName}>
                    <div className={styles.avatar}>
                      <FileText size={20} />
                    </div>
                    <div className={styles.info}>
                      <span className={styles.title}>{estimate.project}</span>
                      <span className={styles.subtitle}>{estimate.customer}</span>
                    </div>
                  </div>
                  <div className={styles.colEmail}>{estimate.customer}</div>
                  <div className={styles.colPhone}>{estimate.amount}</div>
                  <div className={styles.colStatus}>
                    <Badge 
                      variant={
                        estimate.status === 'accepted' ? 'success' : 
                        estimate.status === 'sent' ? 'info' :
                        estimate.status === 'draft' ? 'default' : 'default'
                      } 
                      size="sm"
                    >
                      {estimate.status}
                    </Badge>
                  </div>
                  <div className={styles.colDate}>{estimate.date}</div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}