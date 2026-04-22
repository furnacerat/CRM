import { BarChart3, TrendingUp, DollarSign, Users, FileText, Wrench } from 'lucide-react';
import { PageHeader } from '../components/TopHeader';
import Card, { CardHeader, CardTitle, CardContent } from '../components/Card';
import StatCard from '../components/StatCard';
import styles from './Reports.module.css';

export default function Reports() {
  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <PageHeader title="Reports" subtitle="Business insights and analytics" />
        
        <div className={styles.statsRow}>
          <StatCard label="Revenue (MTD)" value="$47,250" trend="up" trendValue="+12.5%" icon={DollarSign} />
          <StatCard label="Jobs Completed" value="24" trend="up" trendValue="+8.2%" icon={Wrench} />
          <StatCard label="New Customers" value="8" trend="up" trendValue="+3" icon={Users} />
          <StatCard label="Win Rate" value="68%" trend="up" trendValue="+5%" icon={TrendingUp} />
        </div>
        
        <div className={styles.grid}>
          <Card>
            <CardHeader>
              <CardTitle>Revenue Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className={styles.chartPlaceholder}>
                <div className={styles.chartBars}>
                  {[65, 45, 78, 52, 89, 72, 95].map((h, i) => (
                    <div key={i} className={styles.bar} style={{ height: `${h}%` }} />
                  ))}
                </div>
                <div className={styles.chartLabels}>
                  {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((d) => (
                    <span key={d}>{d}</span>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Job Pipeline</CardTitle>
            </CardHeader>
            <CardContent>
              <div className={styles.pipeline}>
                {[
                  { stage: 'Leads', count: 24, value: '$180K', color: 'var(--accent-primary)' },
                  { stage: 'Estimates', count: 12, value: '$95K', color: 'var(--status-info)' },
                  { stage: 'Jobs', count: 8, value: '$72K', color: 'var(--status-warning)' },
                  { stage: 'Complete', count: 24, value: '$145K', color: 'var(--status-success)' },
                ].map((item) => (
                  <div key={item.stage} className={styles.pipelineItem}>
                    <div className={styles.pipelineDot} style={{ background: item.color }} />
                    <div className={styles.pipelineInfo}>
                      <span className={styles.pipelineStage}>{item.stage}</span>
                      <span className={styles.pipelineCount}>{item.count} · {item.value}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}