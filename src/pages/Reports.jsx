import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Percent,
  FileText,
  CheckCircle,
  XCircle,
  Clock,
  Users,
  Wrench,
  Receipt,
  BarChart3,
  PieChart,
  ArrowUp,
  ArrowDown,
} from 'lucide-react';
import StatCard from '../components/StatCard';
import Card, { CardHeader, CardTitle, CardContent } from '../components/Card';
import Badge from '../components/Badge';
import { PageHeader } from '../components/TopHeader';
import { initialJobs } from '../data/jobs';
import { initialEstimates } from '../data/estimates';
import { initialExpenses } from '../data/expenses';
import { initialInvoices } from '../data/invoices';
import styles from './Reports.module.css';

export default function Reports() {
  const navigate = useNavigate();
  const [period, setPeriod] = useState('month');

  const revenueData = useMemo(() => {
    const thisMonth = initialInvoices
      .filter((i) => i.paid > 0 && i.createdAt.startsWith('2024-04'))
      .reduce((sum, i) => sum + i.paid, 0);
    const lastMonth = initialInvoices
      .filter((i) => i.paid > 0 && i.createdAt.startsWith('2024-03'))
      .reduce((sum, i) => sum + i.paid, 0);
    return {
      thisMonth,
      lastMonth,
      change: lastMonth > 0 ? ((thisMonth - lastMonth) / lastMonth) * 100 : 0,
    };
  }, []);

  const estimateData = useMemo(() => {
    const total = initialEstimates.length;
    const accepted = initialEstimates.filter((e) => e.status === 'accepted').length;
    const declined = initialEstimates.filter((e) => e.status === 'declined').length;
    const sent = initialEstimates.filter((e) => e.status === 'sent').length;
    return {
      total,
      accepted,
      declined,
      sent,
      winRate: total > 0 ? (accepted / total) * 100 : 0,
    };
  }, []);

  const expenseData = useMemo(() => {
    const total = initialExpenses.reduce((sum, e) => sum + e.amount, 0);
    const byCategory = {};
    initialExpenses.forEach((e) => {
      byCategory[e.category] = (byCategory[e.category] || 0) + e.amount;
    });
    return { total, byCategory };
  }, []);

  const jobData = useMemo(() => {
    const active = initialJobs.filter((j) => j.status === 'in_progress').length;
    const completed = initialJobs.filter((j) => j.status === 'completed' || j.status === 'closed').length;
    const totalValue = initialJobs.reduce((sum, j) => sum + (j.contractAmount || 0), 0);
    return { active, completed, totalValue, avgValue: initialJobs.length > 0 ? totalValue / initialJobs.length : 0 };
  }, []);

  const invoiceData = useMemo(() => {
    const total = initialInvoices.reduce((sum, i) => sum + i.total, 0);
    const paid = initialInvoices.reduce((sum, i) => sum + i.paid, 0);
    const outstanding = total - paid;
    const overdue = initialInvoices
      .filter((i) => i.status === 'overdue')
      .reduce((sum, i) => sum + (i.total - i.paid), 0);
    return { total, paid, outstanding, overdue };
  }, []);

  const topJobs = useMemo(() => {
    return [...initialJobs]
      .sort((a, b) => (b.contractAmount || 0) - (a.contractAmount || 0))
      .slice(0, 5);
  }, []);

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <PageHeader title="Reports" subtitle="Business insights and analytics" />

        <div className={styles.periodTabs}>
          {['month', 'quarter', 'year'].map((p) => (
            <button
              key={p}
              className={`${styles.periodTab} ${period === p ? styles.active : ''}`}
              onClick={() => setPeriod(p)}
            >
              {p === 'month' ? 'This Month' : p === 'quarter' ? 'This Quarter' : 'This Year'}
            </button>
          ))}
        </div>

        <div className={styles.insightGrid}>
          <motion.div
            className={styles.insightCard}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className={styles.insightIcon} style={{ background: 'rgba(34, 197, 94, 0.15)' }}>
              <DollarSign size={20} style={{ color: 'var(--status-success)' }} />
            </div>
            <div className={styles.insightContent}>
              <span className={styles.insightLabel}>Revenue This Month</span>
              <span className={styles.insightValue}>${revenueData.thisMonth.toLocaleString()}</span>
              <span className={`${styles.insightChange} ${revenueData.change >= 0 ? styles.positive : styles.negative}`}>
                {revenueData.change >= 0 ? <ArrowUp size={12} /> : <ArrowDown size={12} />}
                {Math.abs(revenueData.change).toFixed(1)}% vs last month
              </span>
            </div>
          </motion.div>

          <motion.div
            className={styles.insightCard}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className={styles.insightIcon} style={{ background: 'rgba(245, 158, 11, 0.15)' }}>
              <Percent size={20} style={{ color: 'var(--accent-primary)' }} />
            </div>
            <div className={styles.insightContent}>
              <span className={styles.insightLabel}>Estimate Win Rate</span>
              <span className={styles.insightValue}>{estimateData.winRate.toFixed(0)}%</span>
              <span className={styles.insightMeta}>
                {estimateData.accepted} accepted / {estimateData.total} total
              </span>
            </div>
          </motion.div>

          <motion.div
            className={styles.insightCard}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className={styles.insightIcon} style={{ background: 'rgba(59, 130, 246, 0.15)' }}>
              <Receipt size={20} style={{ color: 'var(--status-info)' }} />
            </div>
            <div className={styles.insightContent}>
              <span className={styles.insightLabel}>Expenses</span>
              <span className={styles.insightValue}>${expenseData.total.toLocaleString()}</span>
              <span className={styles.insightMeta}>Total tracked</span>
            </div>
          </motion.div>

          <motion.div
            className={styles.insightCard}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className={styles.insightIcon} style={{ background: 'rgba(139, 92, 246, 0.15)' }}>
              <BarChart3 size={20} style={{ color: '#8B5CF6' }} />
            </div>
            <div className={styles.insightContent}>
              <span className={styles.insightLabel}>Active Jobs</span>
              <span className={styles.insightValue}>{jobData.active}</span>
              <span className={styles.insightMeta}>
                ${jobData.totalValue.toLocaleString()} value
              </span>
            </div>
          </motion.div>
        </div>

        <div className={styles.mainGrid}>
          <Card>
            <CardHeader>
              <CardTitle>Revenue Trend</CardTitle>
            </CardHeader>
            <CardContent>
              <div className={styles.chartContainer}>
                <div className={styles.barChart}>
                  {[
                    { label: 'Jan', value: 42000 },
                    { label: 'Feb', value: 38000 },
                    { label: 'Mar', value: 51000 },
                    { label: 'Apr', value: 47000 },
                  ].map((month, i) => (
                    <div key={month.label} className={styles.barColumn}>
                      <div
                        className={styles.bar}
                        style={{ height: `${(month.value / 60000) * 100}%` }}
                      />
                      <span className={styles.barLabel}>{month.label}</span>
                      <span className={styles.barValue}>${(month.value / 1000).toFixed(0)}k</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Estimate Pipeline</CardTitle>
            </CardHeader>
            <CardContent>
              <div className={styles.pipelineStats}>
                <div className={styles.pipelineItem}>
                  <div className={styles.pipelineDot} style={{ background: 'var(--status-info)' }} />
                  <div className={styles.pipelineInfo}>
                    <span>Sent</span>
                    <span>{estimateData.sent}</span>
                  </div>
                </div>
                <div className={styles.pipelineItem}>
                  <div className={styles.pipelineDot} style={{ background: 'var(--status-success)' }} />
                  <div className={styles.pipelineInfo}>
                    <span>Accepted</span>
                    <span>{estimateData.accepted}</span>
                  </div>
                </div>
                <div className={styles.pipelineItem}>
                  <div className={styles.pipelineDot} style={{ background: 'var(--status-error)' }} />
                  <div className={styles.pipelineInfo}>
                    <span>Declined</span>
                    <span>{estimateData.declined}</span>
                  </div>
                </div>
              </div>
              <div className={styles.winRateCard}>
                <span className={styles.winRateLabel}>Win Rate</span>
                <span className={styles.winRateValue}>{estimateData.winRate.toFixed(0)}%</span>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className={styles.mainGrid}>
          <Card>
            <CardHeader>
              <CardTitle>Top Jobs by Value</CardTitle>
            </CardHeader>
            <CardContent>
              <div className={styles.topJobsList}>
                {topJobs.map((job, i) => (
                  <div key={job.id} className={styles.topJobItem}>
                    <span className={styles.jobRank}>#{i + 1}</span>
                    <div className={styles.jobInfo}>
                      <span className={styles.jobName}>{job.project}</span>
                      <span className={styles.jobCustomer}>{job.customerName}</span>
                    </div>
                    <span className={styles.jobValue}>
                      ${(job.contractAmount || 0).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Invoice Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className={styles.invoiceBreakdown}>
                <div className={styles.invoiceItem}>
                  <div className={styles.invoiceDot} style={{ background: 'var(--status-success)' }} />
                  <span>Paid</span>
                  <span>${invoiceData.paid.toLocaleString()}</span>
                </div>
                <div className={styles.invoiceItem}>
                  <div className={styles.invoiceDot} style={{ background: 'var(--status-warning)' }} />
                  <span>Outstanding</span>
                  <span>${invoiceData.outstanding.toLocaleString()}</span>
                </div>
                <div className={styles.invoiceItem}>
                  <div className={styles.invoiceDot} style={{ background: 'var(--status-error)' }} />
                  <span>Overdue</span>
                  <span>${invoiceData.overdue.toLocaleString()}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className={styles.mainGrid}>
          <Card>
            <CardHeader>
              <CardTitle>Expense Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              <div className={styles.expenseList}>
                {Object.entries(expenseData.byCategory)
                  .sort(([, a], [, b]) => b - a)
                  .map(([category, amount]) => (
                    <div key={category} className={styles.expenseItem}>
                      <span className={styles.expenseLabel}>{category}</span>
                      <div className={styles.expenseBar}>
                        <div
                          className={styles.expenseFill}
                          style={{ width: `${(amount / expenseData.total) * 100}%` }}
                        />
                      </div>
                      <span className={styles.expenseAmount}>
                        ${amount.toLocaleString()}
                      </span>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Job Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className={styles.jobStats}>
                <div className={styles.jobStatItem}>
                  <Wrench size={18} />
                  <div className={styles.jobStatInfo}>
                    <span>Active Jobs</span>
                    <span className={styles.jobStatValue}>{jobData.active}</span>
                  </div>
                </div>
                <div className={styles.jobStatItem}>
                  <CheckCircle size={18} />
                  <div className={styles.jobStatInfo}>
                    <span>Completed</span>
                    <span className={styles.jobStatValue}>{jobData.completed}</span>
                  </div>
                </div>
                <div className={styles.jobStatItem}>
                  <DollarSign size={18} />
                  <div className={styles.jobStatInfo}>
                    <span>Avg Job Value</span>
                    <span className={styles.jobStatValue}>
                      ${jobData.avgValue.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}