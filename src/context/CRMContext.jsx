import { createContext, useContext, useState, useEffect } from 'react';
import { initialLeads } from '../data/leads';
import { initialCustomers } from '../data/customers';
import { initialEstimates } from '../data/estimates';

const CRMContext = createContext();

export function CRMProvider({ children }) {
  const [leads, setLeads] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [estimates, setEstimates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setLeads(initialLeads);
      setCustomers(initialCustomers);
      setEstimates(initialEstimates);
      setLoading(false);
    }, 300);
  }, []);

  const addLead = (lead) => {
    const newLead = {
      ...lead,
      id: Date.now().toString(),
      stage: 'new',
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
      activities: [{ id: '1', type: 'note', content: 'Lead created', date: new Date().toISOString().split('T')[0] }],
    };
    setLeads((prev) => [newLead, ...prev]);
    return newLead;
  };

  const updateLead = (id, updates) => {
    setLeads((prev) =>
      prev.map((lead) =>
        lead.id === id
          ? { ...lead, ...updates, updatedAt: new Date().toISOString().split('T')[0] }
          : lead
      )
    );
  };

  const updateLeadStage = (id, stage) => {
    setLeads((prev) =>
      prev.map((lead) =>
        lead.id === id
          ? {
              ...lead,
              stage,
              updatedAt: new Date().toISOString().split('T')[0],
              activities: [
                {
                  id: Date.now().toString(),
                  type: 'stage',
                  content: `Moved to ${stage}`,
                  date: new Date().toISOString().split('T')[0],
                },
                ...(lead.activities || []),
              ],
            }
          : lead
      )
    );
  };

  const addActivity = (leadId, activity) => {
    const newActivity = {
      ...activity,
      id: Date.now().toString(),
      date: new Date().toISOString().split('T')[0],
    };
    setLeads((prev) =>
      prev.map((lead) =>
        lead.id === leadId
          ? {
              ...lead,
              activities: [newActivity, ...(lead.activities || [])],
              updatedAt: new Date().toISOString().split('T')[0],
            }
          : lead
      )
    );
  };

  const getLeadsByStage = (stage) => leads.filter((l) => l.stage === stage);

  const getOverdueFollowUps = () => {
    const today = new Date().toISOString().split('T')[0];
    return leads.filter((l) => l.followUpDate && l.followUpDate < today && !['won', 'lost'].includes(l.stage));
  };

  const getTodaysFollowUps = () => {
    const today = new Date().toISOString().split('T')[0];
    return leads.filter((l) => l.followUpDate === today);
  };

  const searchLeads = (query) => {
    const q = query.toLowerCase();
    return leads.filter(
      (l) =>
        l.name.toLowerCase().includes(q) ||
        l.phone.includes(q) ||
        l.projectType.toLowerCase().includes(q) ||
        l.email.toLowerCase().includes(q)
    );
  };

  const convertToCustomer = (leadId) => {
    const lead = leads.find((l) => l.id === leadId);
    if (!lead) return null;

    const newCustomer = {
      id: Date.now().toString(),
      name: lead.name,
      email: lead.email,
      phone: lead.phone,
      address: lead.address,
      notes: '',
      createdAt: new Date().toISOString().split('T')[0],
      jobs: [],
      estimates: [],
      invoices: [],
      totalRevenue: 0,
    };
    setCustomers((prev) => [newCustomer, ...prev]);
    updateLeadStage(leadId, 'won');
    return newCustomer;
  };

  const getCustomer = (id) => customers.find((c) => c.id === id);

  const getLead = (id) => leads.find((l) => l.id === id);

  return (
    <CRMContext.Provider
      value={{
        leads,
        customers,
        loading,
        addLead,
        updateLead,
        updateLeadStage,
        addActivity,
        getLeadsByStage,
        getOverdueFollowUps,
        getTodaysFollowUps,
        searchLeads,
        convertToCustomer,
        getCustomer,
        getLead,
      }}
    >
      {children}
    </CRMContext.Provider>
  );
}

export function useCRM() {
  const context = useContext(CRMContext);
  if (!context) {
    throw new Error('useCRM must be used within CRMProvider');
  }
  return context;
}