import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Search,
  Phone,
  Mail,
  MessageSquare,
  MapPin,
  Calendar,
  DollarSign,
  Briefcase,
  FileText,
  Clock,
  Users,
  ChevronRight,
  TrendingUp,
} from 'lucide-react';
import { PageHeader } from '../components/TopHeader';
import Card from '../components/Card';
import Button from '../components/Button';
import Input from '../components/Input';
import Badge from '../components/Badge';
import Drawer from '../components/Drawer';
import { useCRM } from '../context/CRMContext';
import styles from './Customers.module.css';

export default function Customers() {
  const { customers, getCustomer } = useCRM();
  const [search, setSearch] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  const filteredCustomers = customers.filter(
    (c) =>
      !search ||
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.phone.includes(search) ||
      c.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <PageHeader title="Customers" subtitle={`${customers.length} customers`} />

        <div className={styles.search}>
          <Input
            icon={Search}
            placeholder="Search customers..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className={styles.stats}>
          <div className={styles.statCard}>
            <span className={styles.statLabel}>Total Revenue</span>
            <span className={styles.statValue}>
              $
              {customers
                .reduce((sum, c) => sum + (c.totalRevenue || 0), 0)
                .toLocaleString()}
            </span>
          </div>
          <div className={styles.statCard}>
            <span className={styles.statLabel}>Active Jobs</span>
            <span className={styles.statValue}>
              {customers.reduce((sum, c) => sum + c.jobs.filter((j) => j.status === 'in_progress').length, 0)}
            </span>
          </div>
        </div>

        <div className={styles.list}>
          {filteredCustomers.map((customer, i) => (
            <motion.div
              key={customer.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Card
                className={styles.customerCard}
                onClick={() => setSelectedCustomer(customer)}
              >
                <div className={styles.customerHeader}>
                  <div className={styles.customerAvatar}>
                    <Users size={20} />
                  </div>
                  <div className={styles.customerInfo}>
                    <h3 className={styles.customerName}>{customer.name}</h3>
                    <p className={styles.customerSince}>
                      Customer since{' '}
                      {new Date(customer.createdAt).toLocaleDateString('en-US', {
                        month: 'short',
                        year: 'numeric',
                      })}
                    </p>
                  </div>
                  <ChevronRight size={20} className={styles.chevron} />
                </div>

                <div className={styles.customerStats}>
                  <div className={styles.cStat}>
                    <DollarSign size={14} />
                    <span>${(customer.totalRevenue || 0).toLocaleString()}</span>
                  </div>
                  <div className={styles.cStat}>
                    <Briefcase size={14} />
                    <span>{customer.jobs.length} jobs</span>
                  </div>
                </div>

                <div className={styles.quickActions}>
                  <a href={`tel:${customer.phone}`} className={styles.actionBtn}>
                    <Phone size={16} />
                  </a>
                  <a href={`sms:${customer.phone}`} className={styles.actionBtn}>
                    <MessageSquare size={16} />
                  </a>
                  <a href={`mailto:${customer.email}`} className={styles.actionBtn}>
                    <Mail size={16} />
                  </a>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      <Drawer
        isOpen={!!selectedCustomer}
        onClose={() => setSelectedCustomer(null)}
        title={selectedCustomer?.name}
      >
        {selectedCustomer && <CustomerDetail customer={selectedCustomer} />}
      </Drawer>
    </div>
  );
}

function CustomerDetail({ customer }) {
  return (
    <div className={styles.detail}>
      <div className={styles.detailStats}>
        <div className={styles.detailStat}>
          <span className={styles.detailStatLabel}>Total Revenue</span>
          <span className={styles.detailStatValue}>
            ${(customer.totalRevenue || 0).toLocaleString()}
          </span>
        </div>
        <div className={styles.detailStat}>
          <span className={styles.detailStatLabel}>Jobs</span>
          <span className={styles.detailStatValue}>{customer.jobs.length}</span>
        </div>
        <div className={styles.detailStat}>
          <span className={styles.detailStatLabel}>Estimates</span>
          <span className={styles.detailStatValue}>{customer.estimates.length}</span>
        </div>
      </div>

      <div className={styles.quickActions}>
        <a href={`tel:${customer.phone}`} className={styles.quickAction}>
          <Phone size={20} />
          <span>Call</span>
        </a>
        <a href={`sms:${customer.phone}`} className={styles.quickAction}>
          <MessageSquare size={20} />
          <span>Text</span>
        </a>
        <a href={`mailto:${customer.email}`} className={styles.quickAction}>
          <Mail size={20} />
          <span>Email</span>
        </a>
      </div>

      <div className={styles.detailSection}>
        <h4 className={styles.sectionTitle}>Contact Info</h4>
        <div className={styles.detailRow}>
          <Phone size={16} />
          <span>{customer.phone}</span>
        </div>
        <div className={styles.detailRow}>
          <Mail size={16} />
          <span>{customer.email}</span>
        </div>
        {customer.address && (
          <div className={styles.detailRow}>
            <MapPin size={16} />
            <span>{customer.address}</span>
          </div>
        )}
      </div>

      {customer.jobs.length > 0 && (
        <div className={styles.detailSection}>
          <h4 className={styles.sectionTitle}>Jobs</h4>
          <div className={styles.recordsList}>
            {customer.jobs.map((job) => (
              <div key={job.id} className={styles.record}>
                <div className={styles.recordInfo}>
                  <span className={styles.recordName}>{job.project}</span>
                  <span className={styles.recordMeta}>
                    ${job.amount.toLocaleString()} · {job.startDate}
                  </span>
                </div>
                <Badge
                  variant={job.status === 'completed' ? 'success' : job.status === 'in_progress' ? 'warning' : 'default'}
                  size="sm"
                >
                  {job.status.replace('_', ' ')}
                </Badge>
              </div>
            ))}
          </div>
        </div>
      )}

      {customer.estimates.length > 0 && (
        <div className={styles.detailSection}>
          <h4 className={styles.sectionTitle}>Estimates</h4>
          <div className={styles.recordsList}>
            {customer.estimates.map((est) => (
              <div key={est.id} className={styles.record}>
                <div className={styles.recordInfo}>
                  <span className={styles.recordName}>{est.project}</span>
                  <span className={styles.recordMeta}>
                    ${est.amount.toLocaleString()} · {est.date}
                  </span>
                </div>
                <Badge
                  variant={est.status === 'accepted' ? 'success' : est.status === 'sent' ? 'info' : 'default'}
                  size="sm"
                >
                  {est.status}
                </Badge>
              </div>
            ))}
          </div>
        </div>
      )}

      {customer.invoices.length > 0 && (
        <div className={styles.detailSection}>
          <h4 className={styles.sectionTitle}>Invoices</h4>
          <div className={styles.recordsList}>
            {customer.invoices.map((inv) => (
              <div key={inv.id} className={styles.record}>
                <div className={styles.recordInfo}>
                  <span className={styles.recordName}>{inv.id}</span>
                  <span className={styles.recordMeta}>
                    ${inv.amount.toLocaleString()} · {inv.date}
                  </span>
                </div>
                <Badge variant={inv.status === 'paid' ? 'success' : 'warning'} size="sm">
                  {inv.status}
                </Badge>
              </div>
            ))}
          </div>
        </div>
      )}

      {customer.notes && (
        <div className={styles.detailSection}>
          <h4 className={styles.sectionTitle}>Notes</h4>
          <p className={styles.notes}>{customer.notes}</p>
        </div>
      )}
    </div>
  );
}