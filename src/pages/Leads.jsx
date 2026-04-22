import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus,
  Search,
  Phone,
  Mail,
  MessageSquare,
  MoreVertical,
  ArrowLeft,
  Calendar,
  MapPin,
  Briefcase,
  Users,
  Clock,
  ChevronRight,
  Star,
  X,
  Edit,
  Trash2,
  CheckCircle,
} from 'lucide-react';
import { PageHeader } from '../components/TopHeader';
import Card from '../components/Card';
import Button from '../components/Button';
import Input from '../components/Input';
import Badge from '../components/Badge';
import FilterChips from '../components/FilterChips';
import Drawer from '../components/Drawer';
import Modal from '../components/Modal';
import EmptyState from '../components/EmptyState';
import { useCRM } from '../context/CRMContext';
import { LEAD_STAGES, PROJECT_TYPES, LEAD_SOURCES } from '../data/leads';
import styles from './Leads.module.css';

const stageFilters = [
  { value: 'all', label: 'All', count: 0 },
  { value: 'new', label: 'New Lead', count: 0 },
  { value: 'contacted', label: 'Contacted', count: 0 },
  { value: 'scheduled', label: 'Scheduled', count: 0 },
  { value: 'sent', label: 'Sent', count: 0 },
  { value: 'followup', label: 'Follow-Up', count: 0 },
  { value: 'won', label: 'Won', count: 0 },
  { value: 'lost', label: 'Lost', count: 0 },
];

export default function Leads() {
  const { leads, addLead, updateLeadStage, searchLeads, loading } = useCRM();
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [showAddDrawer, setShowAddDrawer] = useState(false);
  const [selectedLead, setSelectedLead] = useState(null);

  const filteredLeads = leads.filter((lead) => {
    const matchesSearch =
      !search ||
      lead.name.toLowerCase().includes(search.toLowerCase()) ||
      lead.phone.includes(search) ||
      lead.projectType.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === 'all' || lead.stage === filter;
    return matchesSearch && matchesFilter;
  });

  const getCounts = () => {
    const counts = { all: leads.length };
    LEAD_STAGES.forEach((s) => {
      counts[s.id] = leads.filter((l) => l.stage === s.id).length;
    });
    return counts;
  };

  const counts = getCounts();
  const options = stageFilters.map((o) => ({ ...o, count: counts[o.value] || 0 }));

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <PageHeader title="Leads" subtitle={`${leads.length} total leads`}>
          <Button icon={Plus} onClick={() => setShowAddDrawer(true)}>
            Add Lead
          </Button>
        </PageHeader>

        <div className={styles.search}>
          <Input
            icon={Search}
            placeholder="Search leads..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <FilterChips options={options} value={filter} onChange={setFilter} />

        <div className={styles.list}>
          {loading ? (
            <div className={styles.loading}>Loading...</div>
          ) : filteredLeads.length === 0 ? (
            <EmptyState
              icon={Users}
              title="No leads found"
              description={search ? 'Try a different search' : 'Add your first lead to get started'}
            />
          ) : (
            filteredLeads.map((lead, i) => (
              <motion.div
                key={lead.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <LeadCard
                  lead={lead}
                  onClick={() => setSelectedLead(lead)}
                  onStageChange={(stage) => updateLeadStage(lead.id, stage)}
                />
              </motion.div>
            ))
          )}
        </div>
      </div>

      <Drawer
        isOpen={showAddDrawer}
        onClose={() => setShowAddDrawer(false)}
        title="New Lead"
      >
        <AddLeadForm onClose={() => setShowAddDrawer(false)} />
      </Drawer>

      <Drawer
        isOpen={!!selectedLead}
        onClose={() => setSelectedLead(null)}
        title={selectedLead?.name}
      >
        {selectedLead && (
          <LeadDetail
            lead={selectedLead}
            onClose={() => setSelectedLead(null)}
            onStageChange={(stage) => {
              updateLeadStage(selectedLead.id, stage);
              setSelectedLead({ ...selectedLead, stage });
            }}
          />
        )}
      </Drawer>
    </div>
  );
}

function LeadCard({ lead, onClick, onStageChange }) {
  const isOverdue =
    lead.followUpDate &&
    new Date(lead.followUpDate) < new Date() &&
    !['won', 'lost'].includes(lead.stage);

  const stage = LEAD_STAGES.find((s) => s.id === lead.stage);

  return (
    <Card className={styles.leadCard} onClick={onClick}>
      <div className={styles.leadHeader}>
        <div className={styles.leadAvatar}>
          {lead.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
        </div>
        <div className={styles.leadInfo}>
          <h3 className={styles.leadName}>{lead.name}</h3>
          <p className={styles.leadProject}>{lead.projectType}</p>
        </div>
        <Badge variant={stage?.color || 'default'} size="sm">
          {stage?.label}
        </Badge>
      </div>

      {lead.address && (
        <div className={styles.leadDetail}>
          <MapPin size={14} />
          <span>{lead.address}</span>
        </div>
      )}

      {lead.followUpDate && (
        <div className={`${styles.leadDetail} ${isOverdue ? styles.overdue : ''}`}>
          <Clock size={14} />
          <span>
            Follow-up: {new Date(lead.followUpDate).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
            })}
          </span>
        </div>
      )}

      <div className={styles.leadActions}>
        <a href={`tel:${lead.phone}`} className={styles.actionBtn} onClick={(e) => e.stopPropagation()}>
          <Phone size={18} />
        </a>
        <a href={`sms:${lead.phone}`} className={styles.actionBtn} onClick={(e) => e.stopPropagation()}>
          <MessageSquare size={18} />
        </a>
        <a href={`mailto:${lead.email}`} className={styles.actionBtn} onClick={(e) => e.stopPropagation()}>
          <Mail size={18} />
        </a>
      </div>

      <div className={styles.stageButtons}>
        {LEAD_STAGES.filter((s) => s.id !== lead.stage).slice(0, 3).map((s) => (
          <button
            key={s.id}
            className={styles.stageBtn}
            onClick={(e) => {
              e.stopPropagation();
              onStageChange(s.id);
            }}
          >
            Move to {s.label}
          </button>
        ))}
      </div>
    </Card>
  );
}

function AddLeadForm({ onClose }) {
  const { addLead } = useCRM();
  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    projectType: '',
    source: '',
    notes: '',
    followUpDate: '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (form.name && form.phone) {
      addLead(form);
      onClose();
    }
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <Input
        label="Name *"
        value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
        required
      />
      <Input
        label="Phone *"
        value={form.phone}
        onChange={(e) => setForm({ ...form, phone: e.target.value })}
        required
      />
      <Input
        label="Email"
        type="email"
        value={form.email}
        onChange={(e) => setForm({ ...form, email: e.target.value })}
      />
      <Input
        label="Address"
        value={form.address}
        onChange={(e) => setForm({ ...form, address: e.target.value })}
      />
      <div className={styles.field}>
        <label className={styles.label}>Project Type</label>
        <select
          className={styles.select}
          value={form.projectType}
          onChange={(e) => setForm({ ...form, projectType: e.target.value })}
        >
          <option value="">Select project type</option>
          {PROJECT_TYPES.map((p) => (
            <option key={p} value={p}>{p}</option>
          ))}
        </select>
      </div>
      <div className={styles.field}>
        <label className={styles.label}>Source</label>
        <select
          className={styles.select}
          value={form.source}
          onChange={(e) => setForm({ ...form, source: e.target.value })}
        >
          <option value="">How did they find you?</option>
          {LEAD_SOURCES.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>
      <Input
        label="Follow-up Date"
        type="date"
        value={form.followUpDate}
        onChange={(e) => setForm({ ...form, followUpDate: e.target.value })}
      />
      <div className={styles.field}>
        <label className={styles.label}>Notes</label>
        <textarea
          className={styles.textarea}
          value={form.notes}
          onChange={(e) => setForm({ ...form, notes: e.target.value })}
          rows={3}
        />
      </div>
      <div className={styles.formActions}>
        <Button type="button" variant="ghost" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit">Add Lead</Button>
      </div>
    </form>
  );
}

function LeadDetail({ lead, onClose, onStageChange }) {
  const stage = LEAD_STAGES.find((s) => s.id === lead.stage);

  const activityIcons = {
    note: Edit,
    call: Phone,
    email: Mail,
    estimate: Briefcase,
    job: Briefcase,
    stage: ArrowLeft,
  };

  return (
    <div className={styles.detail}>
      <div className={styles.detailHeader}>
        <Badge variant={stage?.color}>{stage?.label}</Badge>
      </div>

      <div className={styles.quickActions}>
        <a href={`tel:${lead.phone}`} className={styles.quickAction}>
          <Phone size={20} />
          <span>Call</span>
        </a>
        <a href={`sms:${lead.phone}`} className={styles.quickAction}>
          <MessageSquare size={20} />
          <span>Text</span>
        </a>
        <a href={`mailto:${lead.email}`} className={styles.quickAction}>
          <Mail size={20} />
          <span>Email</span>
        </a>
      </div>

      <div className={styles.detailSection}>
        <h4 className={styles.sectionTitle}>Contact Info</h4>
        <div className={styles.detailRow}>
          <Phone size={16} />
          <span>{lead.phone}</span>
        </div>
        <div className={styles.detailRow}>
          <Mail size={16} />
          <span>{lead.email}</span>
        </div>
        {lead.address && (
          <div className={styles.detailRow}>
            <MapPin size={16} />
            <span>{lead.address}</span>
          </div>
        )}
      </div>

      <div className={styles.detailSection}>
        <h4 className={styles.sectionTitle}>Project</h4>
        <p>{lead.projectType}</p>
        <p className={styles.muted}>Source: {lead.source}</p>
      </div>

      {lead.followUpDate && (
        <div className={styles.detailSection}>
          <h4 className={styles.sectionTitle}>Follow-up</h4>
          <p>
            {new Date(lead.followUpDate).toLocaleDateString('en-US', {
              weekday: 'long',
              month: 'long',
              day: 'numeric',
            })}
          </p>
        </div>
      )}

      {lead.notes && (
        <div className={styles.detailSection}>
          <h4 className={styles.sectionTitle}>Notes</h4>
          <p>{lead.notes}</p>
        </div>
      )}

      <div className={styles.detailSection}>
        <h4 className={styles.sectionTitle}>Pipeline</h4>
        <div className={styles.pipeline}>
          {LEAD_STAGES.map((s) => (
            <button
              key={s.id}
              className={`${styles.pipelineBtn} ${s.id === lead.stage ? styles.active : ''}`}
              onClick={() => onStageChange(s.id)}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.detailSection}>
        <h4 className={styles.sectionTitle}>Activity</h4>
        <div className={styles.timeline}>
          {(lead.activities || []).map((activity) => {
            const Icon = activityIcons[activity.type] || Edit;
            return (
              <div key={activity.id} className={styles.timelineItem}>
                <div className={styles.timelineIcon}>
                  <Icon size={14} />
                </div>
                <div className={styles.timelineContent}>
                  <p>{activity.content}</p>
                  <span className={styles.timelineDate}>
                    {new Date(activity.date).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                    })}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}