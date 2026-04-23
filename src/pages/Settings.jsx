import { useState } from 'react';
import {
  User,
  Building,
  Bell,
  CreditCard,
  Zap,
  Shield,
  HelpCircle,
  LogOut,
  ChevronRight,
  Check,
  Info,
  AlertTriangle,
  DollarSign,
  Plus,
  Trash2,
  Edit,
} from 'lucide-react';
import { PageHeader } from '../components/TopHeader';
import Card from '../components/Card';
import Badge from '../components/Badge';
import Button from '../components/Button';
import Drawer from '../components/Drawer';
import { COMPANY_INFO, BRANDING, NOTIFICATION_SETTINGS, AUTOMATIONS, SMART_INSIGHTS, PRICING_ITEMS, DEFAULT_MARKUP } from '../data/settings';
import styles from './Settings.module.css';

export default function Settings() {
  const [activeSection, setActiveSection] = useState(null);

  const menuSections = [
    {
      id: 'business',
      icon: Building,
      label: 'Business Profile',
      description: 'Company info and branding',
    },
    {
      id: 'notifications',
      icon: Bell,
      label: 'Notifications',
      description: 'Alert preferences',
    },
    {
      id: 'automations',
      icon: Zap,
      label: 'Automations',
      description: 'Smart workflows',
    },
    {
      id: 'team',
      icon: User,
      label: 'Team',
      description: 'Users and access (coming soon)',
      disabled: true,
    },
    {
      id: 'billing',
      icon: CreditCard,
      label: 'Billing',
      description: 'Subscription (coming soon)',
      disabled: true,
    },
    {
      id: 'security',
      icon: Shield,
      label: 'Security',
      description: 'Password and 2FA',
    },
    {
      id: 'pricing',
      icon: DollarSign,
      label: 'Pricing Library',
      description: 'Materials, labor & equipment rates',
    },
    {
      id: 'help',
      icon: HelpCircle,
      label: 'Help & Support',
      description: 'FAQ and contact',
    },
  ];

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <PageHeader title="Settings" subtitle="Manage your account and preferences" />

        {SMART_INSIGHTS.length > 0 && (
          <div className={styles.insightsCard}>
            <h3 className={styles.insightsTitle}>
              <Zap size={18} /> Smart Insights
            </h3>
            <div className={styles.insightsList}>
              {SMART_INSIGHTS.map((insight) => (
                <div
                  key={insight.id}
                  className={`${styles.insightItem} ${styles[insight.type]}`}
                >
                  {insight.type === 'warning' && <AlertTriangle size={16} />}
                  {insight.type === 'error' && <AlertTriangle size={16} />}
                  {insight.type === 'success' && <Check size={16} />}
                  <div className={styles.insightContent}>
                    <span className={styles.insightTitle}>{insight.title}</span>
                    <span className={styles.insightMessage}>{insight.message}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>Account</h3>
          <div className={styles.menuList}>
            {menuSections.map((item) => (
              <button
                key={item.id}
                className={`${styles.menuItem} ${item.disabled ? styles.disabled : ''}`}
                onClick={() => !item.disabled && setActiveSection(item.id)}
                disabled={item.disabled}
              >
                <div className={styles.menuIcon}>
                  <item.icon size={22} />
                </div>
                <div className={styles.menuContent}>
                  <span className={styles.menuLabel}>{item.label}</span>
                  <span className={styles.menuDesc}>{item.description}</span>
                </div>
                {!item.disabled && <ChevronRight size={20} className={styles.chevron} />}
              </button>
            ))}
          </div>
        </div>

        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>About</h3>
          <div className={styles.aboutInfo}>
            <div className={styles.appInfo}>
              <div className={styles.appLogo}>
                <Building size={24} />
              </div>
              <div>
                <h4>Contractors CRM</h4>
                <p>Version 1.0.0</p>
              </div>
            </div>
            <p className={styles.copyright}>
              Built for contractors who want a premium, professional CRM experience.
            </p>
          </div>
        </div>
      </div>

      <Drawer
        isOpen={activeSection === 'business'}
        onClose={() => setActiveSection(null)}
        title="Business Profile"
      >
        <BusinessSettings />
      </Drawer>

      <Drawer
        isOpen={activeSection === 'notifications'}
        onClose={() => setActiveSection(null)}
        title="Notifications"
      >
        <NotificationSettings />
      </Drawer>

      <Drawer
        isOpen={activeSection === 'automations'}
        onClose={() => setActiveSection(null)}
        title="Automations"
      >
        <AutomationSettings />
      </Drawer>

      <Drawer
        isOpen={activeSection === 'pricing'}
        onClose={() => setActiveSection(null)}
        title="Pricing Library"
      >
        <PricingLibrarySettings />
      </Drawer>
    </div>
  );
}

function BusinessSettings() {
  const [company, setCompany] = useState(COMPANY_INFO);

  return (
    <div className={styles.settingsForm}>
      <div className={styles.field}>
        <label className={styles.label}>Company Name</label>
        <input
          className={styles.input}
          value={company.name}
          onChange={(e) => setCompany({ ...company, name: e.target.value })}
        />
      </div>

      <div className={styles.field}>
        <label className={styles.label}>Owner Name</label>
        <input
          className={styles.input}
          value={company.owner}
          onChange={(e) => setCompany({ ...company, owner: e.target.value })}
        />
      </div>

      <div className={styles.field}>
        <label className={styles.label}>Email</label>
        <input
          className={styles.input}
          type="email"
          value={company.email}
          onChange={(e) => setCompany({ ...company, email: e.target.value })}
        />
      </div>

      <div className={styles.field}>
        <label className={styles.label}>Phone</label>
        <input
          className={styles.input}
          value={company.phone}
          onChange={(e) => setCompany({ ...company, phone: e.target.value })}
        />
      </div>

      <div className={styles.field}>
        <label className={styles.label}>Address</label>
        <textarea
          className={styles.textarea}
          value={company.address}
          onChange={(e) => setCompany({ ...company, address: e.target.value })}
          rows={2}
        />
      </div>

      <div className={styles.field}>
        <label className={styles.label}>Website</label>
        <input
          className={styles.input}
          value={company.website}
          onChange={(e) => setCompany({ ...company, website: e.target.value })}
        />
      </div>

      <div className={styles.actions}>
        <Button variant="secondary" fullWidth>Save Changes</Button>
      </div>
    </div>
  );
}

function NotificationSettings() {
  const [settings, setSettings] = useState(NOTIFICATION_SETTINGS);

  const toggleSetting = (key) => {
    setSettings({ ...settings, [key]: !settings[key] });
  };

  const notificationOptions = [
    { key: 'leadFollowUp', label: 'Lead follow-up reminders', description: 'Get reminded to follow up on new leads' },
    { key: 'estimateReminders', label: 'Estimate reminders', description: 'Follow up on sent estimates' },
    { key: 'invoiceReminders', label: 'Invoice reminders', description: 'Alerts for overdue invoices' },
    { key: 'jobTasks', label: 'Job task reminders', description: 'Daily task summaries' },
    { key: 'weeklyDigest', label: 'Weekly digest', description: 'Weekly business summary' },
  ];

  return (
    <div className={styles.settingsForm}>
      <p className={styles.settingsDesc}>
        Choose what notifications you want to receive
      </p>

      {notificationOptions.map((option) => (
        <button
          key={option.key}
          className={styles.toggleItem}
          onClick={() => toggleSetting(option.key)}
        >
          <div className={styles.toggleInfo}>
            <span>{option.label}</span>
            <span className={styles.toggleDesc}>{option.description}</span>
          </div>
          <div className={`${styles.toggle} ${settings[option.key] ? styles.active : ''}`}>
            {settings[option.key] && <Check size={14} />}
          </div>
        </button>
      ))}
    </div>
  );
}

function AutomationSettings() {
  const [automations, setAutomations] = useState(AUTOMATIONS);

  const toggleAutomation = (id) => {
    setAutomations(automations.map((a) =>
      a.id === id ? { ...a, enabled: !a.enabled } : a
    ));
  };

  return (
    <div className={styles.settingsForm}>
      <p className={styles.settingsDesc}>
        Enable smart automations to help your business run smoother
      </p>

      {automations.map((automation) => (
        <button
          key={automation.id}
          className={styles.toggleItem}
          onClick={() => toggleAutomation(automation.id)}
        >
          <div className={styles.toggleInfo}>
            <span>{automation.name}</span>
            <span className={styles.toggleDesc}>{automation.description}</span>
          </div>
          <div className={`${styles.toggle} ${automation.enabled ? styles.active : ''}`}>
            {automation.enabled && <Check size={14} />}
          </div>
        </button>
      ))}
    </div>
  );
}

function PricingLibrarySettings() {
  const [items, setItems] = useState(PRICING_ITEMS);
  const [newItem, setNewItem] = useState({ name: '', category: 'materials', unitCost: '', unit: 'each' });
  const [showAdd, setShowAdd] = useState(false);
  const [markup, setMarkup] = useState(DEFAULT_MARKUP);
  const [editingItem, setEditingItem] = useState(null);

  const addItem = () => {
    if (newItem.name && newItem.unitCost) {
      setItems([...items, { ...newItem, id: `cust-${Date.now()}`, unitCost: parseFloat(newItem.unitCost) }]);
      setNewItem({ name: '', category: 'materials', unitCost: '', unit: 'each' });
      setShowAdd(false);
    }
  };

  const updateItem = () => {
    if (editingItem && editingItem.name && editingItem.unitCost) {
      setItems(items.map((i) => (i.id === editingItem.id ? { ...editingItem, unitCost: parseFloat(editingItem.unitCost) } : i)));
      setEditingItem(null);
    }
  };

  const deleteItem = (id) => {
    setItems(items.filter((i) => i.id !== id));
  };

  const categories = ['materials', 'labor', 'equipment', 'other'];

  return (
    <div className={styles.settingsForm}>
      <p className={styles.settingsDesc}>
        Manage your pricing items and default markup for estimates
      </p>

      <div className={styles.markupSection}>
        <label className={styles.label}>Default Markup %</label>
        <div className={styles.markupInput}>
          <input
            type="number"
            value={markup}
            onChange={(e) => setMarkup(parseInt(e.target.value) || 0)}
            className={styles.input}
          />
          <span className={styles.markupApplied}>Applied: {markup}%</span>
        </div>
      </div>

      {showAdd && (
        <div className={styles.addItemForm}>
          <input
            className={styles.input}
            placeholder="Item name"
            value={newItem.name}
            onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
          />
          <select
            className={styles.select}
            value={newItem.category}
            onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
          >
            {categories.map((c) => (
              <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>
            ))}
          </select>
          <input
            className={styles.input}
            type="number"
            placeholder="Cost"
            value={newItem.unitCost}
            onChange={(e) => setNewItem({ ...newItem, unitCost: e.target.value })}
          />
          <input
            className={styles.input}
            placeholder="Unit (e.g., sq ft, hr)"
            value={newItem.unit}
            onChange={(e) => setNewItem({ ...newItem, unit: e.target.value })}
          />
          <div className={styles.addItemActions}>
            <button className={styles.cancelBtn} onClick={() => setShowAdd(false)}>Cancel</button>
            <button className={styles.saveBtn} onClick={addItem}>Add</button>
          </div>
        </div>
      )}

      {!showAdd && (
        <button className={styles.addBtn} onClick={() => setShowAdd(true)}>
          <Plus size={16} /> Add Item
        </button>
      )}

      {categories.map((cat) => (
        <div key={cat} className={styles.catSection}>
          <h4 className={styles.catTitle}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</h4>
          <div className={styles.catItems}>
            {items.filter((i) => i.category === cat).map((item) => (
              <div key={item.id} className={styles.priceItem}>
                {editingItem?.id === item.id ? (
                  <div className={styles.editItemForm}>
                    <input
                      className={styles.input}
                      value={editingItem.name}
                      onChange={(e) => setEditingItem({ ...editingItem, name: e.target.value })}
                    />
                    <input
                      className={styles.input}
                      type="number"
                      value={editingItem.unitCost}
                      onChange={(e) => setEditingItem({ ...editingItem, unitCost: e.target.value })}
                    />
                    <input
                      className={styles.input}
                      value={editingItem.unit}
                      onChange={(e) => setEditingItem({ ...editingItem, unit: e.target.value })}
                    />
                    <div className={styles.editActions}>
                      <button onClick={() => setEditingItem(null)}>Cancel</button>
                      <button onClick={updateItem}>Save</button>
                    </div>
                  </div>
                ) : (
                  <>
                    <span className={styles.priceItemName}>{item.name}</span>
                    <span className={styles.priceItemCost}>
                      ${item.unitCost}/{item.unit}
                      <span className={styles.priceWithMarkup}>→ ${Math.round(item.unitCost * (1 + markup/100))}/{item.unit}</span>
                    </span>
                    <div className={styles.itemActions}>
                      <button className={styles.editBtn} onClick={() => setEditingItem(item)}>
                        <Edit size={14} />
                      </button>
                      <button className={styles.deleteBtn} onClick={() => deleteItem(item.id)}>
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}