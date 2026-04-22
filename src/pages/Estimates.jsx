import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Search,
  Plus,
  FileText,
  DollarSign,
  Clock,
  CheckCircle,
  XCircle,
  Send,
  MoreVertical,
  Trash2,
  Copy,
  Briefcase,
  ArrowRight,
  Eye,
  Edit,
} from 'lucide-react';
import { PageHeader } from '../components/TopHeader';
import Card from '../components/Card';
import Button from '../components/Button';
import Input from '../components/Input';
import Badge from '../components/Badge';
import FilterChips from '../components/FilterChips';
import Drawer from '../components/Drawer';
import Modal from '../components/Modal';
import { useCRM } from '../context/CRMContext';
import { initialEstimates } from '../data/estimates';
import styles from './Estimates.module.css';

const statusFilters = [
  { value: 'all', label: 'All', count: 0 },
  { value: 'draft', label: 'Draft', count: 0 },
  { value: 'sent', label: 'Sent', count: 0 },
  { value: 'accepted', label: 'Accepted', count: 0 },
  { value: 'declined', label: 'Declined', count: 0 },
];

export default function Estimates() {
  const navigate = useNavigate();
  const { leads, customers } = useCRM();
  const [estimates, setEstimates] = useState(initialEstimates);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [showBuilder, setShowBuilder] = useState(false);
  const [selectedEstimate, setSelectedEstimate] = useState(null);
  const [viewMode, setViewMode] = useState(null);

  const filteredEstimates = estimates.filter((est) => {
    const matchesSearch =
      !search ||
      est.customerName.toLowerCase().includes(search.toLowerCase()) ||
      est.projects.some((p) => p.toLowerCase().includes(search.toLowerCase()));
    const matchesFilter = filter === 'all' || est.status === filter;
    return matchesSearch && matchesFilter;
  });

  const getCounts = () => {
    const counts = { all: estimates.length };
    ['draft', 'sent', 'accepted', 'declined'].forEach((s) => {
      counts[s] = estimates.filter((e) => e.status === s).length;
    });
    return counts;
  };

  const counts = getCounts();
  const options = statusFilters.map((o) => ({ ...o, count: counts[o.value] || 0 }));

  const updateEstimateStatus = (id, status) => {
    setEstimates((prev) =>
      prev.map((e) =>
        e.id === id
          ? { ...e, status, [status === 'sent' ? 'sentAt' : status === 'accepted' ? 'acceptedAt' : 'updatedAt']: new Date().toISOString().split('T')[0] }
          : e
      )
    );
  };

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <PageHeader title="Estimates" subtitle={`${estimates.length} estimates`}>
          <Button icon={Plus} onClick={() => setShowBuilder(true)}>
            New Estimate
          </Button>
        </PageHeader>

        <div className={styles.search}>
          <Input
            icon={Search}
            placeholder="Search estimates..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <FilterChips options={options} value={filter} onChange={setFilter} />

        <div className={styles.stats}>
          <div className={styles.statCard}>
            <span className={styles.statLabel}>Total Value</span>
            <span className={styles.statValue}>
              ${estimates.reduce((sum, e) => sum + (e.totalSell || 0), 0).toLocaleString()}
            </span>
          </div>
          <div className={styles.statCard}>
            <span className={styles.statLabel}>Accepted Rate</span>
            <span className={styles.statValue}>
              {estimates.length > 0
                ? Math.round(
                    (estimates.filter((e) => e.status === 'accepted').length / estimates.length) * 100
                  )
                : 0}
              %
            </span>
          </div>
        </div>

        <div className={styles.list}>
          {filteredEstimates.map((estimate, i) => (
            <motion.div
              key={estimate.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Card
                className={styles.estimateCard}
                onClick={() => setSelectedEstimate(estimate)}
              >
                <div className={styles.estimateHeader}>
                  <div className={styles.estimateInfo}>
                    <h3 className={styles.estimateName}>{estimate.customerName}</h3>
                    <p className={styles.estimateProjects}>
                      {estimate.projects.join(', ')}
                    </p>
                  </div>
                  <span className={`${styles.estimateStatus} ${estimate.status}`}>
                    {estimate.status}
                  </span>
                </div>

                <div className={styles.estimateAmount}>
                  <span className={styles.amountLabel}>Estimate Value</span>
                  <span className={styles.amountValue}>
                    ${(estimate.totalSell || 0).toLocaleString()}
                  </span>
                </div>

                <div className={styles.estimateMeta}>
                  <span>{estimate.createdAt}</span>
                  {estimate.projects.length > 0 && (
                    <span>{estimate.items?.length || 0} items</span>
                  )}
                </div>

                {estimate.status !== 'draft' && (
                  <div className={styles.estimateActions}>
                    <button
                      className={styles.actionBtn}
                      onClick={(e) => {
                        e.stopPropagation();
                        setViewMode('internal');
                        setSelectedEstimate(estimate);
                      }}
                    >
                      <Eye size={16} />
                      Internal
                    </button>
                    <button
                      className={styles.actionBtn}
                      onClick={(e) => {
                        e.stopPropagation();
                        setViewMode('client');
                        setSelectedEstimate(estimate);
                      }}
                    >
                      <FileText size={16} />
                      Client View
                    </button>
                  </div>
                )}
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      <Drawer isOpen={showBuilder} onClose={() => setShowBuilder(false)} title="New Estimate">
        <EstimateBuilder
          leads={leads}
          customers={customers}
          onClose={() => setShowBuilder(false)}
          onSave={(estimate) => {
            setEstimates((prev) => [{ ...estimate, id: `est-${Date.now()}` }, ...prev]);
            setShowBuilder(false);
          }}
        />
      </Drawer>

      <Drawer
        isOpen={!!selectedEstimate && !viewMode}
        onClose={() => {
          setSelectedEstimate(null);
          setViewMode(null);
        }}
        title={selectedEstimate?.customerName}
      >
        {selectedEstimate && (
          <EstimateDetail
            estimate={selectedEstimate}
            onStatusChange={(status) => {
              updateEstimateStatus(selectedEstimate.id, status);
              setSelectedEstimate({ ...selectedEstimate, status });
            }}
            onClose={() => setSelectedEstimate(null)}
          />
        )}
      </Drawer>

      <Drawer
        isOpen={!!selectedEstimate && viewMode === 'internal'}
        onClose={() => {
          setSelectedEstimate(null);
          setViewMode(null);
        }}
        title={`${selectedEstimate?.customerName} - Internal`}
      >
        {selectedEstimate && <EstimateView estimate={selectedEstimate} mode="internal" />}
      </Drawer>

      <Drawer
        isOpen={!!selectedEstimate && viewMode === 'client'}
        onClose={() => {
          setSelectedEstimate(null);
          setViewMode(null);
        }}
        title={`${selectedEstimate?.customerName} - Quote`}
      >
        {selectedEstimate && <EstimateView estimate={selectedEstimate} mode="client" />}
      </Drawer>
    </div>
  );
}

function EstimateBuilder({ leads, customers, onClose, onSave }) {
  const [form, setForm] = useState({
    customerId: '',
    customerName: '',
    leadId: '',
    leadName: '',
    projects: [],
    items: [],
    notes: '',
  });
  const [showProjectSelect, setShowProjectSelect] = useState(false);
  const [selectedProjectType, setSelectedProjectType] = useState('');

  const projectTypes = [
    'Kitchen Remodel',
    'Bathroom Remodel',
    'Deck',
    'Flooring',
    'Roofing',
    'Painting',
    'Drywall',
    'Full Renovation',
    'Addition',
  ];

  const addProject = (project) => {
    setForm((prev) => ({
      ...prev,
      projects: [...prev.projects, project].filter(Boolean),
    }));
    setSelectedProjectType('');
    setShowProjectSelect(false);
  };

  const addItem = (item) => {
    setForm((prev) => ({
      ...prev,
      items: [...prev.items, { ...item, optional: false }],
    }));
  };

  const totalCost = form.items.reduce((sum, i) => sum + (i.unitCost || 0) * (i.quantity || 1), 0);
  const totalSell = form.items.reduce((sum, i) => sum + (i.sellPrice || 0) * (i.quantity || 1), 0);

  const handleSave = () => {
    onSave({
      ...form,
      status: 'draft',
      createdAt: new Date().toISOString().split('T')[0],
      totalCost,
      totalSell,
    });
  };

  return (
    <div className={styles.builder}>
      <div className={styles.builderSection}>
        <h4 className={styles.sectionTitle}>Customer / Lead</h4>
        <select
          className={styles.select}
          value={form.leadId || form.customerId}
          onChange={(e) => {
            const selected = e.target.value;
            if (selected.startsWith('lead-')) {
              const lead = leads.find((l) => l.id === selected.replace('lead-', ''));
              setForm({ ...form, leadId: lead?.id, leadName: lead?.name, customerId: '', customerName: lead?.name });
            } else if (selected.startsWith('cust-')) {
              const customer = customers.find((c) => c.id === selected.replace('cust-', ''));
              setForm({ ...form, customerId: customer?.id, customerName: customer?.name, leadId: '', leadName: '' });
            }
          }}
        >
          <option value="">Select customer or lead</option>
          <optgroup label="Leads">
            {leads.filter((l) => !['won', 'lost'].includes(l.stage)).map((lead) => (
              <option key={`lead-${lead.id}`} value={`lead-${lead.id}`}>
                {lead.name} (Lead)
              </option>
            ))}
          </optgroup>
          <optgroup label="Customers">
            {customers.map((customer) => (
              <option key={`cust-${customer.id}`} value={`cust-${customer.id}`}>
                {customer.name}
              </option>
            ))}
          </optgroup>
        </select>
      </div>

      <div className={styles.builderSection}>
        <div className={styles.sectionHeader}>
          <h4 className={styles.sectionTitle}>Projects</h4>
          <button className={styles.addBtn} onClick={() => setShowProjectSelect(!showProjectSelect)}>
            <Plus size={16} /> Add
          </button>
        </div>
        <div className={styles.projectChips}>
          {form.projects.map((project) => (
            <span key={project} className={styles.projectChip}>
              {project}
              <button onClick={() => setForm((prev) => ({ ...prev, projects: prev.projects.filter((p) => p !== project) }))}>
                <XCircle size={14} />
              </button>
            </span>
          ))}
        </div>
        {showProjectSelect && (
          <div className={styles.projectPicker}>
            {projectTypes.map((project) => (
              <button
                key={project}
                className={styles.projectOption}
                onClick={() => addProject(project)}
              >
                {project}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className={styles.builderSection}>
        <div className={styles.sectionHeader}>
          <h4 className={styles.sectionTitle}>Line Items</h4>
        </div>
        {form.projects.length > 0 && (
          <div className={styles.suggestions}>
            <p className={styles.suggestionsTitle}>
              Suggested items from {form.projects[0]}:
            </p>
            <div className={styles.suggestionItems}>
              {[
                'Kitchen Remodel',
                'Bathroom Remodel',
                'Deck',
                'Flooring',
                'Roofing',
              ].includes(form.projects[0]) &&
                [
                  { name: 'Labor', cost: 1000, sell: 1500 },
                  { name: 'Materials', cost: 2000, sell: 3000 },
                ].map((item, i) => (
                  <button
                    key={i}
                    className={styles.suggestionItem}
                    onClick={() =>
                      addItem({ ...item, name: `${form.projects[0]} - ${item.name}`, category: item.name === 'Materials' ? 'materials' : 'labor', quantity: 1 })
                    }
                  >
                    + {item.name}
                  </button>
                ))}
            </div>
          </div>
        )}
        <div className={styles.itemsList}>
          {form.items.map((item, i) => (
            <div key={i} className={styles.itemRow}>
              <div className={styles.itemName}>{item.name}</div>
              <div className={styles.itemInputs}>
                <input
                  type="number"
                  placeholder="Qty"
                  value={item.quantity}
                  onChange={(e) => {
                    const qty = parseFloat(e.target.value) || 1;
                    const newItems = [...form.items];
                    newItems[i] = { ...item, quantity: qty };
                    setForm({ ...form, items: newItems });
                  }}
                  className={styles.itemInput}
                />
                <input
                  type="number"
                  placeholder="$"
                  value={item.sellPrice}
                  onChange={(e) => {
                    const price = parseFloat(e.target.value) || 0;
                    const newItems = [...form.items];
                    newItems[i] = { ...item, sellPrice: price };
                    setForm({ ...form, items: newItems });
                  }}
                  className={styles.itemInput}
                />
              </div>
            </div>
          ))}
          <button
            className={styles.addItemBtn}
            onClick={() => addItem({ name: '', quantity: 1, unitCost: 0, sellPrice: 0, category: 'labor' })}
          >
            <Plus size={16} /> Add Line Item
          </button>
        </div>
      </div>

      <div className={styles.builderSection}>
        <h4 className={styles.sectionTitle}>Notes</h4>
        <textarea
          className={styles.textarea}
          value={form.notes}
          onChange={(e) => setForm({ ...form, notes: e.target.value })}
          placeholder="Add any notes for this estimate..."
          rows={3}
        />
      </div>

      <div className={styles.builderTotals}>
        <div className={styles.totalRow}>
          <span>Internal Cost</span>
          <span>${totalCost.toLocaleString()}</span>
        </div>
        <div className={styles.totalRow}>
          <span>Client Price</span>
          <span className={styles.totalSell}>${totalSell.toLocaleString()}</span>
        </div>
        <div className={styles.totalRow}>
          <span>Margin</span>
          <span>{totalCost > 0 ? Math.round(((totalSell - totalCost) / totalSell) * 100) : 0}%</span>
        </div>
      </div>

      <div className={styles.builderActions}>
        <Button variant="ghost" onClick={onClose}>
          Cancel
        </Button>
        <Button variant="secondary" onClick={handleSave}>
          Save Draft
        </Button>
      </div>
    </div>
  );
}

function EstimateDetail({ estimate, onStatusChange, onClose }) {
  const totalCost = estimate.items?.reduce((sum, i) => sum + (i.unitCost || 0) * (i.quantity || 1), 0) || 0;
  const totalSell = estimate.totalSell || 0;

  return (
    <div className={styles.detail}>
      <div className={styles.detailStatus}>
        <Badge
          variant={
            estimate.status === 'accepted'
              ? 'success'
              : estimate.status === 'sent'
              ? 'info'
              : estimate.status === 'declined'
              ? 'error'
              : 'default'
          }
        >
          {estimate.status}
        </Badge>
      </div>

      <div className={styles.detailSection}>
        <h4 className={styles.sectionTitle}>Projects</h4>
        <p>{estimate.projects?.join(', ')}</p>
      </div>

      <div className={styles.detailSection}>
        <h4 className={styles.sectionTitle}>Totals</h4>
        <div className={styles.detailTotals}>
          <div className={styles.detailTotal}>
            <span>Internal Cost</span>
            <span>${totalCost.toLocaleString()}</span>
          </div>
          <div className={styles.detailTotal}>
            <span>Client Price</span>
            <span className={styles.highlight}>${totalSell.toLocaleString()}</span>
          </div>
          <div className={styles.detailTotal}>
            <span>Margin</span>
            <span>{totalCost > 0 ? Math.round(((totalSell - totalCost) / totalSell) * 100) : 0}%</span>
          </div>
        </div>
      </div>

      {estimate.items?.length > 0 && (
        <div className={styles.detailSection}>
          <h4 className={styles.sectionTitle}>Line Items ({estimate.items.length})</h4>
          <div className={styles.itemsList}>
            {estimate.items.map((item, i) => (
              <div key={i} className={styles.itemRow}>
                <div className={styles.itemName}>
                  {item.name}
                  {item.optional && <Badge size="sm">Optional</Badge>}
                </div>
                <div className={styles.itemPrice}>${(item.sellPrice * (item.quantity || 1)).toLocaleString()}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {estimate.notes && (
        <div className={styles.detailSection}>
          <h4 className={styles.sectionTitle}>Notes</h4>
          <p>{estimate.notes}</p>
        </div>
      )}

      <div className={styles.detailActions}>
        {estimate.status === 'draft' && (
          <>
            <Button variant="secondary" fullWidth onClick={() => onStatusChange('sent')}>
              <Send size={16} /> Send to Customer
            </Button>
            <Button variant="ghost" fullWidth onClick={() => onStatusChange('accepted')}>
              <CheckCircle size={16} /> Mark Accepted
            </Button>
          </>
        )}
        {estimate.status === 'sent' && (
          <>
            <Button variant="secondary" fullWidth onClick={() => onStatusChange('accepted')}>
              <CheckCircle size={16} /> Mark Accepted
            </Button>
            <Button variant="ghost" fullWidth onClick={() => onStatusChange('declined')}>
              <XCircle size={16} /> Mark Declined
            </Button>
          </>
        )}
        {estimate.status === 'accepted' && (
          <Button variant="primary" fullWidth>
            <Briefcase size={16} /> Convert to Job
          </Button>
        )}
      </div>
    </div>
  );
}

function EstimateView({ estimate, mode }) {
  const totalCost = estimate.items?.reduce((sum, i) => sum + (i.unitCost || 0) * (i.quantity || 1), 0) || 0;
  const totalSell = estimate.totalSell || 0;
  const materialsCost = estimate.items?.filter(i => i.category !== 'labor').reduce((sum, i) => sum + (i.unitCost || 0) * (i.quantity || 1), 0) || 0;
  const laborCost = estimate.items?.filter(i => i.category === 'labor').reduce((sum, i) => sum + (i.unitCost || 0) * (i.quantity || 1), 0) || 0;

  return (
    <div className={styles.view}>
      <div className={styles.viewHeader}>
        <h2>{estimate.customerName}</h2>
        <p>{estimate.projects?.join(', ')}</p>
      </div>

      {mode === 'internal' && (
        <div className={styles.internalBadge}>Internal View</div>
      )}

      {mode === 'internal' ? (
        <>
          <div className={`${styles.viewSection} ${styles.materials}`}>
            <h4>Materials</h4>
            <table className={styles.viewTable}>
              <tbody>
                {estimate.items?.filter(i => i.category !== 'labor').map((item, i) => (
                  <tr key={i}>
                    <td>{item.name}</td>
                    <td>${((item.unitCost || 0) * (item.quantity || 1)).toLocaleString()}</td>
                    <td>${((item.sellPrice || 0) * (item.quantity || 1)).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className={`${styles.viewSection} ${styles.labor}`}>
            <h4>Labor</h4>
            <table className={styles.viewTable}>
              <tbody>
                {estimate.items?.filter(i => i.category === 'labor').map((item, i) => (
                  <tr key={i}>
                    <td>{item.name}</td>
                    <td>${((item.unitCost || 0) * (item.quantity || 1)).toLocaleString()}</td>
                    <td>${((item.sellPrice || 0) * (item.quantity || 1)).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className={`${styles.viewSection} ${styles.profit}`}>
            <h4>Profit Analysis</h4>
            <table className={styles.viewTable}>
              <tbody>
                <tr className={styles.costRow}>
                  <td>Total Materials Cost</td>
                  <td></td>
                  <td>${materialsCost.toLocaleString()}</td>
                </tr>
                <tr className={styles.costRow}>
                  <td>Total Labor Cost</td>
                  <td></td>
                  <td>${laborCost.toLocaleString()}</td>
                </tr>
                <tr className={styles.profitRow}>
                  <td>Gross Profit</td>
                  <td></td>
                  <td>${(totalSell - totalCost).toLocaleString()}</td>
                </tr>
                <tr className={styles.marginRow}>
                  <td>Profit Margin</td>
                  <td></td>
                  <td>{totalCost > 0 ? Math.round(((totalSell - totalCost) / totalSell) * 100) : 0}%</td>
                </tr>
              </tbody>
            </table>
          </div>
        </>
      ) : (
        <div className={styles.viewSection}>
          <h4>Items</h4>
          <table className={styles.viewTable}>
            <thead>
              <tr>
                <th>Description</th>
                <th>Price</th>
              </tr>
            </thead>
            <tbody>
              {estimate.items?.map((item, i) => (
                <tr key={i}>
                  <td>
                    {item.name}
                    {item.optional && <span className={styles.optionalNote}> (optional)</span>}
                  </td>
                  <td>${((item.sellPrice || 0) * (item.quantity || 1)).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className={styles.viewTotal}>
        <span className={styles.viewTotalLabel}>Total</span>
        <span>${totalSell.toLocaleString()}</span>
      </div>

      {estimate.notes && (
        <div className={styles.viewSection}>
          <h4>Notes</h4>
          <p>{estimate.notes}</p>
        </div>
      )}

      <div className={styles.viewFooter}>
        <p>Prepared by Contractors CRM</p>
        <p>{new Date().toLocaleDateString()}</p>
      </div>
    </div>
  );
}