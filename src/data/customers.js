export const initialCustomers = [
  {
    id: '1',
    name: 'Mike Williams',
    email: 'mike.w@email.com',
    phone: '(555) 345-6789',
    address: '789 Pine Road, Springfield, IL 62703',
    notes: 'Excellent customer. Pays on time. Referral source.',
    createdAt: '2024-04-19',
    jobs: [
      {
        id: '1',
        project: 'Deck Project',
        status: 'in_progress',
        amount: 8400,
        startDate: '2024-05-01',
        endDate: '2024-05-15',
      },
    ],
    estimates: [
      { id: 'est-001', project: 'Deck', amount: 8400, status: 'accepted', date: '2024-04-05' },
    ],
    invoices: [
      { id: 'inv-001', amount: 4200, status: 'paid', date: '2024-04-25' },
    ],
    totalRevenue: 4200,
  },
  {
    id: '2',
    name: 'Sarah Construction LLC',
    email: 'contact@sarahconstr.com',
    phone: '(555) 999-8888',
    address: '100 Commercial Dr, Springfield, IL 62708',
    company: true,
    notes: 'Commercial partner. Multiple projects.',
    createdAt: '2023-06-15',
    jobs: [
      { id: '2', project: 'Office Reno', status: 'completed', amount: 45200, startDate: '2024-01-10', endDate: '2024-02-28' },
      { id: '3', project: 'Warehouse Update', status: 'in_progress', amount: 18500, startDate: '2024-04-10', endDate: '2024-05-01' },
    ],
    estimates: [],
    invoices: [
      { id: 'inv-010', amount: 22500, status: 'paid', date: '2024-02-28' },
    ],
    totalRevenue: 41000,
  },
  {
    id: '3',
    name: 'Emily Davis',
    email: 'emily.d@email.com',
    phone: '(555) 567-8901',
    address: '321 Cedar Lane, Springfield, IL 62704',
    notes: 'First job starting soon.',
    createdAt: '2024-04-20',
    jobs: [],
    estimates: [
      { id: 'est-005', project: 'Full Renovation', amount: 89000, status: 'sent', date: '2024-04-22' },
    ],
    invoices: [],
    totalRevenue: 0,
  },
  {
    id: '4',
    name: 'John Peterson',
    email: 'jpeterson@email.com',
    phone: '(555) 111-2222',
    address: '444 Maple Street, Springfield, IL 62709',
    notes: 'Repeat customer. Prefers email communication.',
    createdAt: '2023-08-10',
    jobs: [
      { id: '4', project: 'Bathroom Remodel', status: 'completed', amount: 12800, startDate: '2023-09-01', endDate: '2023-10-15' },
    ],
    estimates: [],
    invoices: [
      { id: 'inv-015', amount: 12800, status: 'paid', date: '2023-10-20' },
    ],
    totalRevenue: 12800,
  },
];