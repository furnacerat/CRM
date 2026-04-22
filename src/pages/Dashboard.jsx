import { motion } from 'framer-motion';
import { 
  DollarSign, 
  TrendingUp, 
  Users, 
  FileText, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  ArrowRight,
  Plus,
  Calendar,
  Wrench,
  Zap
} from 'lucide-react';
import StatCard from '../components/StatCard';
import Card, { CardHeader, CardTitle, CardContent, CardFooter } from '../components/Card';
import Badge from '../components/Badge';
import Button from '../components/Button';
import { PageHeader } from '../components/TopHeader';
import styles from './Dashboard.module.css';

const stats = [
  { label: 'Revenue', value: '$47,250', trend: 'up', trendValue: '+12.5%', icon: DollarSign },
  { label: 'Profit', value: '$18,900', trend: 'up', trendValue: '+8.2%', icon: TrendingUp },
  { label: 'Active Jobs', value: '8', trend: 'up', trendValue: '+2 new', icon: Wrench },
  { label: 'Open Estimates', value: '12', trend: 'down', trendValue: '-3 this week', icon: FileText },
];

const recentActivity = [
  { id: 1, type: 'estimate', title: 'Kitchen Renovation - Smith', amount: '$12,500', status: 'sent', time: '2h ago' },
  { id: 2, type: 'job', title: 'Bathroom Remodel - Johnson', amount: '$8,200', status: 'in_progress', time: '4h ago' },
  { id: 3, type: 'invoice', title: 'Deck Project - Williams', amount: '$4,800', status: 'paid', time: 'Yesterday' },
  { id: 4, type: 'lead', title: 'Garage Door - Brown', amount: null, status: 'new', time: 'Yesterday' },
];

const reminders = [
  { id: 1, title: 'Call John Smith re: estimate', type: 'call', time: '10:00 AM' },
  { id: 2, title: 'Materials pickup - Home Depot', type: 'task', time: '2:00 PM' },
  { id: 3, title: 'Site visit - Johnson Residence', type: 'visit', time: '3:30 PM' },
];

export default function Dashboard() {
  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <PageHeader 
          title="Dashboard" 
          subtitle="Welcome back, here's what's happening today."
        >
          <Button icon={Plus}>New Job</Button>
        </PageHeader>
        
        <div className={styles.stats}>
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <StatCard {...stat} />
            </motion.div>
          ))}
        </div>
        
        <div className={styles.grid}>
          <motion.div
            className={styles.mainCard}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Today's Priorities</CardTitle>
              </CardHeader>
              <CardContent>
                <div className={styles.reminderList}>
                  {reminders.map((reminder) => (
                    <div key={reminder.id} className={styles.reminderItem}>
                      <div className={styles.reminderTime}>
                        <Clock size={14} />
                        <span>{reminder.time}</span>
                      </div>
                      <div className={styles.reminderTitle}>{reminder.title}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="ghost" size="sm" fullWidth>
                  View Schedule <ArrowRight size={16} />
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
          
          <motion.div
            className={styles.activityCard}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className={styles.activityList}>
                  {recentActivity.map((item) => (
                    <div key={item.id} className={styles.activityItem}>
                      <div className={styles.activityIcon}>
                        {item.type === 'estimate' && <FileText size={16} />}
                        {item.type === 'job' && <Wrench size={16} />}
                        {item.type === 'invoice' && <DollarSign size={16} />}
                        {item.type === 'lead' && <Users size={16} />}
                      </div>
                      <div className={styles.activityContent}>
                        <div className={styles.activityTitle}>{item.title}</div>
                        <div className={styles.activityMeta}>
                          {item.amount && <span>{item.amount}</span>}
                          <span>{item.time}</span>
                        </div>
                      </div>
                      <Badge 
                        variant={
                          item.status === 'paid' ? 'success' : 
                          item.status === 'new' ? 'accent' :
                          item.status === 'sent' ? 'info' :
                          'warning'
                        }
                        size="sm"
                      >
                        {item.status.replace('_', ' ')}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Card padding="lg" className={styles.quickActions}>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className={styles.actionGrid}>
                <button className={styles.actionButton}>
                  <Zap size={22} />
                  <span>New Estimate</span>
                </button>
                <button className={styles.actionButton}>
                  <FileText size={22} />
                  <span>Create Invoice</span>
                </button>
                <button className={styles.actionButton}>
                  <Users size={22} />
                  <span>Add Lead</span>
                </button>
                <button className={styles.actionButton}>
                  <Calendar size={22} />
                  <span>Schedule</span>
                </button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}