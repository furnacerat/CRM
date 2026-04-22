import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Search,
  Plus,
  Receipt,
  DollarSign,
  Filter,
  TrendingUp,
  TrendingDown,
  Clock,
  AlertTriangle,
  Image,
} from 'lucide-react';
import { PageHeader } from '../components/TopHeader';
import Card from '../components/Card';
import Button from '../components/Button';
import Input from '../components/Input';
import Badge from '../components/Badge';
import FilterChips from '../components/FilterChips';
import Drawer from '../components/Drawer';
import { initialJobs } from '../data/jobs';
import { EXPENSE_CATEGORIES, initialExpenses } from '../data/expenses';
import styles from './Expenses.module.css';

const categoryFilters = [
  { value: 'all', label: 'All', count: 0 },
  ...EXPENSE_CATEGORIES.map((c) => ({ value: c.id, label: c.label, count: 0 })),
];

export default function Expenses() {
  const navigate = useNavigate();
  const [expenses] = useState(initialExpenses);
  const [jobs] = useState(initialJobs);
  const [filter, setFilter] = useState('all');
  const [jobFilter, setJobFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [showBuilder, setShowBuilder] = useState(false);
  const [selectedJobFilter, setSelectedJobFilter] = useState(null);

  const filteredExpenses = expenses.filter((exp) => {
    const matchesSearch =
      !search ||
      exp.description.toLowerCase().includes(search.toLowerCase()) ||
      exp.vendor.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === 'all' || exp.category === filter;
    const matchesJob = jobFilter === 'all' || exp.jobId === jobFilter;
    return matchesSearch && matchesFilter && matchesJob;
  });

  const getCounts = () => {
    const counts = { all: expenses.length };
    EXPENSE_CATEGORIES.forEach((c) => {
      counts[c.id] = expenses.filter((e) => e.category === c.id).length;
    });
    return counts;
  };

  const getJobExpenseTotal = (jobId) =>
    expenses.filter((e) => e.jobId === jobId).reduce((sum, e) => sum + e.amount, 0);

  const getCategoryInfo = (categoryId) =>
    EXPENSE_CATEGORIES.find((c) => c.id === categoryId) || { label: categoryId, color: '#71717A' };

  const totalThisMonth = expenses
    .filter((e) => e.date.startsWith('2024-04'))
    .reduce((sum, e) => sum + e.amount, 0);

  const totalByCategory = useMemo(() => {
    const totals = {};
    EXPENSE_CATEGORIES.forEach((c) => {
      totals[c.id] = expenses
        .filter((e) => e.category === c.id)
        .reduce((sum, e) => sum + e.amount, 0);
    });
    return totals;
  }, [expenses]);

  const counts = getCounts();
  const options = categoryFilters.map((o) => ({ ...o, count: counts[o.value] || 0 }));

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <PageHeader title="Expenses" subtitle={`${expenses.length} expenses`}>
          <Button icon={Plus} onClick={() => setShowBuilder(true)}>
            Add Expense
          </Button>
        </PageHeader>

        <div className={styles.searchRow}>
          <Input
            icon={Search}
            placeholder="Search expenses..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select
            className={styles.jobSelect}
            value={jobFilter}
            onChange={(e) => setJobFilter(e.target.value)}
          >
            <option value="all">All Jobs</option>
            {jobs.map((job) => (
              <option key={job.id} value={job.id}>
                {job.project}
              </option>
            ))}
          </select>
        </div>

        <FilterChips options={options} value={filter} onChange={setFilter} />

        <div className={styles.stats}>
          <div className={styles.statCard}>
            <span className={styles.statLabel}>This Month</span>
            <span className={styles.statValue}>${totalThisMonth.toLocaleString()}</span>
          </div>
          <div className={styles.statCard}>
            <span className={styles.statLabel}>Total</span>
            <span className={styles.statValue}>
              ${expenses.reduce((sum, e) => sum + e.amount, 0).toLocaleString()}
            </span>
          </div>
        </div>

        <div className={styles.categoryBreakdown}>
          {EXPENSE_CATEGORIES.map((cat) => (
            <div key={cat.id} className={styles.categoryBar}>
              <div className={styles.categoryInfo}>
                <span className={styles.categoryLabel}>{cat.label}</span>
                <span className={styles.categoryAmount}>
                  ${(totalByCategory[cat.id] || 0).toLocaleString()}
                </span>
              </div>
              <div className={styles.categoryTrack}>
                <div
                  className={styles.categoryFill}
                  style={{
                    width: `${Math.min(
                      ((totalByCategory[cat.id] || 0) / totalThisMonth) * 100,
                      100
                    )}%`,
                    background: cat.color,
                  }}
                />
              </div>
            </div>
          ))}
        </div>

        <div className={styles.list}>
          {filteredExpenses.map((expense, i) => (
            <motion.div
              key={expense.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03 }}
            >
              <Card className={styles.expenseCard}>
                <div className={styles.expenseHeader}>
                  <div
                    className={styles.expenseIcon}
                    style={{ background: `${getCategoryInfo(expense.category).color}20` }}
                  >
                    <Receipt size={18} style={{ color: getCategoryInfo(expense.category).color }} />
                  </div>
                  <div className={styles.expenseInfo}>
                    <h4 className={styles.expenseDesc}>{expense.description}</h4>
                    <p className={styles.expenseMeta}>
                      {expense.vendor} · {expense.date}
                    </p>
                  </div>
                  <span className={styles.expenseAmount}>${expense.amount.toLocaleString()}</span>
                </div>
                {expense.jobName && (
                  <div className={styles.expenseJob}>
                    <Badge size="sm">{expense.jobName}</Badge>
                  </div>
                )}
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      <Drawer isOpen={showBuilder} onClose={() => setShowBuilder(false)} title="Add Expense">
        <ExpenseBuilder
          jobs={jobs}
          onClose={() => setShowBuilder(false)}
          onSave={(expense) => {
            expenses.push({ ...expense, id: `exp-${Date.now()}` });
            setShowBuilder(false);
          }}
        />
      </Drawer>
    </div>
  );
}

function ExpenseBuilder({ jobs, onClose, onSave }) {
  const [form, setForm] = useState({
    jobId: '',
    jobName: '',
    category: 'materials',
    amount: '',
    vendor: '',
    description: '',
    date: new Date().toISOString().split('T')[0],
    receipt: null,
  });

  const handleJobSelect = (jobId) => {
    const job = jobs.find((j) => j.id === jobId);
    setForm({ ...form, jobId, jobName: job?.project || '' });
  };

  const handleSave = () => {
    if (form.amount && form.vendor) {
      onSave({
        ...form,
        amount: parseFloat(form.amount),
      });
    }
  };

  return (
    <div className={styles.builder}>
      <div className={styles.builderSection}>
        <h4 className={styles.sectionTitle}>Job (Optional)</h4>
        <select
          className={styles.select}
          value={form.jobId}
          onChange={(e) => handleJobSelect(e.target.value)}
        >
          <option value="">No job - General expense</option>
          {jobs.map((job) => (
            <option key={job.id} value={job.id}>
              {job.project} - {job.customerName}
            </option>
          ))}
        </select>
      </div>

      <div className={styles.builderSection}>
        <h4 className={styles.sectionTitle}>Category</h4>
        <div className={styles.categoryGrid}>
          {EXPENSE_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              className={`${styles.categoryBtn} ${
                form.category === cat.id ? styles.active : ''
              }`}
              style={
                form.category === cat.id
                  ? { background: `${cat.color}20`, borderColor: cat.color, color: cat.color }
                  : {}
              }
              onClick={() => setForm({ ...form, category: cat.id })}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.builderRow}>
        <div className={styles.builderSection}>
          <h4 className={styles.sectionTitle}>Amount</h4>
          <input
            type="number"
            className={styles.input}
            value={form.amount}
            onChange={(e) => setForm({ ...form, amount: e.target.value })}
            placeholder="$0.00"
          />
        </div>
        <div className={styles.builderSection}>
          <h4 className={styles.sectionTitle}>Date</h4>
          <input
            type="date"
            className={styles.input}
            value={form.date}
            onChange={(e) => setForm({ ...form, date: e.target.value })}
          />
        </div>
      </div>

      <div className={styles.builderSection}>
        <h4 className={styles.sectionTitle}>Vendor</h4>
        <input
          className={styles.input}
          value={form.vendor}
          onChange={(e) => setForm({ ...form, vendor: e.target.value })}
          placeholder="e.g., Home Depot"
        />
      </div>

      <div className={styles.builderSection}>
        <h4 className={styles.sectionTitle}>Description</h4>
        <textarea
          className={styles.textarea}
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          placeholder="What did you buy?"
          rows={3}
        />
      </div>

      <div className={styles.builderSection}>
        <h4 className={styles.sectionTitle}>Receipt (Optional)</h4>
        <button className={styles.receiptBtn}>
          <Image size={20} />
          <span>Add Photo</span>
        </button>
      </div>

      <div className={styles.builderActions}>
        <Button variant="ghost" onClick={onClose}>
          Cancel
        </Button>
        <Button onClick={handleSave}>Add Expense</Button>
      </div>
    </div>
  );
}