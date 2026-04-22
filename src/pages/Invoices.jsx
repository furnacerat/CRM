import { FileBarChart, Plus, DollarSign, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { PageHeader } from '../components/TopHeader';
import Card from '../components/Card';
import Button from '../components/Button';
import Badge from '../components/Badge';
import FilterChips from '../components/FilterChips';
import StatCard from '../components/StatCard';
import { useState } from 'react';
import styles from './ListPage.module.css';

const filterOptions = [
  { value: 'all', label: 'All', count: 24 },
  { value: 'draft', label: 'Draft', count: 4 },
  { value: 'sent', label: 'Sent', count: 8 },
  { value: 'paid', label: 'Paid', count: 10 },
  { value: 'overdue', label: 'Overdue', count: 2 },
];

export default function Invoices() {
  const [filter, setFilter] = useState('all');
  
  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <PageHeader title="Invoices" subtitle="Manage billing and payments">
          <Button icon={Plus}>Create Invoice</Button>
        </PageHeader>
        
        <div className={styles.statsRow}>
          <StatCard label="Outstanding" value="$24,800" trend="up" trendValue="+4 pending" icon={Clock} />
          <StatCard label="Collected" value="$89,400" trend="up" trendValue="+12.5%" icon={DollarSign} />
          <StatCard label="Overdue" value="$3,200" trend="down" trendValue="-2" icon={AlertCircle} />
        </div>
        
        <FilterChips 
          options={filterOptions} 
          value={filter} 
          onChange={setFilter} 
        />
        
        <div className={styles.content}>
          <Card className={styles.card}>
            <div className={styles.listHeader}>
              <span className={styles.colName}>Invoice #</span>
              <span className={styles.colEmail}>Customer</span>
              <span className={styles.colPhone}>Amount</span>
              <span className={styles.colStatus}>Status</span>
              <span className={styles.colDate}>Due Date</span>
            </div>
            <div className={styles.list}>
              {[
                { num: 'INV-2024-042', cust: 'Sarah Johnson', amount: '$24,500', status: 'sent', due: 'Apr 25' },
                { num: 'INV-2024-041', cust: 'Mike Williams', amount: '$12,800', status: 'paid', due: 'Apr 20' },
                { num: 'INV-2024-040', cust: 'Thompson Realty', amount: '$8,400', status: 'paid', due: 'Apr 18' },
                { num: 'INV-2024-039', cust: 'Emily Davis', amount: '$4,200', status: 'overdue', due: 'Apr 10' },
                { num: 'INV-2024-038', cust: 'Robert Chen', amount: '$15,600', status: 'draft', due: 'May 1' },
              ].map((inv, i) => (
                <div key={i} className={styles.listItem}>
                  <div className={styles.colName}>
                    <div className={styles.avatar}>
                      <FileBarChart size={20} />
                    </div>
                    <div className={styles.info}>
                      <span className={styles.title}>{inv.num}</span>
                    </div>
                  </div>
                  <div className={styles.colEmail}>{inv.cust}</div>
                  <div className={styles.colPhone}>{inv.amount}</div>
                  <div className={styles.colStatus}>
                    <Badge 
                      variant={
                        inv.status === 'paid' ? 'success' : 
                        inv.status === 'sent' ? 'info' :
                        inv.status === 'overdue' ? 'error' : 'default'
                      } 
                      size="sm"
                    >
                      {inv.status}
                    </Badge>
                  </div>
                  <div className={styles.colDate}>{inv.due}</div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}