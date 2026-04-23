export const COMPANY_INFO = {
  name: 'Contractors CRM',
  owner: 'Allen\'s Construction',
  email: 'allen@contractorscrm.com',
  phone: '(555) 123-4567',
  address: '123 Main Street, Springfield, IL 62701',
  website: 'www.contractorscrm.com',
};

export const BRANDING = {
  accentColor: '#F59E0B',
  logo: null,
};

export const NOTIFICATION_SETTINGS = {
  leadFollowUp: true,
  estimateReminders: true,
  invoiceReminders: true,
  jobTasks: true,
  weeklyDigest: false,
  marketingEmails: false,
};

export const AUTOMATIONS = [
  {
    id: 'lead-followup',
    name: 'Lead Follow-up Reminder',
    description: 'Remind to follow up on new leads after 3 days',
    trigger: 'lead.created',
    action: 'reminder',
    enabled: true,
  },
  {
    id: 'estimate-followup',
    name: 'Estimate Follow-up',
    description: 'Follow up after estimate sent - 5 days',
    trigger: 'estimate.sent',
    action: 'reminder',
    enabled: true,
  },
  {
    id: 'invoice-overdue',
    name: 'Invoice Overdue Alert',
    description: 'Alert when invoice is 15 days overdue',
    trigger: 'invoice.overdue',
    action: 'notification',
    enabled: true,
  },
  {
    id: 'job-checkin',
    name: 'Job Check-in',
    description: 'Weekly check-in on active jobs',
    trigger: 'job.in_progress',
    action: 'reminder',
    enabled: false,
  },
];

export const SMART_INSIGHTS = [
  {
    id: 'estimate-stale',
    type: 'warning',
    title: 'Follow up needed',
    message: 'You have 3 estimates sent over 5 days ago without follow-up',
    action: { page: 'estimates', filter: 'sent' },
  },
  {
    id: 'margin-tight',
    type: 'warning',
    title: 'Monitor margins',
    message: '2 active jobs have margins below 20%',
    action: { page: 'jobs' },
  },
  {
    id: 'invoice-overdue',
    type: 'error',
    title: 'Overdue invoices',
    message: 'You have $500 in overdue invoices',
    action: { page: 'invoices', filter: 'overdue' },
  },
  {
    id: 'lead-hot',
    type: 'success',
    title: 'High-value lead',
    message: 'Emily Davis - Full Renovation ($89K potential)',
    action: { page: 'leads' },
  },
];

export const ESTIMATE_SUGGESTIONS = {
  'Kitchen Remodel': [
    'Cabinetry installation',
    'Countertop templating',
    'Sink/faucet install',
    'Backsplash tile',
    'Appliance hookup',
  ],
  'Bathroom Remodel': [
    'Demo and haul-away',
    'Plumbing rough-in',
    'Tile floor install',
    'Vanity installation',
    'Shower glass install',
  ],
  'Deck': [
    'Deck framing',
    'Decking installation',
    'Railing install',
    'Stairs',
    'Sealer/stain',
  ],
  'Flooring': [
    'Floor prep',
    'Hardwood/LVP installation',
    'Base trim install',
    'Transition pieces',
  ],
  'Roofing': [
    'Roof tear-off',
    'Shingle installation',
    'Flashing',
    'Gutter installation',
  ],
  'Painting': [
    'Prep and patching',
    'Interior walls',
    'Interior trim',
    'Exterior paint',
  ],
};

export const PRICING_ITEMS = [
  { id: 'mat-1', name: 'Cabinetry', category: 'materials', unitCost: 500, unit: 'linear ft' },
  { id: 'mat-2', name: 'Quartz Countertop', category: 'materials', unitCost: 80, unit: 'sq ft' },
  { id: 'mat-3', name: 'Tile - Floor', category: 'materials', unitCost: 8, unit: 'sq ft' },
  { id: 'mat-4', name: 'Tile - Backsplash', category: 'materials', unitCost: 12, unit: 'sq ft' },
  { id: 'mat-5', name: 'Hardwood Flooring', category: 'materials', unitCost: 10, unit: 'sq ft' },
  { id: 'mat-6', name: 'LVP Flooring', category: 'materials', unitCost: 6, unit: 'sq ft' },
  { id: 'mat-7', name: 'Deck Composite', category: 'materials', unitCost: 18, unit: 'sq ft' },
  { id: 'mat-8', name: 'Shingle', category: 'materials', unitCost: 4, unit: 'sq ft' },
  { id: 'lab-1', name: 'Demo Labor', category: 'labor', unitCost: 45, unit: 'hr' },
  { id: 'lab-2', name: 'Carpentry Labor', category: 'labor', unitCost: 65, unit: 'hr' },
  { id: 'lab-3', name: 'Electrical Labor', category: 'labor', unitCost: 75, unit: 'hr' },
  { id: 'lab-4', name: 'Plumbing Labor', category: 'labor', unitCost: 75, unit: 'hr' },
  { id: 'lab-5', name: 'HVAC Labor', category: 'labor', unitCost: 70, unit: 'hr' },
  { id: 'lab-6', name: 'Drywall/Paint Labor', category: 'labor', unitCost: 40, unit: 'hr' },
  { id: 'lab-7', name: 'Tile Labor', category: 'labor', unitCost: 50, unit: 'sq ft' },
  { id: 'lab-8', name: 'Flooring Labor', category: 'labor', unitCost: 3, unit: 'sq ft' },
  { id: 'eq-1', name: 'Dumpster', category: 'equipment', unitCost: 350, unit: 'each' },
  { id: 'eq-2', name: 'Scaffold', category: 'equipment', unitCost: 150, unit: 'day' },
  { id: 'eq-3', name: 'Power Washer', category: 'equipment', unitCost: 75, unit: 'day' },
  { id: 'eq-4', name: 'Generator', category: 'equipment', unitCost: 65, unit: 'day' },
  { id: 'oth-1', name: 'Permit', category: 'other', unitCost: 500, unit: 'each' },
  { id: 'oth-2', name: 'Inspection', category: 'other', unitCost: 125, unit: 'each' },
  { id: 'oth-3', name: 'Haul Away', category: 'other', unitCost: 200, unit: 'each' },
  { id: 'oth-4', name: 'Dump Fee', category: 'other', unitCost: 75, unit: 'ton' },
];