import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Calendar,
  CheckCircle,
  Clock,
  MoreVertical,
  Plus,
  Search,
  ArrowLeft,
  Image,
  FileText,
  Edit,
  DollarSign,
  TrendingUp,
} from 'lucide-react';
import { PageHeader } from '../components/TopHeader';
import Card from '../components/Card';
import Button from '../components/Button';
import Input from '../components/Input';
import Badge from '../components/Badge';
import FilterChips from '../components/FilterChips';
import Drawer from '../components/Drawer';
import { useCRM } from '../context/CRMContext';
import { initialJobs, JOB_STATUSES, JOB_PHASES } from '../data/jobs';
import { initialEstimates } from '../data/estimates';
import { initialExpenses } from '../data/expenses';
import styles from './Jobs.module.css';

const statusFilters = [
  { value: 'all', label: 'All', count: 0 },
  { value: 'scheduled', label: 'Scheduled', count: 0 },
  { value: 'in_progress', label: 'Active', count: 0 },
  { value: 'completed', label: 'Completed', count: 0 },
];

export default function Jobs() {
  const navigate = useNavigate();
  const { customers, estimates } = useCRM();
  const [jobs, setJobs] = useState(initialJobs);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [showBuilder, setShowBuilder] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);

  const filteredJobs = jobs.filter((job) => {
    const matchesSearch =
      !search ||
      job.customerName.toLowerCase().includes(search.toLowerCase()) ||
      job.project.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === 'all' || job.status === filter;
    return matchesSearch && matchesFilter;
  });

  const getCounts = () => {
    const counts = { all: jobs.length };
    ['scheduled', 'in_progress', 'completed', 'closed'].forEach((s) => {
      counts[s] = jobs.filter((j) => j.status === s).length;
    });
    return counts;
  };

  const counts = getCounts();
  const options = statusFilters.map((o) => ({ ...o, count: counts[o.value] || 0 }));

  const updateJobStatus = (id, status) => {
    setJobs((prev) =>
      prev.map((j) =>
        j.id === id ? { ...j, status, updatedAt: new Date().toISOString().split('T')[0] } : j
      )
    );
  };

  const toggleTask = (jobId, taskId) => {
    setJobs((prev) =>
      prev.map((j) =>
        j.id === jobId
          ? {
              ...j,
              tasks: j.tasks.map((t) =>
                t.id === taskId ? { ...t, completed: !t.completed } : t
              ),
updatedAt: new Date().toISOString().split('T')[0],
            }
          : j
        )
      );
  };

  const getStatusInfo = (status) => JOB_STATUSES.find((s) => s.id === status) || { label: status, color: 'default' };

  const getJobHealth = (job) => {
    const now = new Date();
    const end = job.endDate ? new Date(job.endDate) : null;
    const start = job.startDate ? new Date(job.startDate) : null;
    const tasks = job.tasks || [];
    const completed = tasks.filter((t) => t.completed).length;
    const total = tasks.length;
    
    if (!start || !end) return 'healthy';
    
    const daysTotal = (end - start) / (1000 * 60 * 60 * 24);
    const daysPassed = (now - start) / (1000 * 60 * 60 * 24);
    const timelineScore = daysTotal > 0 ? (daysPassed / daysTotal) * 100 : 50;
    const taskScore = total > 0 ? (completed / total) * 100 : 50;
    
    if (timelineScore > 100 || taskScore < 30) return 'overBudget';
    if (timelineScore > 80 || taskScore < 50) return 'risk';
    return 'healthy';
  };

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <PageHeader title="Jobs" subtitle={`${jobs.length} jobs`}>
          <Button icon={Plus} onClick={() => setShowBuilder(true)}>
            New Job
          </Button>
        </PageHeader>

        <div className={styles.search}>
          <Input
            icon={Search}
            placeholder="Search jobs..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <FilterChips options={options} value={filter} onChange={setFilter} />

        <div className={styles.stats}>
          <div className={styles.statCard}>
            <span className={styles.statLabel}>Active Value</span>
            <span className={styles.statValue}>
              ${jobs.filter((j) => j.status === 'in_progress').reduce((sum, j) => sum + (j.contractAmount || 0), 0).toLocaleString()}
            </span>
          </div>
          <div className={styles.statCard}>
            <span className={styles.statLabel}>Scheduled</span>
            <span className={styles.statValue}>
              ${jobs.filter((j) => j.status === 'scheduled').reduce((sum, j) => sum + (j.contractAmount || 0), 0).toLocaleString()}
            </span>
          </div>
        </div>

        <div className={styles.list}>
          {filteredJobs.map((job, i) => (
            <motion.div
              key={job.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Card className={styles.jobCard} onClick={() => setSelectedJob(job)}>
                <div className={styles.jobHeader}>
                  <div className={styles.jobInfo}>
                    <h3 className={styles.jobName}>{job.project}</h3>
                    <p className={styles.jobCustomer}>{job.customerName}</p>
                    {job.contractAmount && (() => {
                      const revenue = job.contractAmount;
                      const cost = job.estimatedCost || (revenue * 0.7);
                      const profit = revenue - cost;
                      const margin = revenue > 0 ? (profit / revenue) * 100 : 0;
                      let health = 'healthy';
                      if (margin < 10) health = 'risk';
                      else if (margin < 20) health = 'tight';
                      
                      return (
                        <div className={`${styles.profitIndicator} ${styles[health]}`}>
                          Est. Profit
                          <span className={styles.profitAmount}>
                            ${Math.round(profit).toLocaleString()}
                          </span>
                        </div>
                      );
                    })()}
                  </div>
                  {(() => {
                      const info = getStatusInfo(job.status);
                      return (
                        <>
                          <Badge variant={info.color}>{info.label}</Badge>
                          {info.signal === 'material' && <span className={`${styles.jobSignal} ${styles.material}`}>Material</span>}
                          {info.signal === 'customer' && <span className={`${styles.jobSignal} ${styles.customer}`}>Customer</span>}
                          {info.signal === 'delayed' && <span className={`${styles.jobSignal} ${styles.delayed}`}>Delayed</span>}
                          {info.signal === 'on_track' && <span className={`${styles.jobSignal} ${styles.on_track}`}>On Track</span>}
                        </>
                      );
                    })()}
                </div>

                <div className={styles.jobMeta}>
                  <div className={styles.metaItem}>
                    <Calendar size={14} />
                    <span>
                      {job.startDate && new Date(job.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      {job.endDate && ` - ${new Date(job.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`}
                    </span>
                  </div>
                  <div className={styles.metaItem}>
                    <DollarSign size={14} />
                    <span>${(job.contractAmount || 0).toLocaleString()}</span>
                  </div>
                </div>

                {job.phases && job.phases.length > 0 && (
                  <div className={styles.phases}>
                    {job.phases.slice(0, 4).map((phase) => (
                      <div
                        key={phase.id}
                        className={`${styles.phaseDot} ${
                          phase.status === 'completed'
                            ? styles.completed
                            : phase.status === 'in_progress'
                            ? styles.active
                            : ''
                        }`}
                        title={phase.label}
                      />
                    ))}
                    {job.phases.length > 4 && (
                      <span className={styles.morePhases}>+{job.phases.length - 4}</span>
                    )}
                  </div>
                )}

                {job.tasks && job.tasks.length > 0 && (
                  <div className={styles.taskProgress}>
                    <span>
                      {job.tasks.filter((t) => t.completed).length}/{job.tasks.length} tasks
                    </span>
                    <span className={`${styles.jobHealth} ${styles[getJobHealth(job)]}`}>
                      {getJobHealth(job) === 'healthy' && 'On Track'}
                      {getJobHealth(job) === 'risk' && 'At Risk'}
                      {getJobHealth(job) === 'overBudget' && 'Overdue'}
                    </span>
                    <div className={styles.progressBar}>
                      <div
                        className={styles.progressFill}
                        style={{
                          width: `${(job.tasks.filter((t) => t.completed).length / job.tasks.length) * 100}%`,
                        }}
                      />
                    </div>
                  </div>
                )}
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      <Drawer isOpen={showBuilder} onClose={() => setShowBuilder(false)} title="Create Job">
        <JobBuilder
          customers={customers}
          estimates={estimates}
          onClose={() => setShowBuilder(false)}
          onSave={(job) => {
            setJobs((prev) => [{ ...job, id: `job-${Date.now()}` }, ...prev]);
            setShowBuilder(false);
          }}
        />
      </Drawer>

      <Drawer
        isOpen={!!selectedJob}
        onClose={() => setSelectedJob(null)}
        title={selectedJob?.project}
      >
        {selectedJob && (
          <JobDetail
            job={selectedJob}
            onToggleTask={(taskId) => toggleTask(selectedJob.id, taskId)}
            onStatusChange={(status) => {
              updateJobStatus(selectedJob.id, status);
              setSelectedJob({ ...selectedJob, status });
            }}
          />
        )}
      </Drawer>
    </div>
  );
}

function JobBuilder({ customers, estimates, onClose, onSave }) {
  const [form, setForm] = useState({
    customerId: '',
    customerName: '',
    project: '',
    estimateId: '',
    startDate: '',
    endDate: '',
    contractAmount: 0,
    notes: '',
  });

  const handleEstimateSelect = (estimateId) => {
    const estimate = estimates.find((e) => e.id === estimateId);
    if (estimate) {
      setForm({
        ...form,
        estimateId,
        customerName: estimate.customerName,
        project: estimate.projects.join(', '),
        contractAmount: estimate.totalSell,
      });
    }
  };

  const handleSave = () => {
    if (form.project && form.customerName) {
      onSave({
        ...form,
        status: 'scheduled',
        phases: [],
        tasks: [],
        photos: [],
        expenses: [],
        invoices: [],
        createdAt: new Date().toISOString().split('T')[0],
        updatedAt: new Date().toISOString().split('T')[0],
      });
    }
  };

  return (
    <div className={styles.builder}>
      <div className={styles.builderSection}>
        <h4 className={styles.sectionTitle}>From Estimate (Optional)</h4>
        <select
          className={styles.select}
          value={form.estimateId}
          onChange={(e) => handleEstimateSelect(e.target.value)}
        >
          <option value="">Select accepted estimate</option>
          {estimates.filter((e) => e.status === 'accepted').map((est) => (
            <option key={est.id} value={est.id}>
              {est.customerName} - {est.projects.join(', ')} (${est.totalSell?.toLocaleString()})
            </option>
          ))}
        </select>
      </div>

      <div className={styles.builderSection}>
        <h4 className={styles.sectionTitle}>Customer</h4>
        <select
          className={styles.select}
          value={form.customerId}
          onChange={(e) => {
            const customer = customers.find((c) => c.id === e.target.value);
            setForm({ ...form, customerId: e.target.value, customerName: customer?.name || '' });
          }}
        >
          <option value="">Select customer</option>
          {customers.map((customer) => (
            <option key={customer.id} value={customer.id}>
              {customer.name}
            </option>
          ))}
        </select>
      </div>

      <div className={styles.builderSection}>
        <h4 className={styles.sectionTitle}>Project Name</h4>
        <input
          className={styles.input}
          value={form.project}
          onChange={(e) => setForm({ ...form, project: e.target.value })}
          placeholder="e.g., Kitchen Remodel"
        />
      </div>

      <div className={styles.builderRow}>
        <div className={styles.builderSection}>
          <h4 className={styles.sectionTitle}>Start Date</h4>
          <input
            type="date"
            className={styles.input}
            value={form.startDate}
            onChange={(e) => setForm({ ...form, startDate: e.target.value })}
          />
        </div>
        <div className={styles.builderSection}>
          <h4 className={styles.sectionTitle}>End Date</h4>
          <input
            type="date"
            className={styles.input}
            value={form.endDate}
            onChange={(e) => setForm({ ...form, endDate: e.target.value })}
          />
        </div>
      </div>

      <div className={styles.builderSection}>
        <h4 className={styles.sectionTitle}>Contract Amount</h4>
        <input
          type="number"
          className={styles.input}
          value={form.contractAmount}
          onChange={(e) => setForm({ ...form, contractAmount: parseFloat(e.target.value) || 0 })}
          placeholder="$"
        />
      </div>

      <div className={styles.builderSection}>
        <h4 className={styles.sectionTitle}>Notes</h4>
        <textarea
          className={styles.textarea}
          value={form.notes}
          onChange={(e) => setForm({ ...form, notes: e.target.value })}
          placeholder="Project notes..."
          rows={3}
        />
      </div>

      <div className={styles.builderActions}>
        <Button variant="ghost" onClick={onClose}>
          Cancel
        </Button>
        <Button onClick={handleSave}>Create Job</Button>
      </div>
    </div>
  );
}

function JobDetail({ job, onToggleTask, onStatusChange }) {
  const [newNote, setNewNote] = useState('');
  const [showNoteInput, setShowNoteInput] = useState(false);
  const getStatusInfo = (status) => JOB_STATUSES.find((s) => s.id === status) || { label: status, color: 'default' };

  const jobExpenses = initialExpenses.filter((e) => e.jobId === job.id);
  const actualCost = jobExpenses.reduce((sum, e) => sum + e.amount, 0);
  const estimatedCost = job.estimatedCost || Math.round((job.contractAmount || 0) * 0.7);
  const revenue = job.contractAmount || 0;
  const profit = revenue - actualCost;
  const margin = revenue > 0 ? (profit / revenue) * 100 : 0;
  let health = 'healthy';
  if (margin < 10) health = 'risk';
  else if (margin < 20) health = 'tight';

  const tasks = job.tasks || [];
  const completedTasks = tasks.filter((t) => t.completed).length;
  const totalTasks = tasks.length;
  const taskProgress = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  return (
    <div className={styles.detail}>
      <div className={styles.detailHeader}>
        {(() => {
          const info = getStatusInfo(job.status);
          return (
            <>
              <Badge variant={info.color}>{info.label}</Badge>
              {info.signal === 'material' && <span className={`${styles.jobSignal} ${styles.material}`}>Material</span>}
              {info.signal === 'customer' && <span className={`${styles.jobSignal} ${styles.customer}`}>Customer</span>}
              {info.signal === 'delayed' && <span className={`${styles.jobSignal} ${styles.delayed}`}>Delayed</span>}
              {info.signal === 'on_track' && <span className={`${styles.jobSignal} ${styles.on_track}`}>On Track</span>}
            </>
          );
        })()}
      </div>

      <div className={styles.financials}>
        <div className={styles.financialsTitle}>
          <DollarSign size={14} />
          Financials
          <span className={`${styles.jobHealth} ${styles[health]}`}>
            {health === 'healthy' && 'On Track'}
            {health === 'tight' && 'Tight'}
            {health === 'risk' && 'At Risk'}
          </span>
        </div>
        <div className={styles.financialsGrid}>
          <div className={styles.financialItem}>
            <span className={styles.financialLabel}>Contract Value</span>
            <span className={styles.financialValue}>
              ${revenue.toLocaleString()}
            </span>
          </div>
          <div className={styles.financialItem}>
            <span className={styles.financialLabel}>Est. Cost</span>
            <span className={styles.financialValue}>
              ${estimatedCost.toLocaleString()}
            </span>
          </div>
          <div className={styles.financialItem}>
            <span className={styles.financialLabel}>Actual Cost</span>
            <span className={styles.financialValue}>
              ${actualCost.toLocaleString()}
            </span>
          </div>
          <div className={styles.financialItem}>
            <span className={styles.financialLabel}>Profit</span>
            <span className={`${styles.financialValue} ${styles.profit} ${styles[health]}`}>
              ${Math.round(profit).toLocaleString()} ({Math.round(margin)}%)
            </span>
          </div>
        </div>
      </div>

      {jobExpenses.length > 0 && (
        <div className={styles.detailSection}>
          <div className={styles.sectionHeader}>
            <h4 className={styles.sectionTitle}>Expenses ({jobExpenses.length})</h4>
            <span className={styles.expenseTotal}>${actualCost.toLocaleString()}</span>
          </div>
          <div className={styles.expensesList}>
            {jobExpenses.slice(0, 5).map((exp) => (
              <div key={exp.id} className={styles.expenseItem}>
                <span className={styles.expenseDesc}>{exp.description}</span>
                <span className={styles.expenseAmount}>${exp.amount.toLocaleString()}</span>
              </div>
            ))}
            {jobExpenses.length > 5 && (
              <div className={styles.moreExpenses}>+{jobExpenses.length - 5} more</div>
            )}
          </div>
        </div>
      )}

      <div className={styles.detailSection}>
        <h4 className={styles.sectionTitle}>Customer</h4>
        <p>{job.customerName}</p>
      </div>

      <div className={styles.detailSection}>
        <h4 className={styles.sectionTitle}>Timeline</h4>
        <div className={styles.timeline}>
          <Calendar size={16} />
          <span>
            {job.startDate && new Date(job.startDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            {job.endDate && ` - ${new Date(job.endDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}`}
          </span>
        </div>
      </div>

      <div className={styles.detailSection}>
        <h4 className={styles.sectionTitle}>Contract</h4>
        <p className={styles.contractAmount}>${(job.contractAmount || 0).toLocaleString()}</p>
      </div>

      {job.phases && job.phases.length > 0 && (
        <div className={styles.detailSection}>
          <h4 className={styles.sectionTitle}>Phases</h4>
          <div className={styles.phasesList}>
            {job.phases.map((phase) => (
              <div
                key={phase.id}
                className={`${styles.phaseItem} ${
                  phase.status === 'completed' ? styles.completed : phase.status === 'in_progress' ? styles.active : ''
                }`}
              >
                <CheckCircle size={16} />
                <span>{phase.label}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className={styles.detailSection}>
        <div className={styles.sectionHeader}>
          <h4 className={styles.sectionTitle}>Tasks ({job.tasks?.filter((t) => t.completed).length || 0}/{job.tasks?.length || 0})</h4>
        </div>
        <div className={styles.tasksList}>
          {job.tasks?.map((task, index) => (
            <div
              key={task.id}
              className={`${styles.taskItem} ${task.completed ? styles.completedTask : ''}`}
              onClick={() => {
                if (!task.completed) {
                  const el = document.activeElement;
                  if (el) el.classList.add(styles.completing);
                }
                onToggleTask(task.id);
              }}
            >
              {task.priority && (
                <div className={`${styles.taskPriority} ${styles[task.priority]}`} />
              )}
              <div className={`${styles.checkbox} ${task.completed ? styles.checked : ''}`}>
                {task.completed && <CheckCircle size={14} />}
              </div>
              <span>{task.title}</span>
              {task.dueDate && <span className={styles.taskDue}>{task.dueDate}</span>}
            </div>
          ))}
          {(!job.tasks || job.tasks.length === 0) && (
            <p className={styles.emptyText}>No tasks yet</p>
          )}
        </div>
      </div>

      <div className={styles.detailSection}>
        <div className={styles.sectionHeader}>
          <h4 className={styles.sectionTitle}>Notes</h4>
          <button className={styles.addBtn} onClick={() => setShowNoteInput(true)}>
            <Plus size={14} /> Add
          </button>
        </div>
        <div className={styles.notesList}>
          {job.notes?.map((note) => (
            <div key={note.id} className={styles.noteItem}>
              <p>{note.content}</p>
              <span>{note.date}</span>
            </div>
          ))}
          {(!job.notes || job.notes.length === 0) && (
            <p className={styles.emptyText}>No notes yet</p>
          )}
        </div>
      </div>

      <div className={styles.detailSection}>
        <h4 className={styles.sectionTitle}>Photos</h4>
        {(job.photos && job.photos.length > 0) ? (
          <div className={styles.photoSection}>
            {['before', 'after'].map((group) => {
              const photos = job.photos?.filter(p => p.group === group) || [];
              if (photos.length === 0) return null;
              return (
                <div key={group} className={styles.photoGroup}>
                  <div className={`${styles.photoGroupTitle} ${styles[group]}`}>
                    {group === 'before' ? '📸 Before' : '✨ After'}
                  </div>
                  <div className={styles.photoGrid}>
                    {photos.map((photo, i) => (
                      <div key={i} className={styles.photoThumb}>
                        <img src={photo.url || 'https://placehold.co/200'} alt={photo.label || group} />
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className={styles.photoPlaceholder}>
            <Image size={24} />
            <span>Tap to add photos</span>
          </div>
        )}
      </div>

      <div className={styles.detailActions}>
        <select
          className={styles.statusSelect}
          value={job.status}
          onChange={(e) => onStatusChange(e.target.value)}
        >
          {JOB_STATUSES.map((s) => (
            <option key={s.id} value={s.id}>
              {s.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}