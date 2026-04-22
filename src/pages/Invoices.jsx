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
  AlertCircle,
  Receipt,
  Printer,
  Send,
  Wallet,
  CreditCard,
} from 'lucide-react';
import { PageHeader } from '../components/TopHeader';
import Card from '../components/Card';
import Button from '../components/Button';
import Input from '../components/Input';
import Badge from '../components/Badge';
import FilterChips from '../components/FilterChips';
import Drawer from '../components/Drawer';
import { useCRM } from '../context/CRMContext';
import { initialJobs } from '../data/jobs';
import { INVOICE_STATUSES, initialInvoices } from '../data/invoices';
import styles from './Invoices.module.css';

const statusFilters = [
  { value: 'all', label: 'All', count: 0 },
  { value: 'draft', label: 'Draft', count: 0 },
  { value: 'sent', label: 'Sent', count: 0 },
  { value: 'paid', label: 'Paid', count: 0 },
  { value: 'partial', label: 'Partial', count: 0 },
  { value: 'overdue', label: 'Overdue', count: 0 },
];

export default function Invoices() {
  const navigate = useNavigate();
  const { customers } = useCRM();
  const [invoices, setInvoices] = useState(initialInvoices);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [showBuilder, setShowBuilder] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [showPayment, setShowPayment] = useState(null);

  const filteredInvoices = invoices.filter((inv) => {
    const matchesSearch =
      !search ||
      inv.customerName.toLowerCase().includes(search.toLowerCase()) ||
      inv.id.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === 'all' || inv.status === filter;
    return matchesSearch && matchesFilter;
  });

  const getCounts = () => {
    const counts = { all: invoices.length };
    INVOICE_STATUSES.forEach((s) => {
      counts[s.id] = invoices.filter((i) => i.status === s.id).length;
    });
    return counts;
  };

  const getStatusInfo = (status) => INVOICE_STATUSES.find((s) => s.id === status) || { label: status, color: 'default' };

  const totalOutstanding = invoices
    .filter((i) => i.status !== 'paid')
    .reduce((sum, i) => sum + (i.total - i.paid), 0);

  const totalCollected = invoices.reduce((sum, i) => sum + i.paid, 0);

  const counts = getCounts();
  const options = statusFilters.map((o) => ({ ...o, count: counts[o.value] || 0 }));

  const updateInvoiceStatus = (id, status) => {
    setInvoices((prev) =>
      prev.map((i) => (i.id === id ? { ...i, status } : i))
    );
  };

  const addPayment = (invoiceId, amount, method) => {
    setInvoices((prev) =>
      prev.map((i) => {
        if (i.id !== invoiceId) return i;
        const newPaid = i.paid + amount;
        let newStatus = 'sent';
        if (newPaid >= i.total) newStatus = 'paid';
        else if (newPaid > 0) newStatus = 'partial';
        return {
          ...i,
          paid: newPaid,
          status: newStatus,
          payments: [...(i.payments || []), { date: new Date().toISOString().split('T')[0], amount, method }],
        };
      })
    );
  };

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <PageHeader title="Invoices" subtitle={`${invoices.length} invoices`}>
          <Button icon={Plus} onClick={() => setShowBuilder(true)}>
            New Invoice
          </Button>
        </PageHeader>

        <div className={styles.search}>
          <Input
            icon={Search}
            placeholder="Search invoices..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <FilterChips options={options} value={filter} onChange={setFilter} />

        <div className={styles.stats}>
          <div className={styles.statCard}>
            <span className={styles.statLabel}>Outstanding</span>
            <span className={styles.statValue}>${totalOutstanding.toLocaleString()}</span>
          </div>
          <div className={styles.statCard}>
            <span className={styles.statLabel}>Collected</span>
            <span className={styles.statValue} style={{ color: 'var(--status-success)' }}>
              ${totalCollected.toLocaleString()}
            </span>
          </div>
        </div>

        <div className={styles.list}>
          {filteredInvoices.map((invoice, i) => (
            <motion.div
              key={invoice.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Card
                className={styles.invoiceCard}
                onClick={() => setSelectedInvoice(invoice)}
              >
                <div className={styles.invoiceHeader}>
                  <div className={styles.invoiceInfo}>
                    <h3 className={styles.invoiceId}>{invoice.id}</h3>
                    <p className={styles.invoiceCustomer}>{invoice.customerName}</p>
                  </div>
                  <Badge variant={getStatusInfo(invoice.status).color}>
                    {getStatusInfo(invoice.status).label}
                  </Badge>
                </div>

                <div className={styles.invoiceAmount}>
                  <div className={styles.amountRow}>
                    <span>Total</span>
                    <span className={styles.amountValue}>${invoice.total.toLocaleString()}</span>
                  </div>
                  {invoice.paid > 0 && (
                    <div className={styles.amountRow}>
                      <span>Paid</span>
                      <span className={styles.paidValue}>${invoice.paid.toLocaleString()}</span>
                    </div>
                  )}
                  {invoice.total - invoice.paid > 0 && (
                    <div className={styles.amountRow}>
                      <span>Balance</span>
                      <span className={styles.balanceValue}>
                        ${(invoice.total - invoice.paid).toLocaleString()}
                      </span>
                    </div>
                  )}
                </div>

                <div className={styles.invoiceMeta}>
                  <span>Due: {invoice.dueDate || 'N/A'}</span>
                  {invoice.jobName && <span>Job: {invoice.jobName}</span>}
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      <Drawer isOpen={showBuilder} onClose={() => setShowBuilder(false)} title="Create Invoice">
        <InvoiceBuilder
          jobs={initialJobs}
          customers={customers}
          onClose={() => setShowBuilder(false)}
          onSave={(invoice) => {
            setInvoices((prev) => [{ ...invoice, id: `inv-${Date.now()}` }, ...prev]);
            setShowBuilder(false);
          }}
        />
      </Drawer>

      <Drawer
        isOpen={!!selectedInvoice}
        onClose={() => {
          setSelectedInvoice(null);
          setShowPayment(null);
        }}
        title={selectedInvoice?.id}
      >
        {selectedInvoice && (
          <InvoiceDetail
            invoice={selectedInvoice}
            onStatusChange={(status) => {
              updateInvoiceStatus(selectedInvoice.id, status);
              setSelectedInvoice({ ...selectedInvoice, status });
            }}
            onAddPayment={(amount, method) => {
              addPayment(selectedInvoice.id, amount, method);
              setSelectedInvoice({
                ...selectedInvoice,
                paid: selectedInvoice.paid + amount,
                payments: [
                  ...(selectedInvoice.payments || []),
                  { date: new Date().toISOString().split('T')[0], amount, method },
                ],
              });
              setShowPayment(false);
            }}
            showPayment={showPayment}
            setShowPayment={setShowPayment}
          />
        )}
      </Drawer>
    </div>
  );
}

function InvoiceBuilder({ jobs, customers, onClose, onSave }) {
  const [form, setForm] = useState({
    jobId: '',
    jobName: '',
    customerId: '',
    customerName: '',
    customerEmail: '',
    customerAddress: '',
    items: [{ description: '', amount: '' }],
    subtotal: 0,
    tax: 0,
    total: 0,
    terms: 'Net 30',
    notes: '',
    dueDate: '',
    status: 'draft',
    paid: 0,
    payments: [],
  });

  const handleJobSelect = (jobId) => {
    const job = jobs.find((j) => j.id === jobId);
    if (job) {
      const customer = customers.find((c) => c.id === job.customerId);
      setForm({
        ...form,
        jobId,
        jobName: job.project,
        customerId: job.customerId,
        customerName: job.customerName,
        customerAddress: '123 Main St, Springfield, IL 62701',
        dueDate: job.endDate,
      });
    }
  };

  const updateItem = (index, field, value) => {
    const newItems = [...form.items];
    newItems[index][field] = value;
    if (field === 'amount') {
      const amt = parseFloat(value) || 0;
      newItems[index].amount = amt;
      const subtotal = newItems.reduce((sum, item) => sum + (parseFloat(item.amount) || 0), 0);
      setForm({ ...form, items: newItems, subtotal, total: subtotal + form.tax });
    } else {
      setForm({ ...form, items: newItems });
    }
  };

  const addItem = () => {
    setForm({ ...form, items: [...form.items, { description: '', amount: '' }] });
  };

  const handleSave = () => {
    if (form.customerName && form.items.some((i) => i.amount)) {
      onSave({
        ...form,
        subtotal: form.items.reduce((sum, i) => sum + (parseFloat(i.amount) || 0), 0),
        total: form.items.reduce((sum, i) => sum + (parseFloat(i.amount) || 0), 0) + form.tax,
      });
    }
  };

  return (
    <div className={styles.builder}>
      <div className={styles.builderSection}>
        <h4 className={styles.sectionTitle}>Link to Job (Optional)</h4>
        <select
          className={styles.select}
          value={form.jobId}
          onChange={(e) => handleJobSelect(e.target.value)}
        >
          <option value="">Create new invoice</option>
          {jobs.filter((j) => j.status === 'in_progress' || j.status === 'completed').map((job) => (
            <option key={job.id} value={job.id}>
              {job.project} - {job.customerName}
            </option>
          ))}
        </select>
      </div>

      <div className={styles.builderSection}>
        <h4 className={styles.sectionTitle}>Customer</h4>
        <input
          className={styles.input}
          value={form.customerName}
          onChange={(e) => setForm({ ...form, customerName: e.target.value })}
          placeholder="Customer name"
        />
      </div>

      <div className={styles.builderRow}>
        <input
          className={styles.input}
          value={form.customerEmail}
          onChange={(e) => setForm({ ...form, customerEmail: e.target.value })}
          placeholder="Email"
        />
        <input
          type="date"
          className={styles.input}
          value={form.dueDate}
          onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
          placeholder="Due date"
        />
      </div>

      <div className={styles.builderSection}>
        <h4 className={styles.sectionTitle}>Line Items</h4>
        {form.items.map((item, i) => (
          <div key={i} className={styles.lineItem}>
            <input
              className={styles.itemDesc}
              value={item.description}
              onChange={(e) => updateItem(i, 'description', e.target.value)}
              placeholder="Description"
            />
            <input
              type="number"
              className={styles.itemAmount}
              value={item.amount}
              onChange={(e) => updateItem(i, 'amount', e.target.value)}
              placeholder="$"
            />
          </div>
        ))}
        <button className={styles.addItemBtn} onClick={addItem}>
          <Plus size={16} /> Add Line Item
        </button>
      </div>

      <div className={styles.totals}>
        <div className={styles.totalRow}>
          <span>Subtotal</span>
          <span>
            ${form.items.reduce((sum, i) => sum + (parseFloat(i.amount) || 0), 0).toLocaleString()}
          </span>
        </div>
        <div className={styles.totalRow}>
          <span>Tax</span>
          <input
            type="number"
            value={form.tax}
            onChange={(e) => setForm({ ...form, tax: parseFloat(e.target.value) || 0, total: form.items.reduce((sum, i) => sum + (parseFloat(i.amount) || 0), 0) + (parseFloat(e.target.value) || 0) })}
            className={styles.taxInput}
          />
        </div>
        <div className={styles.totalRow}>
          <span>Total</span>
          <span className={styles.totalAmount}>
            $
            {(
              form.items.reduce((sum, i) => sum + (parseFloat(i.amount) || 0), 0) +
              (parseFloat(form.tax) || 0)
            ).toLocaleString()}
          </span>
        </div>
      </div>

      <div className={styles.builderSection}>
        <h4 className={styles.sectionTitle}>Payment Terms</h4>
        <select
          className={styles.select}
          value={form.terms}
          onChange={(e) => setForm({ ...form, terms: e.target.value })}
        >
          <option value="Due on receipt">Due on receipt</option>
          <option value="Net 15">Net 15</option>
          <option value="Net 30">Net 30</option>
          <option value="Net 45">Net 45</option>
        </select>
      </div>

      <div className={styles.builderSection}>
        <h4 className={styles.sectionTitle}>Notes</h4>
        <textarea
          className={styles.textarea}
          value={form.notes}
          onChange={(e) => setForm({ ...form, notes: e.target.value })}
          placeholder="Invoice notes..."
          rows={3}
        />
      </div>

      <div className={styles.builderActions}>
        <Button variant="ghost" onClick={onClose}>
          Cancel
        </Button>
        <Button onClick={handleSave}>Create Invoice</Button>
      </div>
    </div>
  );
}

function InvoiceDetail({ invoice, onStatusChange, onAddPayment, showPayment, setShowPayment }) {
  const [paymentAmount, setPaymentAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('Check');

  const getStatusInfo = (status) => INVOICE_STATUSES.find((s) => s.id === status) || { label: status, color: 'default' };

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Invoice ${invoice.id}</title>
        <style>
          * { box-sizing: border-box; margin: 0; padding: 0; }
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; padding: 40px; max-width: 800px; margin: 0 auto; color: #1a1a1a; }
          .header { display: flex; justify-content: space-between; margin-bottom: 40px; }
          .logo { font-size: 24px; font-weight: 700; color: #F59E0B; }
          .invoice-info { text-align: right; }
          .invoice-number { font-size: 18px; font-weight: 600; margin-bottom: 4px; }
          .invoice-date { color: #71717A; font-size: 14px; }
          .customer { margin-bottom: 40px; }
          .customer-name { font-size: 18px; font-weight: 600; margin-bottom: 4px; }
          .customer-info { color: #71717A; font-size: 14px; }
          table { width: 100%; border-collapse: collapse; margin-bottom: 40px; }
          th { text-align: left; padding: 12px 0; border-bottom: 2px solid #e5e5e5; color: #71717A; font-size: 12px; text-transform: uppercase; }
          td { padding: 16px 0; border-bottom: 1px solid #e5e5e5; }
          td:last-child { text-align: right; }
          .totals { display: flex; justify-content: flex-end; }
          .totals-table { width: 200px; }
          .totals-row { display: flex; justify-content: space-between; padding: 8px 0; }
          .totals-row.total { font-size: 18px; font-weight: 700; border-top: 2px solid #1a1a1a; margin-top: 8px; padding-top: 16px; }
          .payment-info { margin-top: 40px; padding: 20px; background: #f9fafb; border-radius: 8px; }
          .payment-header { font-weight: 600; margin-bottom: 12px; }
          .terms { margin-top: 40px; color: #71717A; font-size: 14px; }
          .footer { margin-top: 60px; text-align: center; color: #71717A; font-size: 12px; }
          @media print { body { padding: 20px; } }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="logo">Contractors CRM</div>
          <div class="invoice-info">
            <div class="invoice-number">Invoice ${invoice.id}</div>
            <div class="invoice-date">Date: ${invoice.createdAt}</div>
          </div>
        </div>
        <div class="customer">
          <div class="customer-name">${invoice.customerName}</div>
          <div class="customer-info">${invoice.customerEmail}</div>
          <div class="customer-info">${invoice.customerAddress}</div>
        </div>
        <table>
          <thead><tr><th>Description</th><th>Amount</th></tr></thead>
          <tbody>
            ${invoice.items.map((item) => `
              <tr><td>${item.description}</td><td>$${item.amount.toLocaleString()}</td></tr>
            `).join('')}
          </tbody>
        </table>
        <div class="totals">
          <div class="totals-table">
            <div class="totals-row"><span>Subtotal</span><span>$${invoice.subtotal.toLocaleString()}</span></div>
            ${invoice.tax > 0 ? `<div class="totals-row"><span>Tax</span><span>$${invoice.tax.toLocaleString()}</span></div>` : ''}
            <div class="totals-row total"><span>Total</span><span>$${invoice.total.toLocaleString()}</span></div>
            ${invoice.paid > 0 ? `<div class="totals-row"><span>Paid</span><span>$${invoice.paid.toLocaleString()}</span></div>` : ''}
            ${invoice.total - invoice.paid > 0 ? `<div class="totals-row"><span>Balance Due</span><span>$${(invoice.total - invoice.paid).toLocaleString()}</span></div>` : ''}
          </div>
        </div>
        ${invoice.notes ? `<div class="terms"><strong>Notes:</strong> ${invoice.notes}</div>` : ''}
        <div class="terms"><strong>Payment Terms:</strong> ${invoice.terms}</div>
        <div class="footer">Thank you for your business!</div>
      </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  return (
    <div className={styles.detail}>
      <div className={styles.detailHeader}>
        <Badge variant={getStatusInfo(invoice.status).color}>{getStatusInfo(invoice.status).label}</Badge>
      </div>

      <div className={styles.detailSection}>
        <h4 className={styles.sectionTitle}>Customer</h4>
        <p>{invoice.customerName}</p>
        <p className={styles.muted}>{invoice.customerEmail}</p>
        <p className={styles.muted}>{invoice.customerAddress}</p>
      </div>

      <div className={styles.detailSection}>
        <h4 className={styles.sectionTitle}>Items</h4>
        {invoice.items.map((item, i) => (
          <div key={i} className={styles.lineItemRow}>
            <span>{item.description}</span>
            <span>${item.amount.toLocaleString()}</span>
          </div>
        ))}
      </div>

      <div className={styles.detailTotals}>
        <div className={styles.totalRow}>
          <span>Subtotal</span>
          <span>${invoice.subtotal.toLocaleString()}</span>
        </div>
        {invoice.tax > 0 && (
          <div className={styles.totalRow}>
            <span>Tax</span>
            <span>${invoice.tax.toLocaleString()}</span>
          </div>
        )}
        <div className={styles.totalRow}>
          <span>Total</span>
          <span className={styles.totalAmount}>${invoice.total.toLocaleString()}</span>
        </div>
        {invoice.paid > 0 && (
          <div className={styles.totalRow}>
            <span>Paid</span>
            <span className={styles.paidAmount}>-${invoice.paid.toLocaleString()}</span>
          </div>
        )}
        {invoice.total - invoice.paid > 0 && (
          <div className={styles.totalRow}>
            <span>Balance</span>
            <span className={styles.balanceAmount}>
              ${(invoice.total - invoice.paid).toLocaleString()}
            </span>
          </div>
        )}
      </div>

      {invoice.payments && invoice.payments.length > 0 && (
        <div className={styles.detailSection}>
          <h4 className={styles.sectionTitle}>Payments</h4>
          {invoice.payments.map((payment, i) => (
            <div key={i} className={styles.paymentRow}>
              <span>{payment.date}</span>
              <span>${payment.amount.toLocaleString()}</span>
              <span className={styles.muted}>{payment.method}</span>
            </div>
          ))}
        </div>
      )}

      <div className={styles.detailActions}>
        <Button variant="secondary" fullWidth onClick={handlePrint}>
          <Printer size={16} /> Print / PDF
        </Button>
        {invoice.status !== 'paid' && (
          <Button
            variant="ghost"
            fullWidth
            onClick={() => setShowPayment(true)}
          >
            <Wallet size={16} /> Record Payment
          </Button>
        )}
      </div>

      {showPayment && (
        <div className={styles.paymentForm}>
          <h4 className={styles.sectionTitle}>Record Payment</h4>
          <input
            type="number"
            className={styles.input}
            value={paymentAmount}
            onChange={(e) => setPaymentAmount(e.target.value)}
            placeholder="Amount"
          />
          <select
            className={styles.select}
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
          >
            <option value="Check">Check</option>
            <option value="Card">Card</option>
            <option value="Cash">Cash</option>
            <option value="Transfer">Bank Transfer</option>
          </select>
          <div className={styles.paymentActions}>
            <Button variant="ghost" onClick={() => setShowPayment(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                onAddPayment(parseFloat(paymentAmount), paymentMethod);
                setPaymentAmount('');
              }}
            >
              Record
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}