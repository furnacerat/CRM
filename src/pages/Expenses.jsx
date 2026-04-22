import { Receipt, Plus, DollarSign, TrendingDown, TrendingUp, Wallet } from 'lucide-react';
import { PageHeader } from '../components/TopHeader';
import Card from '../components/Card';
import Button from '../components/Button';
import Badge from '../components/Badge';
import FilterChips from '../components/FilterChips';
import StatCard from '../components/StatCard';
import { useState } from 'react';
import styles from './ListPage.module.css';

const filterOptions = [
  { value: 'all', label: 'All', count: 156 },
  { value: 'materials', label: 'Materials', count: 89 },
  { value: 'labor', label: 'Labor', count: 45 },
  { value: 'equipment', label: 'Equipment', count: 22 },
];

export default function Expenses() {
  const [filter, setFilter] = useState('all');
  
  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <PageHeader title="Expenses" subtitle="Track job costs and expenses">
          <Button icon={Plus}>Add Expense</Button>
        </PageHeader>
        
        <div className={styles.statsRow}>
          <StatCard label="Total Expenses" value="$28,350" trend="up" trendValue="+8.2%" icon={DollarSign} />
          <StatCard label="This Month" value="$8,420" trend="down" trendValue="-3.1%" icon={TrendingDown} />
          <StatCard label="Pending" value="$2,840" icon={Wallet} />
        </div>
        
        <FilterChips 
          options={filterOptions} 
          value={filter} 
          onChange={setFilter} 
        />
        
        <div className={styles.content}>
          <Card className={styles.card}>
            <div className={styles.listHeader}>
              <span className={styles.colName}>Description</span>
              <span className={styles.colEmail}>Category</span>
              <span className={styles.colPhone}>Job</span>
              <span className={styles.colStatus}>Amount</span>
              <span className={styles.colDate}>Date</span>
            </div>
            <div className={styles.list}>
              {[
                { desc: 'Lumber - 2x4x8', cat: 'Materials', job: 'Kitchen', amount: '$450', date: 'Apr 21' },
                { desc: 'Subcontractor - Electrician', cat: 'Labor', job: 'Bathroom', amount: '$1,200', date: 'Apr 20' },
                { desc: 'Paint Supplies', cat: 'Materials', job: 'Deck', amount: '$280', date: 'Apr 19' },
                { desc: 'Tool Rental - Scissor Lift', cat: 'Equipment', job: 'Kitchen', amount: '$350', date: 'Apr 18' },
                { desc: 'Tile - Floor', cat: 'Materials', job: 'Bathroom', amount: '$890', date: 'Apr 17' },
              ].map((expense, i) => (
                <div key={i} className={styles.listItem}>
                  <div className={styles.colName}>
                    <div className={styles.avatar}>
                      <Receipt size={20} />
                    </div>
                    <div className={styles.info}>
                      <span className={styles.title}>{expense.desc}</span>
                    </div>
                  </div>
                  <div className={styles.colEmail}>{expense.cat}</div>
                  <div className={styles.colPhone}>{expense.job}</div>
                  <div className={styles.colStatus}>{expense.amount}</div>
                  <div className={styles.colDate}>{expense.date}</div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}