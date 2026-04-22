import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  DollarSign, 
  TrendingUp, 
  Users, 
  FileText, 
  Clock, 
  AlertCircle,
  ArrowRight,
  Plus,
  Calendar,
  Wrench,
  Zap,
  Phone,
  MessageSquare,
  UserCheck,
  Target,
  AlertTriangle,
} from 'lucide-react';
import StatCard from '../components/StatCard';
import Card, { CardHeader, CardTitle, CardContent, CardFooter } from '../components/Card';
import Badge from '../components/Badge';
import Button from '../components/Button';
import { PageHeader } from '../components/TopHeader';
import { useCRM } from '../context/CRMContext';
import { LEAD_STAGES } from '../data/leads';
import styles from './Dashboard.module.css';

export default function Dashboard() {
  const navigate = useNavigate();
  const { leads, customers, getOverdueFollowUps, getTodaysFollowUps, loading } = useCRM();

  if (loading) {
    return (
      <div className={styles.page}>
        <div className={styles.container}>Loading...</div>
      </div>
    );
  }

  const overdueFollowUps = getOverdueFollowUps();
  const todaysFollowUps = getTodaysFollowUps();
  const recentLeads = leads.slice(0, 5);
  const newLeads = leads.filter((l) => l.stage === 'new').length;
  const sentEstimates = leads.filter((l) => l.stage === 'sent').length;

  const stats = [
    { label: 'Total Leads', value: leads.length, trend: 'up', trendValue: `${newLeads} new`, icon: Users },
    { label: 'Active', value: leads.filter((l) => !['won', 'lost'].includes(l.stage)).length, icon: UserCheck },
    { label: 'Follow-ups', value: overdueFollowUps.length + todaysFollowUps.length, trend: overdueFollowUps.length > 0 ? 'down' : 'up', trendValue: overdueFollowUps.length > 0 ? 'overdue' : 'on track', icon: Clock },
    { label: 'Customers', value: customers.length, trend: 'up', trendValue: '+ this month', icon: UserCheck },
  ];

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <PageHeader 
          title="Dashboard" 
          subtitle="Welcome back, here's what's happening today."
        >
          <Button icon={Plus} onClick={() => navigate('/leads')}>Add Lead</Button>
        </PageHeader>
        
        {/* Today Focus */}
        <motion.div 
          className={styles.todayFocus}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className={styles.todayFocusTitle}>
            <Zap />
            Today Focus
          </div>
          <div className={styles.todayFocusItems}>
            {overdueFollowUps.length > 0 && (
              <>
                <div className={`${styles.focusItem} ${styles.focusItemUrgent}`} onClick={() => navigate('/leads')}>
                  <Clock className={styles.focusItemIcon} />
                  <span className={styles.focusItemText}>
                    <span className={styles.focusItemCount}>{overdueFollowUps.length}</span>
                    <span className={styles.focusItemLabel}> overdue</span>
                  </span>
                </div>
                <div className={styles.focusDivider} />
              </>
            )}
            {sentEstimates > 0 && (
              <>
                <div className={styles.focusItem} onClick={() => navigate('/leads')}>
                  <FileText className={styles.focusItemIcon} />
                  <span className={styles.focusItemText}>
                    <span className={styles.focusItemCount}>{sentEstimates}</span>
                    <span className={styles.focusItemLabel}> awaiting response</span>
                  </span>
                </div>
                <div className={styles.focusDivider} />
              </>
            )}
            <div className={styles.focusItem} onClick={() => navigate('/jobs')}>
              <Wrench className={styles.focusItemIcon} />
              <span className={styles.focusItemText}>
                <span className={styles.focusItemCount}>{todaysFollowUps.length}</span>
                <span className={styles.focusItemLabel}> jobs today</span>
              </span>
            </div>
            {todaysFollowUps.length === 0 && sentEstimates === 0 && overdueFollowUps.length === 0 && (
              <div className={styles.focusItem}>
                <Target className={styles.focusItemIcon} />
                <span className={styles.focusItemText}>
                  <span className={styles.focusItemLabel}>All caught up!</span>
                </span>
              </div>
            )}
          </div>
        </motion.div>
        
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
                <CardTitle>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Clock size={18} />
                    Follow-Ups
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {(overdueFollowUps.length === 0 && todaysFollowUps.length === 0) ? (
                  <div className={styles.emptyState}>
                    <AlertCircle size={24} />
                    <p>All caught up!</p>
                  </div>
                ) : (
                  <div className={styles.reminderList}>
                    {overdueFollowUps.map((lead) => (
                      <div key={lead.id} className={styles.followUpItem}>
                        <div className={styles.followUpDot} style={{ background: 'var(--status-error)' }} />
                        <div className={styles.followUpInfo}>
                          <span className={styles.followUpTitle}>{lead.name}</span>
                          <span className={styles.followUpMeta}>
                            {lead.projectType} · Was due {new Date(lead.followUpDate).toLocaleDateString()}
                          </span>
                        </div>
                        <div className={styles.followUpActions}>
                          <a href={`tel:${lead.phone}`} className={styles.followUpBtn}>
                            <Phone size={14} />
                          </a>
                          <a href={`sms:${lead.phone}`} className={styles.followUpBtn}>
                            <MessageSquare size={14} />
                          </a>
                        </div>
                      </div>
                    ))}
                    {todaysFollowUps.map((lead) => (
                      <div key={lead.id} className={styles.followUpItem}>
                        <div className={styles.followUpDot} style={{ background: 'var(--accent-primary)' }} />
                        <div className={styles.followUpInfo}>
                          <span className={styles.followUpTitle}>{lead.name}</span>
                          <span className={styles.followUpMeta}>
                            {lead.projectType} · Today
                          </span>
                        </div>
                        <div className={styles.followUpActions}>
                          <a href={`tel:${lead.phone}`} className={styles.followUpBtn}>
                            <Phone size={14} />
                          </a>
                          <a href={`sms:${lead.phone}`} className={styles.followUpBtn}>
                            <MessageSquare size={14} />
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
              <CardFooter>
                <Button variant="ghost" size="sm" fullWidth onClick={() => navigate('/leads')}>
                  View All Leads <ArrowRight size={16} />
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
                <CardTitle>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Users size={18} />
                    Recent Leads
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className={styles.activityList}>
                  {recentLeads.map((lead) => {
                    const stage = LEAD_STAGES.find((s) => s.id === lead.stage);
                    return (
                      <div key={lead.id} className={styles.leadItem} onClick={() => navigate('/leads')}>
                        <div className={styles.leadAvatar}>
                          {lead.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                        </div>
                        <div className={styles.leadInfo}>
                          <span className={styles.leadName}>{lead.name}</span>
                          <span className={styles.leadMeta}>{lead.projectType}</span>
                        </div>
                        <Badge variant={stage?.color || 'default'} size="sm">
                          {stage?.label}
                        </Badge>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="ghost" size="sm" fullWidth onClick={() => navigate('/leads')}>
                  View All Leads <ArrowRight size={16} />
                </Button>
              </CardFooter>
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
                <button className={styles.actionButton} onClick={() => navigate('/leads')}>
                  <Zap size={22} />
                  <span>New Lead</span>
                </button>
                <button className={styles.actionButton} onClick={() => navigate('/estimates')}>
                  <FileText size={22} />
                  <span>New Estimate</span>
                </button>
                <button className={styles.actionButton} onClick={() => navigate('/customers')}>
                  <Users size={22} />
                  <span>Customers</span>
                </button>
                <button className={styles.actionButton} onClick={() => navigate('/jobs')}>
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