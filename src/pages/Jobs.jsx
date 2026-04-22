import { Wrench, Plus, Play, Pause, CheckCircle, Clock } from 'lucide-react';
import { PageHeader } from '../components/TopHeader';
import Card from '../components/Card';
import Button from '../components/Button';
import Badge from '../components/Badge';
import FilterChips from '../components/FilterChips';
import { useState } from 'react';
import styles from './ListPage.module.css';

const filterOptions = [
  { value: 'all', label: 'All', count: 8 },
  { value: 'in_progress', label: 'Active', count: 5 },
  { value: 'scheduled', label: 'Scheduled', count: 2 },
  { value: 'completed', label: 'Completed', count: 1 },
];

const jobs = [
  { id: 1, customer: 'Sarah Johnson', project: 'Kitchen Remodel', amount: '$24,500', status: 'in_progress', start: 'Apr 15', end: 'May 10' },
  { id: 2, customer: 'Mike Williams', project: 'Bathroom Update', amount: '$12,800', status: 'in_progress', start: 'Apr 18', end: 'May 5' },
  { id: 3, customer: 'Emily Davis', project: 'Deck Installation', amount: '$8,400', status: 'scheduled', start: 'May 1', end: 'May 15' },
  { id: 4, customer: 'Thompson Realty', project: 'Office Reno', amount: '$45,200', status: 'in_progress', start: 'Apr 10', end: 'Apr 30' },
  { id: 5, customer: 'Robert Chen', project: 'Basement Finish', amount: '$18,900', status: 'scheduled', start: 'May 5', end: 'Jun 1' },
];

export default function Jobs() {
  const [filter, setFilter] = useState('all');
  
  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <PageHeader title="Jobs" subtitle="Track your ongoing projects">
          <Button icon={Plus}>New Job</Button>
        </PageHeader>
        
        <FilterChips 
          options={filterOptions} 
          value={filter} 
          onChange={setFilter} 
        />
        
        <div className={styles.content}>
          <Card className={styles.card}>
            <div className={styles.listHeader}>
              <span className={styles.colName}>Job</span>
              <span className={styles.colEmail}>Customer</span>
              <span className={styles.colPhone}>Contract</span>
              <span className={styles.colStatus}>Status</span>
              <span className={styles.colDate}>Timeline</span>
            </div>
            <div className={styles.list}>
              {jobs.map((job) => (
                <div key={job.id} className={styles.listItem}>
                  <div className={styles.colName}>
                    <div className={styles.avatar}>
                      <Wrench size={20} />
                    </div>
                    <div className={styles.info}>
                      <span className={styles.title}>{job.project}</span>
                      <span className={styles.subtitle}>{job.customer}</span>
                    </div>
                  </div>
                  <div className={styles.colEmail}>{job.customer}</div>
                  <div className={styles.colPhone}>{job.amount}</div>
                  <div className={styles.colStatus}>
                    <Badge 
                      variant={
                        job.status === 'in_progress' ? 'warning' : 
                        job.status === 'completed' ? 'success' : 'default'
                      } 
                      size="sm"
                    >
                      {job.status.replace('_', ' ')}
                    </Badge>
                  </div>
                  <div className={styles.colDate}>{job.start} - {job.end}</div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}