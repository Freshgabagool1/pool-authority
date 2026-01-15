import React, { useState, useEffect } from 'react';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, PieChart, Pie, Cell } from 'recharts';

const GOOGLE_MAPS_KEY = 'AIzaSyDnhsQnmylUDFWgbiMF-Etktm-9ZY6Aaw8';
const STRIPE_PUBLISHABLE_KEY = 'pk_test_51SpDftDHbtPuLg7A3guJcp7uNOUYPzADC1Uk0qqlXBvudJB6TwozWNqaCutnDcTXF0VzZWeqDVoWs4YY4ooBDwSl00W4DbIbcf';
const PAYMENT_SERVER_URL = 'https://pool-authority-server.onrender.com';

// Icons as simple SVG components
const Icons = {
  Users: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
  MapPin: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>,
  Plus: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
  X: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
  Navigation: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="3 11 22 2 13 21 11 13 3 11"/></svg>,
  Download: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>,
  Calendar: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
  History: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3v5h5"/><path d="M3.05 13A9 9 0 1 0 6 5.3L3 8"/><path d="M12 7v5l4 2"/></svg>,
  DollarSign: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>,
  Edit: () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>,
  Trash: () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>,
  Check: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>,
  Map: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"/><line x1="8" y1="2" x2="8" y2="18"/><line x1="16" y1="6" x2="16" y2="22"/></svg>,
  Beaker: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4.5 3h15"/><path d="M6 3v16a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V3"/><path d="M6 14h12"/></svg>,
  Wrench: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>,
  Home: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
  ChevronLeft: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>,
  ChevronRight: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>,
  FileText: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>,
  CreditCard: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>,
  Receipt: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1-2-1z"/><path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8"/><path d="M12 17V7"/></svg>,
  Settings: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>,
};

export default function PoolAuthority() {
  // State
  const [customers, setCustomers] = useState([]);
  const [serviceHistory, setServiceHistory] = useState([]);
  const [recurringServices, setRecurringServices] = useState([]);
  const [chemicalInventory, setChemicalInventory] = useState([]);
  const [oneTimeJobs, setOneTimeJobs] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [activeTab, setActiveTab] = useState('home');
  const [showAddCustomer, setShowAddCustomer] = useState(false);
  const [showAddChemical, setShowAddChemical] = useState(false);
  const [showAddJob, setShowAddJob] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [routeCustomers, setRouteCustomers] = useState([]);
  const [showMap, setShowMap] = useState(false);
  const [routeDate, setRouteDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [calendarDate, setCalendarDate] = useState(new Date());
  const [invoiceMonth, setInvoiceMonth] = useState(new Date().toISOString().slice(0, 7));
  const [showCustomInvoice, setShowCustomInvoice] = useState(false);
  const [showCreateQuote, setShowCreateQuote] = useState(false);
  const [quotes, setQuotes] = useState([]);
  const [customInvoice, setCustomInvoice] = useState({ customerId: '', items: [], notes: '' });
  const [currentQuote, setCurrentQuote] = useState({ customerId: '', items: [], notes: '', validDays: 30 });
  const [newLineItem, setNewLineItem] = useState({ type: 'labor', description: '', modelNumber: '', quantity: 1, price: 0 });
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentDetails, setPaymentDetails] = useState({ customerId: '', amount: 0, description: '', invoiceId: '' });
  const [showCompleteServiceModal, setShowCompleteServiceModal] = useState(false);
  const [serviceToComplete, setServiceToComplete] = useState(null);
  const [serviceChemicals, setServiceChemicals] = useState([]);
  const [editingService, setEditingService] = useState(null);
  const [showEditServiceModal, setShowEditServiceModal] = useState(false);
  const [selectedCustomerBilling, setSelectedCustomerBilling] = useState(null);
  const [billingAdjustments, setBillingAdjustments] = useState([]);
  const [editingChemical, setEditingChemical] = useState(null);
  const [chemicalChartScale, setChemicalChartScale] = useState('monthly');
  const [wearItems, setWearItems] = useState([]);
  const [showWearItemsSettings, setShowWearItemsSettings] = useState(false);
  const [newWearItem, setNewWearItem] = useState({ name: '', price: 0, description: '' });
  const [showCompleteJobModal, setShowCompleteJobModal] = useState(false);
  const [jobToComplete, setJobToComplete] = useState(null);
  const [jobCompletionItems, setJobCompletionItems] = useState([]);
  const [jobChemicals, setJobChemicals] = useState([]);

  // Company Settings & Email Templates
  const [companySettings, setCompanySettings] = useState({
    companyName: 'Pool Authority',
    ownerName: '',
    phone: '',
    email: '',
    address: '',
    website: '',
    logoUrl: '',
    primaryColor: '#1e3a5f',
    accentColor: '#5bb4d8'
  });
  
  const [emailTemplates, setEmailTemplates] = useState({
    weeklyUpdate: {
      subject: 'Weekly Pool Service Update - {{company_name}}',
      body: `Hi {{customer_name}},

Here's your weekly pool service update from {{company_name}}.

**Service Date:** {{service_date}}
**Services Performed:** Weekly maintenance, chemical balancing, skimming, vacuuming

{{#if chemicals_used}}
**Chemicals Applied:**
{{chemicals_used}}
{{/if}}

**Pool Status:** Your pool is looking great! ✓

If you have any questions, feel free to reach out.

Best regards,
{{owner_name}}
{{company_name}}
{{company_phone}}`
    },
    monthlyInvoice: {
      subject: 'Invoice for {{month}} - {{company_name}}',
      body: `Hi {{customer_name}},

Please find your invoice for pool services in {{month}}.

**Invoice Summary:**
{{service_summary}}

**Subtotal:** ${{subtotal}}
**Chemicals:** ${{chemical_total}}
**Total Due:** ${{total}}

{{#if payment_link}}
**Pay Online:** {{payment_link}}
{{/if}}

Payment is due within 15 days. Thank you for your business!

Best regards,
{{owner_name}}
{{company_name}}
{{company_phone}}
{{company_email}}`
    },
    quote: {
      subject: 'Quote #{{quote_number}} from {{company_name}}',
      body: `Hi {{customer_name}},

Thank you for your interest in our services! Here's your quote:

**Quote #:** {{quote_number}}
**Date:** {{quote_date}}
**Valid For:** {{valid_days}} days

**Services:**
{{line_items}}

**Total:** ${{total}}

To accept this quote, simply reply to this email or give us a call.

Best regards,
{{owner_name}}
{{company_name}}
{{company_phone}}
{{company_email}}`
    }
  });
  
  const [editingTemplate, setEditingTemplate] = useState(null);
  const [previewTemplate, setPreviewTemplate] = useState(null);

  const [newCustomer, setNewCustomer] = useState({
    name: '', address: '', poolType: 'inground', phone: '', email: '',
    weeklyRate: 100, gateCode: '', dogName: '', notes: ''
  });

  const [newChemical, setNewChemical] = useState({
    name: '', quantity: 0, unit: 'lbs', costPerUnit: 0
  });

  const [newJob, setNewJob] = useState({
    customerId: '', jobType: 'opening', date: '', price: 250, notes: ''
  });

  // Load data from storage
  useEffect(() => {
    const loadData = () => {
      try {
        const keys = ['pool-customers', 'pool-history', 'pool-recurring', 'pool-chemicals', 'pool-jobs', 'pool-invoices', 'pool-quotes', 'pool-wear-items', 'pool-company-settings', 'pool-email-templates'];
        const setters = [setCustomers, setServiceHistory, setRecurringServices, setChemicalInventory, setOneTimeJobs, setInvoices, setQuotes, setWearItems, setCompanySettings, setEmailTemplates];
        for (let i = 0; i < keys.length; i++) {
          const result = localStorage.getItem(keys[i]);
          if (result) {
            // Merge with defaults for settings/templates to preserve new fields
            if (keys[i] === 'pool-company-settings') {
              setters[i](prev => ({ ...prev, ...JSON.parse(result) }));
            } else if (keys[i] === 'pool-email-templates') {
              setters[i](prev => ({ ...prev, ...JSON.parse(result) }));
            } else {
              setters[i](JSON.parse(result));
            }
          }
        }
      } catch (e) { console.log('No existing data'); }
    };
    loadData();
  }, []);

  // Save helpers
  const saveData = (key, data, setter) => {
    setter(data);
    try { localStorage.setItem(key, JSON.stringify(data)); } 
    catch (e) { console.error('Save error:', e); }
  };

  const saveCustomers = (data) => saveData('pool-customers', data, setCustomers);
  const saveHistory = (data) => saveData('pool-history', data, setServiceHistory);
  const saveRecurring = (data) => saveData('pool-recurring', data, setRecurringServices);
  const saveChemicals = (data) => saveData('pool-chemicals', data, setChemicalInventory);
  const saveJobs = (data) => saveData('pool-jobs', data, setOneTimeJobs);
  const saveInvoices = (data) => saveData('pool-invoices', data, setInvoices);
  const saveQuotes = (data) => saveData('pool-quotes', data, setQuotes);
  const saveWearItems = (data) => saveData('pool-wear-items', data, setWearItems);
  const saveCompanySettings = (data) => saveData('pool-company-settings', data, setCompanySettings);
  const saveEmailTemplates = (data) => saveData('pool-email-templates', data, setEmailTemplates);

  // Customer functions
  const addCustomer = () => {
    if (newCustomer.name && newCustomer.address) {
      const customer = { ...newCustomer, id: Date.now(), createdDate: new Date().toISOString() };
      saveCustomers([...customers, customer]);
      setNewCustomer({ name: '', address: '', poolType: 'inground', phone: '', email: '', weeklyRate: 100, gateCode: '', dogName: '', notes: '' });
      setShowAddCustomer(false);
    }
  };

  const updateCustomer = () => {
    if (editingCustomer) {
      saveCustomers(customers.map(c => c.id === editingCustomer.id ? editingCustomer : c));
      setEditingCustomer(null);
    }
  };

  const deleteCustomer = (id) => {
    if (confirm('Delete this customer?')) {
      saveCustomers(customers.filter(c => c.id !== id));
      setRouteCustomers(routeCustomers.filter(c => c.id !== id));
    }
  };

  // Route functions
  const toggleRouteCustomer = (customer) => {
    const exists = routeCustomers.find(c => c.id === customer.id);
    if (exists) {
      setRouteCustomers(routeCustomers.filter(c => c.id !== customer.id));
    } else {
      setRouteCustomers([...routeCustomers, customer]);
    }
  };

  const moveInRoute = (index, direction) => {
    const newRoute = [...routeCustomers];
    const newIndex = index + direction;
    if (newIndex < 0 || newIndex >= newRoute.length) return;
    [newRoute[index], newRoute[newIndex]] = [newRoute[newIndex], newRoute[index]];
    setRouteCustomers(newRoute);
  };

  const getGoogleMapsRouteUrl = () => {
    if (routeCustomers.length === 0) return '';
    const addresses = routeCustomers.map(c => encodeURIComponent(c.address));
    if (addresses.length === 1) return `https://www.google.com/maps/search/?api=1&query=${addresses[0]}`;
    const origin = addresses[0];
    const destination = addresses[addresses.length - 1];
    const waypoints = addresses.slice(1, -1).join('|');
    return `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}${waypoints ? '&waypoints=' + waypoints : ''}&mode=driving`;
  };

  const getEmbedMapUrl = () => {
    if (routeCustomers.length === 0) return '';
    if (routeCustomers.length === 1) return `https://www.google.com/maps/embed/v1/place?key=${GOOGLE_MAPS_KEY}&q=${encodeURIComponent(routeCustomers[0].address)}`;
    const origin = encodeURIComponent(routeCustomers[0].address);
    const destination = encodeURIComponent(routeCustomers[routeCustomers.length - 1].address);
    const waypoints = routeCustomers.slice(1, -1).map(c => encodeURIComponent(c.address)).join('|');
    return `https://www.google.com/maps/embed/v1/directions?key=${GOOGLE_MAPS_KEY}&origin=${origin}&destination=${destination}${waypoints ? '&waypoints=' + waypoints : ''}&mode=driving`;
  };

  // Service functions
  // Open service completion modal
  const openCompleteServiceModal = (customer) => {
    setServiceToComplete(customer);
    setServiceChemicals([]);
    setShowCompleteServiceModal(true);
  };

  // Add chemical to current service
  const addChemicalToService = (chemical, quantity) => {
    if (quantity <= 0) return;
    const existingIndex = serviceChemicals.findIndex(c => c.id === chemical.id);
    if (existingIndex >= 0) {
      const updated = [...serviceChemicals];
      updated[existingIndex].quantity += quantity;
      setServiceChemicals(updated);
    } else {
      setServiceChemicals([...serviceChemicals, { ...chemical, quantityUsed: quantity }]);
    }
  };

  // Remove chemical from current service
  const removeChemicalFromService = (chemicalId) => {
    setServiceChemicals(serviceChemicals.filter(c => c.id !== chemicalId));
  };

  // Complete the service with chemicals
  const completeServiceWithChemicals = () => {
    if (!serviceToComplete) return;
    
    const chemicalCost = serviceChemicals.reduce((sum, c) => sum + (c.quantityUsed * c.costPerUnit), 0);
    const chemicalsUsed = serviceChemicals.map(c => ({
      id: c.id,
      name: c.name,
      quantity: c.quantityUsed,
      unit: c.unit,
      costPerUnit: c.costPerUnit,
      totalCost: c.quantityUsed * c.costPerUnit
    }));
    
    const service = {
      id: Date.now(),
      customerId: serviceToComplete.id,
      customerName: serviceToComplete.name,
      date: new Date().toISOString(),
      weeklyRate: serviceToComplete.isOneTimeJob ? serviceToComplete.jobPrice : serviceToComplete.weeklyRate,
      chemicalCost,
      chemicalsUsed,
      totalAmount: (serviceToComplete.isOneTimeJob ? serviceToComplete.jobPrice : serviceToComplete.weeklyRate) + chemicalCost,
      poolType: serviceToComplete.poolType || serviceToComplete.jobType || 'service'
    };
    saveHistory([service, ...serviceHistory]);
    
    // Update chemical inventory (reduce quantities)
    const updatedChemicals = chemicalInventory.map(chem => {
      const used = serviceChemicals.find(c => c.id === chem.id);
      if (used) {
        return { ...chem, quantity: Math.max(0, chem.quantity - used.quantityUsed) };
      }
      return chem;
    });
    saveChemicals(updatedChemicals);
    
    setShowCompleteServiceModal(false);
    setServiceToComplete(null);
    setServiceChemicals([]);
  };

  // Quick complete without chemicals (legacy support)
  const completeService = (customer, chemicalCost = 0) => {
    openCompleteServiceModal(customer);
  };

  const getMonthServices = (custId, yearMonth) => 
    serviceHistory.filter(s => s.customerId === custId && s.date.startsWith(yearMonth));

  const getMonthTotal = (custId, yearMonth) => 
    getMonthServices(custId, yearMonth).reduce((sum, s) => sum + s.totalAmount, 0);

  // Calendar helpers
  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    return { year, month, firstDay, daysInMonth };
  };

  const getEventsForDate = (dateStr) => {
    const jobs = oneTimeJobs.filter(j => j.date === dateStr);
    const recurring = recurringServices.filter(r => {
      const customer = customers.find(c => c.id === r.customerId);
      if (!customer) return false;
      const serviceDate = new Date(dateStr);
      const startDate = new Date(r.startDate || customer.createdDate);
      if (serviceDate < startDate) return false;
      const dayOfWeek = serviceDate.getDay();
      const scheduledDay = r.dayOfWeek || 1; // Default Monday
      if (r.frequency === 'weekly') return dayOfWeek === scheduledDay;
      if (r.frequency === 'biweekly') {
        const weeksDiff = Math.floor((serviceDate - startDate) / (7 * 24 * 60 * 60 * 1000));
        return dayOfWeek === scheduledDay && weeksDiff % 2 === 0;
      }
      if (r.frequency === 'monthly') {
        return serviceDate.getDate() === startDate.getDate();
      }
      return false;
    });
    const completed = serviceHistory.filter(s => s.date.startsWith(dateStr));
    return { jobs, recurring, completed };
  };

  // Get customers scheduled for a specific date (from recurring services)
  const getScheduledCustomersForDate = (dateStr) => {
    const scheduledCustomers = [];
    
    // Get customers from recurring services
    recurringServices.filter(r => r.active).forEach(r => {
      const customer = customers.find(c => c.id === r.customerId);
      if (!customer) return;
      
      const serviceDate = new Date(dateStr);
      const startDate = new Date(r.startDate || customer.createdDate);
      if (serviceDate < startDate) return;
      
      const dayOfWeek = serviceDate.getDay();
      const scheduledDay = r.dayOfWeek || 1;
      
      let isScheduled = false;
      if (r.frequency === 'weekly') {
        isScheduled = dayOfWeek === scheduledDay;
      } else if (r.frequency === 'biweekly') {
        const weeksDiff = Math.floor((serviceDate - startDate) / (7 * 24 * 60 * 60 * 1000));
        isScheduled = dayOfWeek === scheduledDay && weeksDiff % 2 === 0;
      } else if (r.frequency === 'monthly') {
        isScheduled = serviceDate.getDate() === startDate.getDate();
      }
      
      if (isScheduled && !scheduledCustomers.find(c => c.id === customer.id)) {
        scheduledCustomers.push({ ...customer, recurringId: r.id, frequency: r.frequency });
      }
    });
    
    // Also add customers from one-time jobs scheduled for this date
    oneTimeJobs.filter(j => j.date === dateStr).forEach(job => {
      const customer = customers.find(c => c.id === parseInt(job.customerId));
      if (customer && !scheduledCustomers.find(c => c.id === customer.id)) {
        scheduledCustomers.push({ ...customer, isOneTimeJob: true, jobType: job.jobType, jobPrice: job.price });
      }
    });
    
    return scheduledCustomers;
  };

  // Update route when date changes
  useEffect(() => {
    const scheduled = getScheduledCustomersForDate(routeDate);
    setRouteCustomers(scheduled);
  }, [routeDate, recurringServices, oneTimeJobs, customers]);

  // Helper to change route date
  const changeRouteDate = (days) => {
    const current = new Date(routeDate);
    current.setDate(current.getDate() + days);
    setRouteDate(current.toISOString().split('T')[0]);
  };

  const formatRouteDate = (dateStr) => {
    const date = new Date(dateStr);
    const today = new Date().toISOString().split('T')[0];
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowStr = tomorrow.toISOString().split('T')[0];
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];
    
    if (dateStr === today) return 'Today';
    if (dateStr === tomorrowStr) return 'Tomorrow';
    if (dateStr === yesterdayStr) return 'Yesterday';
    return date.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' });
  };

  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 
                      'July', 'August', 'September', 'October', 'November', 'December'];

  // Revenue data for charts
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  
  const getAvailableYears = () => {
    const years = new Set();
    years.add(new Date().getFullYear()); // Always include current year
    serviceHistory.forEach(s => {
      const year = new Date(s.date).getFullYear();
      years.add(year);
    });
    return Array.from(years).sort((a, b) => b - a); // Descending order
  };

  const getMonthlyRevenueData = () => {
    const months = [];
    for (let i = 0; i < 12; i++) {
      const date = new Date(selectedYear, i, 1);
      const yearMonth = date.toISOString().slice(0, 7);
      const monthRevenue = serviceHistory
        .filter(s => s.date.startsWith(yearMonth))
        .reduce((sum, s) => sum + s.totalAmount, 0);
      months.push({
        month: monthNames[i].slice(0, 3),
        revenue: monthRevenue,
        fullMonth: monthNames[i],
        year: selectedYear
      });
    }
    return months;
  };

  const getYearlyRevenueData = () => {
    const years = [];
    const currentYear = new Date().getFullYear();
    for (let i = 4; i >= 0; i--) {
      const year = currentYear - i;
      const yearRevenue = serviceHistory
        .filter(s => new Date(s.date).getFullYear() === year)
        .reduce((sum, s) => sum + s.totalAmount, 0);
      years.push({
        year: year.toString(),
        revenue: yearRevenue
      });
    }
    return years;
  };

  const getYearTotal = (year) => {
    return serviceHistory
      .filter(s => new Date(s.date).getFullYear() === year)
      .reduce((sum, s) => sum + s.totalAmount, 0);
  };

  const getAccountsReceivable = () => {
    // Calculate what's owed by each customer (services - payments)
    return customers.map(customer => {
      const totalServices = serviceHistory
        .filter(s => s.customerId === customer.id)
        .reduce((sum, s) => sum + s.totalAmount, 0);
      const totalPaid = invoices
        .filter(inv => inv.customerId === customer.id && inv.paid)
        .reduce((sum, inv) => sum + inv.amount, 0);
      const balance = totalServices - totalPaid;
      return {
        id: customer.id,
        name: customer.name,
        totalServices,
        totalPaid,
        balance: Math.max(0, balance)
      };
    }).filter(c => c.balance > 0);
  };

  const getWeeklyRevenueData = () => {
    const weeks = [];
    const now = new Date();
    for (let i = 7; i >= 0; i--) {
      const weekStart = new Date(now);
      weekStart.setDate(now.getDate() - (i * 7));
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekStart.getDate() + 6);
      
      const weekRevenue = serviceHistory.filter(s => {
        const serviceDate = new Date(s.date);
        return serviceDate >= weekStart && serviceDate <= weekEnd;
      }).reduce((sum, s) => sum + s.totalAmount, 0);
      
      weeks.push({
        week: `${weekStart.getMonth() + 1}/${weekStart.getDate()}`,
        revenue: weekRevenue
      });
    }
    return weeks;
  };

  // Chemical usage tracking functions
  const getChemicalUsageData = (timeScale) => {
    // Get all unique chemicals used
    const chemicalNames = new Set();
    serviceHistory.forEach(s => {
      if (s.chemicalsUsed) {
        s.chemicalsUsed.forEach(c => chemicalNames.add(c.name));
      }
    });
    const chemicals = Array.from(chemicalNames);

    if (timeScale === 'weekly') {
      // Last 8 weeks
      const weeks = [];
      const now = new Date();
      for (let i = 7; i >= 0; i--) {
        const weekStart = new Date(now);
        weekStart.setDate(now.getDate() - (i * 7));
        const weekEnd = new Date(weekStart);
        weekEnd.setDate(weekStart.getDate() + 6);
        
        const weekData = {
          period: `${weekStart.getMonth() + 1}/${weekStart.getDate()}`,
          fullPeriod: `Week of ${weekStart.toLocaleDateString()}`
        };
        
        // Calculate usage for each chemical
        chemicals.forEach(chemName => {
          let totalUsage = 0;
          serviceHistory.forEach(s => {
            const serviceDate = new Date(s.date);
            if (serviceDate >= weekStart && serviceDate <= weekEnd && s.chemicalsUsed) {
              const chem = s.chemicalsUsed.find(c => c.name === chemName);
              if (chem) totalUsage += chem.quantity;
            }
          });
          weekData[chemName] = totalUsage;
        });
        
        weeks.push(weekData);
      }
      return { data: weeks, chemicals };
    } else if (timeScale === 'monthly') {
      // Last 12 months
      const months = [];
      const now = new Date();
      for (let i = 11; i >= 0; i--) {
        const monthDate = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const yearMonth = monthDate.toISOString().slice(0, 7);
        
        const monthData = {
          period: monthNames[monthDate.getMonth()].slice(0, 3),
          fullPeriod: `${monthNames[monthDate.getMonth()]} ${monthDate.getFullYear()}`
        };
        
        chemicals.forEach(chemName => {
          let totalUsage = 0;
          serviceHistory.forEach(s => {
            if (s.date.startsWith(yearMonth) && s.chemicalsUsed) {
              const chem = s.chemicalsUsed.find(c => c.name === chemName);
              if (chem) totalUsage += chem.quantity;
            }
          });
          monthData[chemName] = totalUsage;
        });
        
        months.push(monthData);
      }
      return { data: months, chemicals };
    } else {
      // Annual - last 5 years
      const years = [];
      const currentYear = new Date().getFullYear();
      for (let i = 4; i >= 0; i--) {
        const year = currentYear - i;
        
        const yearData = {
          period: year.toString(),
          fullPeriod: year.toString()
        };
        
        chemicals.forEach(chemName => {
          let totalUsage = 0;
          serviceHistory.forEach(s => {
            if (new Date(s.date).getFullYear() === year && s.chemicalsUsed) {
              const chem = s.chemicalsUsed.find(c => c.name === chemName);
              if (chem) totalUsage += chem.quantity;
            }
          });
          yearData[chemName] = totalUsage;
        });
        
        years.push(yearData);
      }
      return { data: years, chemicals };
    }
  };

  // Get chemical usage summary for current period
  const getChemicalUsageSummary = () => {
    const now = new Date();
    const currentMonth = now.toISOString().slice(0, 7);
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1).toISOString().slice(0, 7);
    
    const summary = {};
    
    serviceHistory.forEach(s => {
      if (s.chemicalsUsed) {
        s.chemicalsUsed.forEach(chem => {
          if (!summary[chem.name]) {
            summary[chem.name] = { name: chem.name, unit: chem.unit, thisMonth: 0, lastMonth: 0, total: 0 };
          }
          summary[chem.name].total += chem.quantity;
          if (s.date.startsWith(currentMonth)) {
            summary[chem.name].thisMonth += chem.quantity;
          } else if (s.date.startsWith(lastMonth)) {
            summary[chem.name].lastMonth += chem.quantity;
          }
        });
      }
    });
    
    return Object.values(summary);
  };

  // Colors for different chemicals in chart
  const chemicalColors = ['#0d9488', '#0ea5e9', '#8b5cf6', '#f59e0b', '#ef4444', '#22c55e', '#ec4899', '#6366f1'];

  // Mark invoice as paid
  const markInvoicePaid = (customerId, amount) => {
    const newInvoice = {
      id: Date.now(),
      customerId,
      amount,
      paid: true,
      paidDate: new Date().toISOString()
    };
    saveInvoices([...invoices, newInvoice]);
  };

  // Recurring service functions
  const addRecurringService = (customerId, frequency, dayOfWeek, startDate) => {
    const customer = customers.find(c => c.id === customerId);
    if (!customer) return;
    const recurring = {
      id: Date.now(),
      customerId,
      customerName: customer.name,
      frequency,
      dayOfWeek: parseInt(dayOfWeek),
      startDate,
      active: true
    };
    saveRecurring([...recurringServices, recurring]);
  };

  const deleteRecurringService = (id) => {
    saveRecurring(recurringServices.filter(r => r.id !== id));
  };

  // Custom invoice functions
  const addLineItem = (targetState, setTargetState) => {
    if (newLineItem.description && newLineItem.price > 0) {
      setTargetState({
        ...targetState,
        items: [...targetState.items, { ...newLineItem, id: Date.now() }]
      });
      setNewLineItem({ type: 'labor', description: '', modelNumber: '', quantity: 1, price: 0 });
    }
  };

  const removeLineItem = (targetState, setTargetState, itemId) => {
    setTargetState({
      ...targetState,
      items: targetState.items.filter(i => i.id !== itemId)
    });
  };

  const generateCustomInvoice = () => {
    const customer = customers.find(c => c.id === parseInt(customInvoice.customerId));
    if (!customer || customInvoice.items.length === 0) return;

    const total = customInvoice.items.reduce((sum, item) => sum + (item.quantity * item.price), 0);
    const invoiceNumber = `INV-${Date.now().toString().slice(-8)}`;

    const html = `<!DOCTYPE html>
<html><head><style>
  body { font-family: 'Segoe UI', Arial, sans-serif; max-width: 800px; margin: 40px auto; padding: 20px; color: #1e3a5f; }
  .header { background: linear-gradient(135deg, #1e3a5f 0%, #2d5a87 100%); color: white; padding: 30px; border-radius: 12px; margin-bottom: 30px; }
  .header h1 { margin: 0 0 5px 0; font-size: 28px; }
  .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 30px; margin-bottom: 30px; }
  .info-box h3 { margin: 0 0 10px 0; color: #1e3a5f; font-size: 14px; text-transform: uppercase; }
  table { width: 100%; border-collapse: collapse; margin: 20px 0; }
  th { background: #1e3a5f; color: white; padding: 12px; text-align: left; }
  td { padding: 12px; border-bottom: 1px solid #e2e8f0; }
  .item-type { font-size: 11px; background: #e2e8f0; padding: 2px 8px; border-radius: 4px; margin-right: 8px; }
  .model-num { font-size: 12px; color: #666; margin-top: 4px; }
  .total-row { background: #f1f5f9; font-weight: bold; font-size: 18px; }
  .notes { background: #fef3c7; padding: 15px; border-radius: 8px; margin: 20px 0; }
  .total-box { background: linear-gradient(135deg, #1e3a5f 0%, #2d5a87 100%); color: white; padding: 20px 30px; border-radius: 12px; text-align: right; }
</style></head>
<body>
  <div class="header"><h1>🏊 POOL AUTHORITY</h1><p>Service Invoice</p></div>
  <div class="info-grid">
    <div class="info-box"><h3>Invoice Details</h3><p><strong>Invoice #:</strong> ${invoiceNumber}</p><p><strong>Date:</strong> ${new Date().toLocaleDateString()}</p></div>
    <div class="info-box"><h3>Bill To</h3><p><strong>${customer.name}</strong></p><p>${customer.address}</p><p>${customer.phone || ''}</p><p>${customer.email || ''}</p></div>
  </div>
  <table>
    <tr><th>Description</th><th>Qty</th><th>Price</th><th>Total</th></tr>
    ${customInvoice.items.map(item => `
      <tr>
        <td>
          <span class="item-type">${item.type.toUpperCase()}</span>${item.description}
          ${item.modelNumber ? `<div class="model-num">Model/Part #: ${item.modelNumber}</div>` : ''}
        </td>
        <td>${item.quantity}</td>
        <td>$${item.price.toFixed(2)}</td>
        <td>$${(item.quantity * item.price).toFixed(2)}</td>
      </tr>
    `).join('')}
    <tr class="total-row"><td colspan="3">Total Due</td><td>$${total.toFixed(2)}</td></tr>
  </table>
  ${customInvoice.notes ? `<div class="notes"><strong>Notes:</strong> ${customInvoice.notes}</div>` : ''}
  <div class="total-box"><span>Amount Due</span><div style="font-size:32px;font-weight:bold;margin-top:5px;">$${total.toFixed(2)}</div></div>
</body></html>`;

    const blob = new Blob([html], { type: 'text/html' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `PoolAuthority-Invoice-${customer.name.replace(/\s+/g, '-')}-${invoiceNumber}.html`;
    a.click();

    // Save to history
    const service = {
      id: Date.now(),
      customerId: customer.id,
      customerName: customer.name,
      date: new Date().toISOString(),
      invoiceNumber,
      invoiceItems: customInvoice.items,
      totalAmount: total,
      notes: customInvoice.notes,
      type: 'custom-invoice'
    };
    saveHistory([service, ...serviceHistory]);

    // Email
    if (customer.email) {
      const subject = `Invoice ${invoiceNumber} from Pool Authority`;
      const body = `Hi ${customer.name},\n\nPlease find attached your invoice ${invoiceNumber} for $${total.toFixed(2)}.\n\nItems:\n${customInvoice.items.map(i => `- ${i.description}: $${(i.quantity * i.price).toFixed(2)}`).join('\n')}\n\nTotal: $${total.toFixed(2)}\n\nThank you for your business!\n\nPool Authority`;
      window.open(`mailto:${customer.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`);
    }

    setCustomInvoice({ customerId: '', items: [], notes: '' });
    setShowCustomInvoice(false);
  };

  // Quote functions
  const generateQuote = () => {
    const customer = customers.find(c => c.id === parseInt(currentQuote.customerId));
    if (!customer || currentQuote.items.length === 0) return;

    const total = currentQuote.items.reduce((sum, item) => sum + (item.quantity * item.price), 0);
    const quoteNumber = `QT-${Date.now().toString().slice(-8)}`;
    const validUntil = new Date();
    validUntil.setDate(validUntil.getDate() + currentQuote.validDays);

    const quote = {
      id: Date.now(),
      quoteNumber,
      customerId: customer.id,
      customerName: customer.name,
      customerEmail: customer.email,
      items: currentQuote.items,
      notes: currentQuote.notes,
      total,
      validUntil: validUntil.toISOString(),
      status: 'pending',
      createdDate: new Date().toISOString()
    };
    saveQuotes([quote, ...quotes]);

    const html = `<!DOCTYPE html>
<html><head><style>
  body { font-family: 'Segoe UI', Arial, sans-serif; max-width: 800px; margin: 40px auto; padding: 20px; color: #1e3a5f; }
  .header { background: linear-gradient(135deg, #7c3aed 0%, #a855f7 100%); color: white; padding: 30px; border-radius: 12px; margin-bottom: 30px; }
  .header h1 { margin: 0 0 5px 0; font-size: 28px; }
  .validity { background: #fef3c7; padding: 15px; border-radius: 8px; margin-bottom: 20px; text-align: center; }
  .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 30px; margin-bottom: 30px; }
  .info-box h3 { margin: 0 0 10px 0; color: #1e3a5f; font-size: 14px; text-transform: uppercase; }
  table { width: 100%; border-collapse: collapse; margin: 20px 0; }
  th { background: #7c3aed; color: white; padding: 12px; text-align: left; }
  td { padding: 12px; border-bottom: 1px solid #e2e8f0; }
  .item-type { font-size: 11px; background: #e2e8f0; padding: 2px 8px; border-radius: 4px; margin-right: 8px; }
  .model-num { font-size: 12px; color: #666; margin-top: 4px; }
  .total-row { background: #f1f5f9; font-weight: bold; font-size: 18px; }
  .notes { background: #f3e8ff; padding: 15px; border-radius: 8px; margin: 20px 0; }
  .total-box { background: linear-gradient(135deg, #7c3aed 0%, #a855f7 100%); color: white; padding: 20px 30px; border-radius: 12px; text-align: right; }
  .approve-box { background: #d1fae5; padding: 20px; border-radius: 8px; text-align: center; margin-top: 20px; }
  .approve-btn { display: inline-block; background: #059669; color: white; padding: 15px 40px; border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 18px; }
</style></head>
<body>
  <div class="header"><h1>🏊 POOL AUTHORITY</h1><p>Service Quote</p></div>
  <div class="validity">⏰ This quote is valid until <strong>${validUntil.toLocaleDateString()}</strong></div>
  <div class="info-grid">
    <div class="info-box"><h3>Quote Details</h3><p><strong>Quote #:</strong> ${quoteNumber}</p><p><strong>Date:</strong> ${new Date().toLocaleDateString()}</p></div>
    <div class="info-box"><h3>Prepared For</h3><p><strong>${customer.name}</strong></p><p>${customer.address}</p><p>${customer.phone || ''}</p></div>
  </div>
  <table>
    <tr><th>Description</th><th>Qty</th><th>Price</th><th>Total</th></tr>
    ${currentQuote.items.map(item => `
      <tr>
        <td>
          <span class="item-type">${item.type.toUpperCase()}</span>${item.description}
          ${item.modelNumber ? `<div class="model-num">Model/Part #: ${item.modelNumber}</div>` : ''}
        </td>
        <td>${item.quantity}</td>
        <td>$${item.price.toFixed(2)}</td>
        <td>$${(item.quantity * item.price).toFixed(2)}</td>
      </tr>
    `).join('')}
    <tr class="total-row"><td colspan="3">Quoted Total</td><td>$${total.toFixed(2)}</td></tr>
  </table>
  ${currentQuote.notes ? `<div class="notes"><strong>Notes:</strong> ${currentQuote.notes}</div>` : ''}
  <div class="total-box"><span>Quoted Price</span><div style="font-size:32px;font-weight:bold;margin-top:5px;">$${total.toFixed(2)}</div></div>
  <div class="approve-box">
    <p><strong>Ready to proceed?</strong></p>
    <p>Reply to this email or call us to approve this quote!</p>
  </div>
</body></html>`;

    const blob = new Blob([html], { type: 'text/html' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `PoolAuthority-Quote-${customer.name.replace(/\s+/g, '-')}-${quoteNumber}.html`;
    a.click();

    // Email
    if (customer.email) {
      const subject = `Quote ${quoteNumber} from Pool Authority`;
      const body = `Hi ${customer.name},\n\nThank you for your interest! Please find attached your quote ${quoteNumber}.\n\nSummary:\n${currentQuote.items.map(i => `- ${i.description}: $${(i.quantity * i.price).toFixed(2)}`).join('\n')}\n\nTotal: $${total.toFixed(2)}\n\nThis quote is valid until ${validUntil.toLocaleDateString()}.\n\nTo approve this quote, simply reply to this email or give us a call!\n\nPool Authority`;
      window.open(`mailto:${customer.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`);
    }

    setCurrentQuote({ customerId: '', items: [], notes: '', validDays: 30 });
    setShowCreateQuote(false);
  };

  // Stripe Payment Functions
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [paymentError, setPaymentError] = useState('');

  const createStripeCheckout = async (customer, amount, description, invoiceNumber) => {
    setIsProcessingPayment(true);
    setPaymentError('');
    
    try {
      const response = await fetch(`${PAYMENT_SERVER_URL}/api/create-checkout-session`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          customerName: customer.name,
          customerEmail: customer.email,
          amount: amount,
          description: description,
          invoiceNumber: invoiceNumber,
          customerId: customer.id.toString(),
          successUrl: window.location.origin + '/payment-success',
          cancelUrl: window.location.origin + '/payment-cancelled'
        }),
      });

      const data = await response.json();
      
      if (data.success && data.paymentUrl) {
        return data;
      } else {
        throw new Error(data.error || 'Failed to create payment session');
      }
    } catch (error) {
      console.error('Stripe checkout error:', error);
      setPaymentError(error.message);
      return null;
    } finally {
      setIsProcessingPayment(false);
    }
  };

  const openPaymentRequest = (customerId, amount, description = '', invoiceId = '') => {
    setPaymentDetails({ customerId, amount, description, invoiceId });
    setPaymentError('');
    setShowPaymentModal(true);
  };

  const sendPaymentRequest = async () => {
    const customer = customers.find(c => c.id === parseInt(paymentDetails.customerId));
    if (!customer) {
      setPaymentError('Please select a customer');
      return;
    }

    if (paymentDetails.amount <= 0) {
      setPaymentError('Please enter a valid amount');
      return;
    }

    const invoiceNumber = paymentDetails.invoiceId || `PAY-${Date.now().toString().slice(-8)}`;
    
    // Try to create real Stripe Checkout
    const stripeResult = await createStripeCheckout(
      customer, 
      paymentDetails.amount, 
      paymentDetails.description || `Pool Authority - Invoice ${invoiceNumber}`,
      invoiceNumber
    );

    if (stripeResult && stripeResult.paymentUrl) {
      // Save payment request to track it
      const newInvoice = {
        id: Date.now(),
        customerId: customer.id,
        customerName: customer.name,
        customerEmail: customer.email,
        amount: paymentDetails.amount,
        description: paymentDetails.description,
        invoiceNumber,
        stripeSessionId: stripeResult.sessionId,
        paymentUrl: stripeResult.paymentUrl,
        status: 'pending',
        paid: false,
        createdDate: new Date().toISOString(),
        type: 'payment-request'
      };
      saveInvoices([newInvoice, ...invoices]);

      setShowPaymentModal(false);
      setPaymentDetails({ customerId: '', amount: 0, description: '', invoiceId: '' });
      
      // Ask if they want to open the payment link or copy it
      const openNow = window.confirm(
        `✅ Payment link created!\n\n` +
        `Customer: ${customer.name}\n` +
        `Amount: $${paymentDetails.amount.toFixed(2)}\n` +
        `Invoice #: ${invoiceNumber}\n\n` +
        `Click OK to open the payment page now, or Cancel to copy the link.`
      );

      if (openNow) {
        window.open(stripeResult.paymentUrl, '_blank');
      } else {
        // Copy to clipboard
        navigator.clipboard.writeText(stripeResult.paymentUrl).then(() => {
          alert('Payment link copied to clipboard!\n\nSend this link to your customer.');
        }).catch(() => {
          // Fallback - show the URL
          prompt('Copy this payment link:', stripeResult.paymentUrl);
        });
      }
    } else {
      // Fallback to offline mode if server not available
      const fallbackConfirm = window.confirm(
        `⚠️ Could not connect to payment server.\n\n` +
        `Error: ${paymentError || 'Server unavailable'}\n\n` +
        `Would you like to create an offline payment request instead?`
      );

      if (fallbackConfirm) {
        createOfflinePaymentRequest(customer, paymentDetails.amount, paymentDetails.description, invoiceNumber);
      }
    }
  };

  const createOfflinePaymentRequest = (customer, amount, description, invoiceNumber) => {
    // Fallback HTML payment request for when server is not available
    const html = `<!DOCTYPE html>
<html><head><style>
  body { font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 40px auto; padding: 20px; color: #1e3a5f; }
  .header { background: linear-gradient(135deg, #1e3a5f 0%, #2d5a87 100%); color: white; padding: 30px; border-radius: 12px; margin-bottom: 30px; text-align: center; }
  .amount-box { background: #f8fafc; border: 2px solid #e2e8f0; border-radius: 12px; padding: 30px; text-align: center; margin: 20px 0; }
  .amount { font-size: 48px; font-weight: bold; color: #1e3a5f; }
  .details { background: #f1f5f9; padding: 20px; border-radius: 8px; margin: 20px 0; }
  .note { background: #fef3c7; padding: 15px; border-radius: 8px; margin-top: 20px; }
</style></head>
<body>
  <div class="header">
    <h1>🏊 POOL AUTHORITY</h1>
    <p>Payment Request</p>
  </div>
  <p>Hi ${customer.name},</p>
  <p>${description || 'Please find your payment request below.'}</p>
  <div class="amount-box">
    <div style="color:#666;font-size:14px;margin-bottom:10px;">Amount Due</div>
    <div class="amount">$${amount.toFixed(2)}</div>
  </div>
  <div class="details">
    <strong>Payment Details:</strong><br>
    Invoice #: ${invoiceNumber}<br>
    Date: ${new Date().toLocaleDateString()}<br>
    ${description ? `Description: ${description}` : ''}
  </div>
  <div class="note">
    <strong>How to Pay:</strong><br>
    Please contact Pool Authority to arrange payment via credit card, check, or bank transfer.
  </div>
</body></html>`;

    const blob = new Blob([html], { type: 'text/html' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `PoolAuthority-PaymentRequest-${customer.name.replace(/\s+/g, '-')}-${invoiceNumber}.html`;
    a.click();

    // Save payment request
    const newInvoice = {
      id: Date.now(),
      customerId: customer.id,
      customerName: customer.name,
      amount: amount,
      description: description,
      invoiceNumber,
      status: 'pending',
      paid: false,
      createdDate: new Date().toISOString(),
      type: 'payment-request',
      offline: true
    };
    saveInvoices([newInvoice, ...invoices]);

    setShowPaymentModal(false);
    setPaymentDetails({ customerId: '', amount: 0, description: '', invoiceId: '' });
  };

  const checkPaymentStatus = async (sessionId) => {
    try {
      const response = await fetch(`${PAYMENT_SERVER_URL}/api/payment-status/${sessionId}`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error checking payment status:', error);
      return null;
    }
  };

  const refreshPaymentStatuses = async () => {
    const pendingPayments = invoices.filter(i => i.stripeSessionId && !i.paid);
    
    for (const payment of pendingPayments) {
      const status = await checkPaymentStatus(payment.stripeSessionId);
      if (status && status.status === 'paid') {
        saveInvoices(invoices.map(inv => 
          inv.id === payment.id 
            ? { ...inv, status: 'paid', paid: true, paidDate: new Date().toISOString() }
            : inv
        ));
      }
    }
  };

  const markPaymentReceived = (invoiceId) => {
    saveInvoices(invoices.map(inv => 
      inv.id === invoiceId ? { ...inv, status: 'paid', paid: true, paidDate: new Date().toISOString() } : inv
    ));
  };

  const updateQuoteStatus = (quoteId, status) => {
    saveQuotes(quotes.map(q => q.id === quoteId ? { ...q, status } : q));
  };

  const convertQuoteToJob = (quote) => {
    const customer = customers.find(c => c.id === quote.customerId);
    if (!customer) return;
    
    const job = {
      id: Date.now(),
      customerId: quote.customerId,
      customerName: quote.customerName,
      jobType: 'quoted-work',
      date: new Date().toISOString().split('T')[0],
      price: quote.total,
      notes: `From Quote ${quote.quoteNumber}: ${quote.items.map(i => i.description).join(', ')}`,
      quoteId: quote.id
    };
    saveJobs([...oneTimeJobs, job]);
    updateQuoteStatus(quote.id, 'approved');
  };

  // Convert approved quote directly to invoice
  const convertQuoteToInvoice = (quote) => {
    const customer = customers.find(c => c.id === quote.customerId);
    if (!customer) return;

    const invoiceNumber = `INV-${Date.now().toString().slice(-8)}`;
    const total = quote.total;

    const html = `<!DOCTYPE html>
<html><head><style>
  body { font-family: 'Segoe UI', Arial, sans-serif; max-width: 800px; margin: 40px auto; padding: 20px; color: #1e3a5f; }
  .header { background: linear-gradient(135deg, #1e3a5f 0%, #2d5a87 100%); color: white; padding: 30px; border-radius: 12px; margin-bottom: 30px; display: flex; align-items: center; gap: 20px; }
  .header h1 { margin: 0 0 5px 0; font-size: 28px; }
  .logo { width: 60px; height: 60px; }
  .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 30px; margin-bottom: 30px; }
  .info-box h3 { margin: 0 0 10px 0; color: #1e3a5f; font-size: 14px; text-transform: uppercase; }
  table { width: 100%; border-collapse: collapse; margin: 20px 0; }
  th { background: #1e3a5f; color: white; padding: 12px; text-align: left; }
  td { padding: 12px; border-bottom: 1px solid #e2e8f0; }
  .item-type { font-size: 11px; background: #e2e8f0; padding: 2px 8px; border-radius: 4px; margin-right: 8px; }
  .model-num { font-size: 12px; color: #666; margin-top: 4px; }
  .total-row { background: #f1f5f9; font-weight: bold; font-size: 18px; }
  .quote-ref { background: #fef3c7; padding: 10px 15px; border-radius: 8px; margin-bottom: 20px; font-size: 14px; }
  .total-box { background: linear-gradient(135deg, #1e3a5f 0%, #2d5a87 100%); color: white; padding: 20px 30px; border-radius: 12px; text-align: right; }
</style></head>
<body>
  <div class="header">
    <svg viewBox="0 0 100 110" class="logo">
      <path d="M50 5 L90 25 L90 70 Q90 95 50 105 Q10 95 10 70 L10 25 Z" fill="#5bb4d8"/>
      <path d="M50 12 L83 28 L83 68 Q83 88 50 98 Q17 88 17 68 L17 28 Z" fill="white" opacity="0.3"/>
      <path d="M20 35 Q35 40 50 35 Q65 30 80 35" stroke="white" stroke-width="2" fill="none" opacity="0.8"/>
      <path d="M20 48 Q35 53 50 48 Q65 43 80 48" stroke="white" stroke-width="2" fill="none" opacity="0.8"/>
      <path d="M20 61 Q35 66 50 61 Q65 56 80 61" stroke="white" stroke-width="2" fill="none" opacity="0.8"/>
    </svg>
    <div>
      <h1>POOL AUTHORITY</h1>
      <p style="margin:0;opacity:0.9;">Service Invoice</p>
    </div>
  </div>
  <div class="quote-ref">📋 Based on approved Quote: <strong>${quote.quoteNumber}</strong></div>
  <div class="info-grid">
    <div class="info-box"><h3>Invoice Details</h3><p><strong>Invoice #:</strong> ${invoiceNumber}</p><p><strong>Date:</strong> ${new Date().toLocaleDateString()}</p></div>
    <div class="info-box"><h3>Bill To</h3><p><strong>${customer.name}</strong></p><p>${customer.address}</p><p>${customer.phone || ''}</p><p>${customer.email || ''}</p></div>
  </div>
  <table>
    <tr><th>Description</th><th>Qty</th><th>Price</th><th>Total</th></tr>
    ${quote.items.map(item => `
      <tr>
        <td>
          <span class="item-type">${item.type.toUpperCase()}</span>${item.description}
          ${item.modelNumber ? `<div class="model-num">Model/Part #: ${item.modelNumber}</div>` : ''}
        </td>
        <td>${item.quantity}</td>
        <td>$${item.price.toFixed(2)}</td>
        <td>$${(item.quantity * item.price).toFixed(2)}</td>
      </tr>
    `).join('')}
    <tr class="total-row"><td colspan="3">Total Due</td><td>$${total.toFixed(2)}</td></tr>
  </table>
  ${quote.notes ? `<div style="background:#f3e8ff;padding:15px;border-radius:8px;margin:20px 0;"><strong>Notes:</strong> ${quote.notes}</div>` : ''}
  <div class="total-box"><span>Amount Due</span><div style="font-size:32px;font-weight:bold;margin-top:5px;">$${total.toFixed(2)}</div></div>
</body></html>`;

    const blob = new Blob([html], { type: 'text/html' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `PoolAuthority-Invoice-${customer.name.replace(/\s+/g, '-')}-${invoiceNumber}.html`;
    a.click();

    // Save to history
    const service = {
      id: Date.now(),
      customerId: customer.id,
      customerName: customer.name,
      date: new Date().toISOString(),
      invoiceNumber,
      invoiceItems: quote.items,
      totalAmount: total,
      notes: `Converted from Quote ${quote.quoteNumber}`,
      type: 'custom-invoice',
      quoteNumber: quote.quoteNumber
    };
    saveHistory([service, ...serviceHistory]);
    updateQuoteStatus(quote.id, 'invoiced');

    // Email
    if (customer.email) {
      const subject = `Invoice ${invoiceNumber} from Pool Authority`;
      const body = `Hi ${customer.name},\n\nThank you for approving Quote ${quote.quoteNumber}!\n\nPlease find attached your invoice ${invoiceNumber} for $${total.toFixed(2)}.\n\nItems:\n${quote.items.map(i => `- ${i.description}: $${(i.quantity * i.price).toFixed(2)}`).join('\n')}\n\nTotal: $${total.toFixed(2)}\n\nThank you for your business!\n\nPool Authority`;
      window.open(`mailto:${customer.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`);
    }
  };

  // Invoice generation
  const downloadInvoice = (customer, yearMonth) => {
    const services = getMonthServices(customer.id, yearMonth);
    const total = services.reduce((sum, s) => sum + s.totalAmount, 0);
    const totalChemicals = services.reduce((sum, s) => sum + (s.chemicalCost || 0), 0);
    const monthName = new Date(yearMonth + '-01').toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    
    const html = `<!DOCTYPE html>
<html><head><style>
  body { font-family: 'Segoe UI', Arial, sans-serif; max-width: 800px; margin: 40px auto; padding: 20px; color: #1e3a5f; }
  .header { background: linear-gradient(135deg, #1e3a5f 0%, #2d5a87 100%); color: white; padding: 30px; border-radius: 12px; margin-bottom: 30px; display: flex; align-items: center; gap: 20px; }
  .header h1 { margin: 0 0 5px 0; font-size: 28px; }
  .logo { width: 60px; height: 60px; }
  .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 30px; margin-bottom: 30px; }
  .info-box h3 { margin: 0 0 10px 0; color: #1e3a5f; font-size: 14px; text-transform: uppercase; letter-spacing: 1px; }
  .info-box p { margin: 5px 0; color: #4a5568; }
  table { width: 100%; border-collapse: collapse; margin: 20px 0; }
  th { background: #1e3a5f; color: white; padding: 12px; text-align: left; }
  td { padding: 12px; border-bottom: 1px solid #e2e8f0; }
  .chemicals-detail { font-size: 12px; color: #0d9488; margin-top: 4px; }
  .chemical-item { background: #f0fdfa; padding: 2px 6px; border-radius: 4px; margin-right: 4px; display: inline-block; margin-top: 2px; }
  .subtotal-row { background: #f8fafc; }
  .total-box { background: linear-gradient(135deg, #1e3a5f 0%, #2d5a87 100%); color: white; padding: 20px 30px; border-radius: 12px; text-align: right; }
  .total-box span { font-size: 14px; opacity: 0.9; }
  .total-box div { font-size: 32px; font-weight: bold; margin-top: 5px; }
  .summary-box { background: #f0f9ff; padding: 15px; border-radius: 8px; margin-bottom: 20px; }
</style></head>
<body>
  <div class="header">
    <svg viewBox="0 0 100 110" class="logo">
      <path d="M50 5 L90 25 L90 70 Q90 95 50 105 Q10 95 10 70 L10 25 Z" fill="#5bb4d8"/>
      <path d="M50 12 L83 28 L83 68 Q83 88 50 98 Q17 88 17 68 L17 28 Z" fill="white" opacity="0.3"/>
      <path d="M20 35 Q35 40 50 35 Q65 30 80 35" stroke="white" stroke-width="2" fill="none" opacity="0.8"/>
      <path d="M20 48 Q35 53 50 48 Q65 43 80 48" stroke="white" stroke-width="2" fill="none" opacity="0.8"/>
      <path d="M20 61 Q35 66 50 61 Q65 56 80 61" stroke="white" stroke-width="2" fill="none" opacity="0.8"/>
    </svg>
    <div>
      <h1>POOL AUTHORITY</h1>
      <p style="margin:0;opacity:0.9;">Monthly Service Invoice</p>
    </div>
  </div>
  <h2 style="color:#1e3a5f;">Invoice - ${monthName}</h2>
  <div class="info-grid">
    <div class="info-box">
      <h3>Bill To</h3>
      <p><strong>${customer.name}</strong></p>
      <p>${customer.address}</p>
      ${customer.phone ? `<p>${customer.phone}</p>` : ''}
      ${customer.email ? `<p>${customer.email}</p>` : ''}
    </div>
    <div class="info-box">
      <h3>Service Details</h3>
      <p>Pool Type: ${customer.poolType}</p>
      <p>Weekly Rate: $${customer.weeklyRate}</p>
      <p>Services This Month: ${services.length}</p>
    </div>
  </div>
  <table>
    <tr><th>Date</th><th>Service</th><th>Chemicals</th><th>Total</th></tr>
    ${services.map(s => `
      <tr>
        <td>${new Date(s.date).toLocaleDateString()}</td>
        <td>
          Weekly Service - $${s.weeklyRate.toFixed(2)}
        </td>
        <td>
          $${(s.chemicalCost || 0).toFixed(2)}
          ${s.chemicalsUsed && s.chemicalsUsed.length > 0 ? `
            <div class="chemicals-detail">
              ${s.chemicalsUsed.map(c => `<span class="chemical-item">${c.name}: ${c.quantity} ${c.unit}</span>`).join('')}
            </div>
          ` : ''}
        </td>
        <td><strong>$${s.totalAmount.toFixed(2)}</strong></td>
      </tr>
    `).join('')}
    <tr class="subtotal-row">
      <td colspan="2" style="text-align:right;"><strong>Service Subtotal:</strong></td>
      <td colspan="2"><strong>$${services.reduce((sum, s) => sum + s.weeklyRate, 0).toFixed(2)}</strong></td>
    </tr>
    <tr class="subtotal-row">
      <td colspan="2" style="text-align:right;"><strong>Chemicals Subtotal:</strong></td>
      <td colspan="2"><strong>$${totalChemicals.toFixed(2)}</strong></td>
    </tr>
  </table>
  <div class="total-box">
    <span>Amount Due</span>
    <div>$${total.toFixed(2)}</div>
  </div>
  <p style="text-align:center;margin-top:30px;color:#666;">Thank you for choosing Pool Authority!</p>
</body></html>`;

    const blob = new Blob([html], { type: 'text/html' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `PoolAuthority-Invoice-${customer.name.replace(/\s+/g, '-')}-${yearMonth}.html`;
    a.click();
  };

  // Chemical functions
  const addChemical = () => {
    if (newChemical.name) {
      saveChemicals([...chemicalInventory, { ...newChemical, id: Date.now() }]);
      setNewChemical({ name: '', quantity: 0, unit: 'lbs', costPerUnit: 0 });
      setShowAddChemical(false);
    }
  };

  // Edit chemical in inventory
  const updateChemical = () => {
    if (editingChemical) {
      saveChemicals(chemicalInventory.map(c => c.id === editingChemical.id ? editingChemical : c));
      setEditingChemical(null);
    }
  };

  const deleteChemical = (id) => {
    if (confirm('Delete this chemical from inventory?')) {
      saveChemicals(chemicalInventory.filter(c => c.id !== id));
    }
  };

  // Edit service history entry
  const openEditServiceModal = (service) => {
    setEditingService({ ...service });
    setShowEditServiceModal(true);
  };

  const updateService = () => {
    if (editingService) {
      // Recalculate total
      const chemicalCost = editingService.chemicalsUsed?.reduce((sum, c) => sum + (c.quantity * c.costPerUnit), 0) || editingService.chemicalCost || 0;
      const updatedService = {
        ...editingService,
        chemicalCost,
        totalAmount: editingService.weeklyRate + chemicalCost
      };
      saveHistory(serviceHistory.map(s => s.id === editingService.id ? updatedService : s));
      setShowEditServiceModal(false);
      setEditingService(null);
    }
  };

  const deleteService = (serviceId) => {
    if (confirm('Delete this service record? This cannot be undone.')) {
      saveHistory(serviceHistory.filter(s => s.id !== serviceId));
    }
  };

  // Add/edit chemical in a service record
  const addChemicalToEditingService = (chemical, quantity) => {
    if (!editingService || quantity <= 0) return;
    const chemicalsUsed = editingService.chemicalsUsed || [];
    const existingIndex = chemicalsUsed.findIndex(c => c.id === chemical.id);
    
    let updatedChemicals;
    if (existingIndex >= 0) {
      updatedChemicals = chemicalsUsed.map((c, i) => 
        i === existingIndex ? { ...c, quantity: c.quantity + quantity, totalCost: (c.quantity + quantity) * c.costPerUnit } : c
      );
    } else {
      updatedChemicals = [...chemicalsUsed, {
        id: chemical.id,
        name: chemical.name,
        quantity: quantity,
        unit: chemical.unit,
        costPerUnit: chemical.costPerUnit,
        totalCost: quantity * chemical.costPerUnit
      }];
    }
    
    const newChemicalCost = updatedChemicals.reduce((sum, c) => sum + c.totalCost, 0);
    setEditingService({
      ...editingService,
      chemicalsUsed: updatedChemicals,
      chemicalCost: newChemicalCost,
      totalAmount: editingService.weeklyRate + newChemicalCost
    });
  };

  const removeChemicalFromEditingService = (chemicalId) => {
    if (!editingService) return;
    const updatedChemicals = (editingService.chemicalsUsed || []).filter(c => c.id !== chemicalId);
    const newChemicalCost = updatedChemicals.reduce((sum, c) => sum + c.totalCost, 0);
    setEditingService({
      ...editingService,
      chemicalsUsed: updatedChemicals,
      chemicalCost: newChemicalCost,
      totalAmount: editingService.weeklyRate + newChemicalCost
    });
  };

  // Open customer billing detail view
  const openCustomerBillingDetail = (customer) => {
    const services = getMonthServices(customer.id, invoiceMonth);
    setSelectedCustomerBilling({ customer, services });
    setBillingAdjustments([]);
  };

  // Add manual adjustment to bill
  const addBillingAdjustment = (description, amount) => {
    if (description && amount !== 0) {
      setBillingAdjustments([...billingAdjustments, { id: Date.now(), description, amount }]);
    }
  };

  const removeBillingAdjustment = (id) => {
    setBillingAdjustments(billingAdjustments.filter(a => a.id !== id));
  };

  // Job functions
  const addJob = () => {
    if (newJob.customerId && newJob.date) {
      const customer = customers.find(c => c.id === parseInt(newJob.customerId));
      saveJobs([...oneTimeJobs, { ...newJob, id: Date.now(), customerName: customer?.name || 'Unknown' }]);
      setNewJob({ customerId: '', jobType: 'opening', date: '', price: 250, notes: '' });
      setShowAddJob(false);
    }
  };

  // Open job completion modal
  const openCompleteJobModal = (job) => {
    setJobToComplete(job);
    setJobCompletionItems([]);
    setJobChemicals([]);
    setShowCompleteJobModal(true);
  };

  // Add wear item to job completion
  const addWearItemToJob = (item, quantity = 1) => {
    const existingIndex = jobCompletionItems.findIndex(i => i.id === item.id);
    if (existingIndex >= 0) {
      const updated = [...jobCompletionItems];
      updated[existingIndex].quantity += quantity;
      setJobCompletionItems(updated);
    } else {
      setJobCompletionItems([...jobCompletionItems, { ...item, quantity }]);
    }
  };

  // Add custom item to job completion
  const addCustomItemToJob = (name, price) => {
    if (name && price > 0) {
      setJobCompletionItems([...jobCompletionItems, { id: Date.now(), name, price, quantity: 1, isCustom: true }]);
    }
  };

  // Remove item from job completion
  const removeItemFromJob = (itemId) => {
    setJobCompletionItems(jobCompletionItems.filter(i => i.id !== itemId));
  };

  // Add chemical to job completion
  const addChemicalToJob = (chemical, quantity) => {
    if (quantity <= 0) return;
    const existingIndex = jobChemicals.findIndex(c => c.id === chemical.id);
    if (existingIndex >= 0) {
      const updated = [...jobChemicals];
      updated[existingIndex].quantityUsed += quantity;
      setJobChemicals(updated);
    } else {
      setJobChemicals([...jobChemicals, { ...chemical, quantityUsed: quantity }]);
    }
  };

  // Remove chemical from job completion
  const removeChemicalFromJob = (chemicalId) => {
    setJobChemicals(jobChemicals.filter(c => c.id !== chemicalId));
  };

  // Complete job with additional items and chemicals
  const completeJobWithItems = () => {
    if (!jobToComplete) return;
    
    const additionalCost = jobCompletionItems.reduce((sum, i) => sum + (i.price * i.quantity), 0);
    const chemicalCost = jobChemicals.reduce((sum, c) => sum + (c.quantityUsed * c.costPerUnit), 0);
    
    const itemsUsed = jobCompletionItems.map(i => ({
      id: i.id,
      name: i.name,
      price: i.price,
      quantity: i.quantity,
      totalCost: i.price * i.quantity
    }));
    
    const chemicalsUsed = jobChemicals.map(c => ({
      id: c.id,
      name: c.name,
      quantity: c.quantityUsed,
      unit: c.unit,
      costPerUnit: c.costPerUnit,
      totalCost: c.quantityUsed * c.costPerUnit
    }));
    
    const service = {
      id: Date.now(),
      customerId: parseInt(jobToComplete.customerId),
      customerName: jobToComplete.customerName,
      date: new Date().toISOString(),
      weeklyRate: jobToComplete.price,
      chemicalCost: chemicalCost,
      chemicalsUsed: chemicalsUsed,
      additionalItemsCost: additionalCost,
      additionalItems: itemsUsed,
      totalAmount: jobToComplete.price + additionalCost + chemicalCost,
      poolType: jobToComplete.jobType,
      jobNotes: jobToComplete.notes
    };
    saveHistory([service, ...serviceHistory]);
    saveJobs(oneTimeJobs.filter(j => j.id !== jobToComplete.id));
    
    // Update chemical inventory
    const updatedChemicals = chemicalInventory.map(chem => {
      const used = jobChemicals.find(c => c.id === chem.id);
      if (used) {
        return { ...chem, quantity: Math.max(0, chem.quantity - used.quantityUsed) };
      }
      return chem;
    });
    saveChemicals(updatedChemicals);
    
    setShowCompleteJobModal(false);
    setJobToComplete(null);
    setJobCompletionItems([]);
    setJobChemicals([]);
  };

  // Legacy completeJob - now opens modal
  const completeJob = (job) => {
    openCompleteJobModal(job);
  };

  // Wear item management
  const addWearItem = () => {
    if (newWearItem.name && newWearItem.price > 0) {
      saveWearItems([...wearItems, { ...newWearItem, id: Date.now() }]);
      setNewWearItem({ name: '', price: 0, description: '' });
    }
  };

  const deleteWearItem = (id) => {
    saveWearItems(wearItems.filter(w => w.id !== id));
  };

  // Stats
  const totalRevenue = serviceHistory.reduce((sum, s) => sum + s.totalAmount, 0);
  const thisMonthRevenue = serviceHistory
    .filter(s => s.date.startsWith(new Date().toISOString().slice(0, 7)))
    .reduce((sum, s) => sum + s.totalAmount, 0);
  const todayServices = serviceHistory.filter(s => s.date.startsWith(selectedDate)).length;

  // Tab config
  const tabs = [
    { key: 'home', label: 'Home', icon: Icons.Home },
    { key: 'calendar', label: 'Calendar', icon: Icons.Calendar },
    { key: 'routes', label: 'Routes', icon: Icons.Map },
    { key: 'customers', label: 'Customers', icon: Icons.Users },
    { key: 'recurring', label: 'Recurring', icon: Icons.History },
    { key: 'jobs', label: 'Jobs', icon: Icons.Wrench },
    { key: 'quotes', label: 'Quotes', icon: Icons.FileText },
    { key: 'billing', label: 'Billing', icon: Icons.Receipt },
    { key: 'payments', label: 'Payments', icon: Icons.CreditCard },
    { key: 'chemicals', label: 'Chemicals', icon: Icons.Beaker },
    { key: 'history', label: 'History', icon: Icons.DollarSign },
    { key: 'settings', label: 'Settings', icon: Icons.Settings },
  ];

  return (
    <div className="min-h-screen pb-8" style={{ background: 'linear-gradient(180deg, #f0f9ff 0%, #e0f2fe 100%)' }}>
      {/* Header */}
      <div className="bg-white shadow-lg border-b-4 sticky top-0 z-40" style={{ borderColor: '#5bb4d8' }}>
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center gap-4">
          {/* Pool Authority Shield Logo */}
          <svg viewBox="0 0 100 110" className="w-14 h-14">
            <path d="M50 5 L90 25 L90 70 Q90 95 50 105 Q10 95 10 70 L10 25 Z" fill="#1e3a5f" stroke="#1e3a5f" strokeWidth="2"/>
            <path d="M50 12 L83 28 L83 68 Q83 88 50 98 Q17 88 17 68 L17 28 Z" fill="#5bb4d8"/>
            <path d="M20 35 Q35 40 50 35 Q65 30 80 35" stroke="white" strokeWidth="2.5" fill="none" opacity="0.7"/>
            <path d="M20 48 Q35 53 50 48 Q65 43 80 48" stroke="white" strokeWidth="2.5" fill="none" opacity="0.7"/>
            <path d="M20 61 Q35 66 50 61 Q65 56 80 61" stroke="white" strokeWidth="2.5" fill="none" opacity="0.7"/>
            <path d="M25 74 Q40 79 55 74 Q70 69 78 74" stroke="white" strokeWidth="2.5" fill="none" opacity="0.7"/>
            <path d="M35 85 Q45 88 55 85 Q65 82 70 85" stroke="white" strokeWidth="2" fill="none" opacity="0.6"/>
          </svg>
          <div>
            <h1 className="text-2xl font-black tracking-tight">
              <span style={{ color: '#1e3a5f' }}>POOL</span>
              <span style={{ color: '#9b3544' }}> AUTHORITY</span>
            </h1>
            <p className="text-sm text-gray-500">Professional Pool Service Management</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="max-w-6xl mx-auto px-4 py-4">
        <div className="flex gap-1 bg-white rounded-xl p-1.5 shadow-md overflow-x-auto">
          {tabs.map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                activeTab === key
                  ? 'text-white shadow-md'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
              style={activeTab === key ? { background: 'linear-gradient(135deg, #1e3a5f 0%, #0ea5e9 100%)' } : {}}
            >
              <Icon />
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 pb-8">
        
        {/* HOME TAB */}
        {activeTab === 'home' && (
          <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-white rounded-xl p-6 shadow-lg border-l-4" style={{ borderColor: '#22c55e' }}>
                <div className="text-sm text-gray-500 font-medium">Total Revenue</div>
                <div className="text-3xl font-black text-gray-800">${totalRevenue.toFixed(2)}</div>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-lg border-l-4" style={{ borderColor: '#0ea5e9' }}>
                <div className="text-sm text-gray-500 font-medium">This Month</div>
                <div className="text-3xl font-black text-gray-800">${thisMonthRevenue.toFixed(2)}</div>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-lg border-l-4" style={{ borderColor: '#8b5cf6' }}>
                <div className="text-sm text-gray-500 font-medium">{selectedYear} Total</div>
                <div className="text-3xl font-black text-gray-800">${getYearTotal(selectedYear).toFixed(2)}</div>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-lg border-l-4" style={{ borderColor: '#f59e0b' }}>
                <div className="text-sm text-gray-500 font-medium">Accounts Receivable</div>
                <div className="text-3xl font-black text-gray-800">
                  ${getAccountsReceivable().reduce((sum, c) => sum + c.balance, 0).toFixed(2)}
                </div>
              </div>
            </div>

            {/* Yearly Revenue Chart */}
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Yearly Revenue (5 Year History)</h2>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={getYearlyRevenueData()}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="year" stroke="#6b7280" fontSize={12} />
                  <YAxis stroke="#6b7280" fontSize={12} tickFormatter={(v) => `$${v >= 1000 ? (v/1000).toFixed(0) + 'k' : v}`} />
                  <Tooltip 
                    formatter={(value) => [`$${value.toFixed(2)}`, 'Revenue']}
                    contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb' }}
                  />
                  <Bar dataKey="revenue" fill="#1e3a5f" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Monthly Revenue Chart with Year Selector */}
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-800">Monthly Revenue</h2>
                <select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                  className="px-4 py-2 border rounded-lg font-medium"
                  style={{ borderColor: '#1e3a5f', color: '#1e3a5f' }}
                >
                  {getAvailableYears().map(year => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
              </div>
              <ResponsiveContainer width="100%" height={250}>
                <AreaChart data={getMonthlyRevenueData()}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#5bb4d8" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#5bb4d8" stopOpacity={0.1}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="month" stroke="#6b7280" fontSize={12} />
                  <YAxis stroke="#6b7280" fontSize={12} tickFormatter={(v) => `$${v}`} />
                  <Tooltip 
                    formatter={(value) => [`$${value.toFixed(2)}`, 'Revenue']}
                    labelFormatter={(label, payload) => payload[0]?.payload?.fullMonth + ' ' + payload[0]?.payload?.year}
                    contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb' }}
                  />
                  <Area type="monotone" dataKey="revenue" stroke="#1e3a5f" fillOpacity={1} fill="url(#colorRevenue)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Weekly Revenue Chart */}
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Weekly Revenue (Last 8 Weeks)</h2>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={getWeeklyRevenueData()}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="week" stroke="#6b7280" fontSize={12} />
                  <YAxis stroke="#6b7280" fontSize={12} tickFormatter={(v) => `$${v}`} />
                  <Tooltip 
                    formatter={(value) => [`$${value.toFixed(2)}`, 'Revenue']}
                    contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb' }}
                  />
                  <Bar dataKey="revenue" fill="#22c55e" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Accounts Receivable Section */}
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Accounts Receivable</h2>
              {getAccountsReceivable().length > 0 ? (
                <div className="space-y-3">
                  {getAccountsReceivable().map(account => (
                    <div key={account.id} className="flex items-center justify-between p-4 bg-amber-50 rounded-lg border-l-4 border-amber-500">
                      <div>
                        <div className="font-bold text-gray-800">{account.name}</div>
                        <div className="text-sm text-gray-500">
                          Services: ${account.totalServices.toFixed(2)} | Paid: ${account.totalPaid.toFixed(2)}
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="text-xl font-bold text-amber-600">${account.balance.toFixed(2)}</div>
                        <button
                          onClick={() => markInvoicePaid(account.id, account.balance)}
                          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm"
                        >
                          Mark Paid
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-8">No outstanding balances! 🎉</p>
              )}
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Quick Actions</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <button onClick={() => { setActiveTab('customers'); setShowAddCustomer(true); }} className="p-4 bg-blue-50 rounded-xl hover:bg-blue-100 transition-all text-center">
                  <Icons.Plus />
                  <div className="text-sm font-medium text-gray-700 mt-2">Add Customer</div>
                </button>
                <button onClick={() => setActiveTab('routes')} className="p-4 bg-green-50 rounded-xl hover:bg-green-100 transition-all text-center">
                  <Icons.Map />
                  <div className="text-sm font-medium text-gray-700 mt-2">Plan Route</div>
                </button>
                <button onClick={() => { setActiveTab('jobs'); setShowAddJob(true); }} className="p-4 bg-purple-50 rounded-xl hover:bg-purple-100 transition-all text-center">
                  <Icons.Wrench />
                  <div className="text-sm font-medium text-gray-700 mt-2">Add Job</div>
                </button>
                <button onClick={() => setActiveTab('calendar')} className="p-4 bg-cyan-50 rounded-xl hover:bg-cyan-100 transition-all text-center">
                  <Icons.Calendar />
                  <div className="text-sm font-medium text-gray-700 mt-2">Calendar</div>
                </button>
              </div>
            </div>

            {/* Upcoming Jobs */}
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Upcoming Jobs</h2>
              {oneTimeJobs.length > 0 ? (
                <div className="space-y-3">
                  {oneTimeJobs.slice(0, 5).map(job => (
                    <div key={job.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <div className="font-bold">{job.customerName}</div>
                        <div className="text-sm text-gray-500">{job.jobType} • {new Date(job.date).toLocaleDateString()}</div>
                      </div>
                      <div className="font-bold text-green-600">${job.price}</div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-8">No upcoming jobs scheduled</p>
              )}
            </div>
          </div>
        )}

        {/* CALENDAR TAB */}
        {activeTab === 'calendar' && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl p-6 shadow-lg">
              {/* Calendar Header */}
              <div className="flex items-center justify-between mb-6">
                <button
                  onClick={() => setCalendarDate(new Date(calendarDate.getFullYear(), calendarDate.getMonth() - 1))}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <Icons.ChevronLeft />
                </button>
                <h2 className="text-2xl font-bold text-gray-800">
                  {monthNames[calendarDate.getMonth()]} {calendarDate.getFullYear()}
                </h2>
                <button
                  onClick={() => setCalendarDate(new Date(calendarDate.getFullYear(), calendarDate.getMonth() + 1))}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <Icons.ChevronRight />
                </button>
              </div>

              {/* Calendar Grid */}
              <div className="grid grid-cols-7 gap-1">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                  <div key={day} className="p-2 text-center text-sm font-bold text-gray-500">
                    {day}
                  </div>
                ))}
                {(() => {
                  const { year, month, firstDay, daysInMonth } = getDaysInMonth(calendarDate);
                  const days = [];
                  
                  // Empty cells for days before the 1st
                  for (let i = 0; i < firstDay; i++) {
                    days.push(<div key={`empty-${i}`} className="p-2 h-24" />);
                  }
                  
                  // Days of the month
                  for (let day = 1; day <= daysInMonth; day++) {
                    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                    const events = getEventsForDate(dateStr);
                    const isToday = dateStr === new Date().toISOString().split('T')[0];
                    const isSelected = dateStr === selectedDate;
                    const hasEvents = events.jobs.length > 0 || events.recurring.length > 0 || events.completed.length > 0;
                    
                    days.push(
                      <div
                        key={day}
                        onClick={() => setSelectedDate(dateStr)}
                        className={`p-2 h-24 border rounded-lg cursor-pointer transition-all overflow-hidden ${
                          isSelected ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-blue-300'
                        } ${isToday ? 'bg-cyan-50' : ''}`}
                      >
                        <div className={`text-sm font-bold mb-1 ${isToday ? 'text-cyan-600' : 'text-gray-700'}`}>
                          {day}
                        </div>
                        <div className="space-y-0.5">
                          {events.jobs.slice(0, 2).map(job => (
                            <div key={job.id} className="text-xs bg-purple-100 text-purple-700 px-1 rounded truncate">
                              {job.jobType}
                            </div>
                          ))}
                          {events.recurring.slice(0, 2).map(r => {
                            const customer = customers.find(c => c.id === r.customerId);
                            return customer ? (
                              <div key={r.id} className="text-xs bg-blue-100 text-blue-700 px-1 rounded truncate">
                                {customer.name}
                              </div>
                            ) : null;
                          })}
                          {events.completed.length > 0 && (
                            <div className="text-xs bg-green-100 text-green-700 px-1 rounded">
                              ✓ {events.completed.length} done
                            </div>
                          )}
                          {hasEvents && (events.jobs.length + events.recurring.length) > 2 && (
                            <div className="text-xs text-gray-500">
                              +{(events.jobs.length + events.recurring.length) - 2} more
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  }
                  
                  return days;
                })()}
              </div>
            </div>

            {/* Selected Day Details */}
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <h3 className="text-xl font-bold text-gray-800 mb-4">
                {new Date(selectedDate).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
              </h3>
              {(() => {
                const events = getEventsForDate(selectedDate);
                const hasAny = events.jobs.length > 0 || events.recurring.length > 0 || events.completed.length > 0;
                
                if (!hasAny) {
                  return <p className="text-gray-500 text-center py-8">No events scheduled for this day</p>;
                }
                
                return (
                  <div className="space-y-4">
                    {events.jobs.length > 0 && (
                      <div>
                        <h4 className="text-sm font-bold text-purple-700 mb-2">ONE-TIME JOBS</h4>
                        <div className="space-y-2">
                          {events.jobs.map(job => (
                            <div key={job.id} className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                              <div>
                                <span className="text-xs font-bold text-purple-700 bg-purple-200 px-2 py-0.5 rounded mr-2">
                                  {job.jobType.toUpperCase()}
                                </span>
                                <span className="font-medium">{job.customerName}</span>
                              </div>
                              <div className="flex items-center gap-3">
                                <span className="font-bold text-green-600">${job.price}</span>
                                <button
                                  onClick={() => completeJob(job)}
                                  className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700"
                                >
                                  Complete
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {events.recurring.length > 0 && (
                      <div>
                        <h4 className="text-sm font-bold text-blue-700 mb-2">RECURRING SERVICES</h4>
                        <div className="space-y-2">
                          {events.recurring.map(r => {
                            const customer = customers.find(c => c.id === r.customerId);
                            if (!customer) return null;
                            return (
                              <div key={r.id} className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                                <div>
                                  <span className="text-xs font-bold text-blue-700 bg-blue-200 px-2 py-0.5 rounded mr-2">
                                    {r.frequency.toUpperCase()}
                                  </span>
                                  <span className="font-medium">{customer.name}</span>
                                  <span className="text-sm text-gray-500 ml-2">{customer.address}</span>
                                </div>
                                <div className="flex items-center gap-3">
                                  <span className="font-bold text-green-600">${customer.weeklyRate}</span>
                                  <button
                                    onClick={() => completeService(customer)}
                                    className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700"
                                  >
                                    Complete
                                  </button>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                    
                    {events.completed.length > 0 && (
                      <div>
                        <h4 className="text-sm font-bold text-green-700 mb-2">COMPLETED</h4>
                        <div className="space-y-2">
                          {events.completed.map(s => (
                            <div key={s.id} className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                              <div>
                                <span className="text-xs font-bold text-green-700 bg-green-200 px-2 py-0.5 rounded mr-2">
                                  ✓ DONE
                                </span>
                                <span className="font-medium">{s.customerName}</span>
                              </div>
                              <span className="font-bold text-green-600">${s.totalAmount.toFixed(2)}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })()}
            </div>
          </div>
        )}

        {/* ROUTES TAB */}
        {activeTab === 'routes' && (
          <div className="space-y-6">
            {/* Date Navigation */}
            <div className="bg-white rounded-xl p-4 shadow-lg">
              <div className="flex items-center justify-between">
                <button
                  onClick={() => changeRouteDate(-1)}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-all"
                >
                  <Icons.ChevronLeft />
                  Previous Day
                </button>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-800">{formatRouteDate(routeDate)}</div>
                  <div className="text-sm text-gray-500">
                    {new Date(routeDate).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
                  </div>
                  <input
                    type="date"
                    value={routeDate}
                    onChange={(e) => setRouteDate(e.target.value)}
                    className="mt-2 px-3 py-1 border rounded-lg text-sm"
                  />
                </div>
                <button
                  onClick={() => changeRouteDate(1)}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-all"
                >
                  Next Day
                  <Icons.ChevronRight />
                </button>
              </div>
              {routeDate !== new Date().toISOString().split('T')[0] && (
                <div className="mt-3 text-center">
                  <button
                    onClick={() => setRouteDate(new Date().toISOString().split('T')[0])}
                    className="text-sm text-blue-600 hover:text-blue-800 underline"
                  >
                    Jump to Today
                  </button>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Customer Selection */}
              <div className="bg-white rounded-xl p-6 shadow-lg">
                <h2 className="text-xl font-bold text-gray-800 mb-2">Add Extra Customers</h2>
                <p className="text-sm text-gray-500 mb-4">Recurring customers are auto-added. Check others to add to today's route.</p>
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {customers.map(customer => {
                    const isScheduled = routeCustomers.some(c => c.id === customer.id && (c.recurringId || c.isOneTimeJob));
                    const isInRoute = routeCustomers.some(c => c.id === customer.id);
                    return (
                      <label key={customer.id} className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all ${isScheduled ? 'bg-blue-50 border-l-4 border-blue-500' : 'hover:bg-gray-50'}`}>
                        <input
                          type="checkbox"
                          checked={isInRoute}
                          onChange={() => toggleRouteCustomer(customer)}
                          className="w-5 h-5 rounded"
                          disabled={isScheduled}
                        />
                        <div className="flex-1">
                          <div className="font-medium flex items-center gap-2">
                            {customer.name}
                            {isScheduled && (
                              <span className="text-xs bg-blue-200 text-blue-800 px-2 py-0.5 rounded">
                                {routeCustomers.find(c => c.id === customer.id)?.isOneTimeJob ? 'Job Scheduled' : 'Recurring'}
                              </span>
                            )}
                          </div>
                          <div className="text-sm text-gray-500">{customer.address}</div>
                          {customer.gateCode && <div className="text-xs text-blue-600">Gate: {customer.gateCode}</div>}
                          {customer.dogName && <div className="text-xs text-amber-600">🐕 {customer.dogName}</div>}
                        </div>
                        <div className="font-bold text-green-600">${customer.weeklyRate}</div>
                      </label>
                    );
                  })}
                  {customers.length === 0 && (
                    <p className="text-gray-500 text-center py-8">No customers yet. Add some first!</p>
                  )}
                </div>
              </div>

              {/* Route Order */}
              <div className="bg-white rounded-xl p-6 shadow-lg">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-xl font-bold text-gray-800">Route for {formatRouteDate(routeDate)}</h2>
                    <p className="text-sm text-gray-500">{routeCustomers.length} stops</p>
                  </div>
                  {routeCustomers.length > 0 && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => setShowMap(!showMap)}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all"
                      >
                        <Icons.Map />
                        {showMap ? 'Hide Map' : 'Show Map'}
                      </button>
                      <a
                        href={getGoogleMapsRouteUrl()}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all"
                      >
                        <Icons.Navigation />
                        Navigate
                      </a>
                    </div>
                  )}
                </div>

                {showMap && routeCustomers.length > 0 && (
                  <div className="mb-4 rounded-lg overflow-hidden border-2 border-gray-200">
                    <iframe
                      src={getEmbedMapUrl()}
                      width="100%"
                      height="300"
                      style={{ border: 0 }}
                      allowFullScreen
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                    />
                  </div>
                )}

                {routeCustomers.length > 0 ? (
                  <div className="space-y-2">
                    {routeCustomers.map((customer, idx) => (
                      <div key={customer.id} className={`flex items-center gap-3 p-3 rounded-lg ${customer.recurringId ? 'bg-blue-50' : customer.isOneTimeJob ? 'bg-purple-50' : 'bg-gray-50'}`}>
                        <div className="flex flex-col gap-1">
                          <button onClick={() => moveInRoute(idx, -1)} disabled={idx === 0} className="text-gray-400 hover:text-gray-600 disabled:opacity-30">▲</button>
                          <button onClick={() => moveInRoute(idx, 1)} disabled={idx === routeCustomers.length - 1} className="text-gray-400 hover:text-gray-600 disabled:opacity-30">▼</button>
                        </div>
                        <div className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold" style={{ background: customer.isOneTimeJob ? '#7c3aed' : '#1e3a5f' }}>
                          {idx + 1}
                        </div>
                        <div className="flex-1">
                          <div className="font-medium flex items-center gap-2">
                            {customer.name}
                            {customer.recurringId && (
                              <span className="text-xs bg-blue-200 text-blue-800 px-2 py-0.5 rounded capitalize">{customer.frequency}</span>
                            )}
                            {customer.isOneTimeJob && (
                              <span className="text-xs bg-purple-200 text-purple-800 px-2 py-0.5 rounded">{customer.jobType}</span>
                            )}
                          </div>
                          <div className="text-sm text-gray-500">{customer.address}</div>
                          {customer.gateCode && <span className="text-xs text-blue-600 mr-2">Gate: {customer.gateCode}</span>}
                          {customer.dogName && <span className="text-xs text-amber-600">🐕 {customer.dogName}</span>}
                        </div>
                        <div className="font-bold text-green-600">${customer.isOneTimeJob ? customer.jobPrice : customer.weeklyRate}</div>
                        <button
                          onClick={() => completeService(customer)}
                          className="px-3 py-1 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700"
                        >
                          Complete
                        </button>
                        {!customer.recurringId && !customer.isOneTimeJob && (
                          <button onClick={() => toggleRouteCustomer(customer)} className="text-red-500 hover:text-red-700">
                            <Icons.X />
                          </button>
                        )}
                      </div>
                    ))}
                    <div className="mt-4 p-4 bg-blue-50 rounded-lg border-2 border-blue-200">
                      <div className="flex justify-between items-center">
                        <div className="text-lg font-bold text-gray-800">
                          Route Total: ${routeCustomers.reduce((sum, c) => sum + (c.isOneTimeJob ? c.jobPrice : c.weeklyRate), 0)}
                        </div>
                        <div className="text-sm text-gray-600">
                          {routeCustomers.filter(c => c.recurringId).length} recurring • {routeCustomers.filter(c => c.isOneTimeJob).length} jobs • {routeCustomers.filter(c => !c.recurringId && !c.isOneTimeJob).length} extra
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-500 mb-2">No customers scheduled for {formatRouteDate(routeDate)}</p>
                    <p className="text-sm text-gray-400">Add recurring services or one-time jobs to populate routes automatically</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* CUSTOMERS TAB */}
        {activeTab === 'customers' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-800">Customers ({customers.length})</h2>
              <button
                onClick={() => setShowAddCustomer(true)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all"
              >
                <Icons.Plus />
                Add Customer
              </button>
            </div>

            {/* Add Customer Modal */}
            {showAddCustomer && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-bold">Add New Customer</h3>
                    <button onClick={() => setShowAddCustomer(false)} className="text-gray-500 hover:text-gray-700">
                      <Icons.X />
                    </button>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                      <input
                        type="text"
                        value={newCustomer.name}
                        onChange={e => setNewCustomer({ ...newCustomer, name: e.target.value })}
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="John Smith"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Address *</label>
                      <input
                        type="text"
                        value={newCustomer.address}
                        onChange={e => setNewCustomer({ ...newCustomer, address: e.target.value })}
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="123 Main St, City, State"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                        <input
                          type="tel"
                          value={newCustomer.phone}
                          onChange={e => setNewCustomer({ ...newCustomer, phone: e.target.value })}
                          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="(555) 123-4567"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                        <input
                          type="email"
                          value={newCustomer.email}
                          onChange={e => setNewCustomer({ ...newCustomer, email: e.target.value })}
                          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="john@email.com"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Pool Type</label>
                        <select
                          value={newCustomer.poolType}
                          onChange={e => setNewCustomer({ ...newCustomer, poolType: e.target.value })}
                          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value="inground">Inground</option>
                          <option value="above-ground">Above Ground</option>
                          <option value="saltwater">Saltwater</option>
                          <option value="hot-tub">Hot Tub</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Weekly Rate ($)</label>
                        <input
                          type="number"
                          value={newCustomer.weeklyRate}
                          onChange={e => setNewCustomer({ ...newCustomer, weeklyRate: parseInt(e.target.value) || 0 })}
                          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Gate Code</label>
                        <input
                          type="text"
                          value={newCustomer.gateCode}
                          onChange={e => setNewCustomer({ ...newCustomer, gateCode: e.target.value })}
                          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="#1234"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Dog's Name</label>
                        <input
                          type="text"
                          value={newCustomer.dogName}
                          onChange={e => setNewCustomer({ ...newCustomer, dogName: e.target.value })}
                          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Buddy"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                      <textarea
                        value={newCustomer.notes}
                        onChange={e => setNewCustomer({ ...newCustomer, notes: e.target.value })}
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        rows="2"
                        placeholder="Any special instructions..."
                      />
                    </div>
                    <button
                      onClick={addCustomer}
                      className="w-full py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-all"
                    >
                      Add Customer
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Edit Customer Modal */}
            {editingCustomer && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-bold">Edit Customer</h3>
                    <button onClick={() => setEditingCustomer(null)} className="text-gray-500 hover:text-gray-700">
                      <Icons.X />
                    </button>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                      <input
                        type="text"
                        value={editingCustomer.name}
                        onChange={e => setEditingCustomer({ ...editingCustomer, name: e.target.value })}
                        className="w-full px-4 py-2 border rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                      <input
                        type="text"
                        value={editingCustomer.address}
                        onChange={e => setEditingCustomer({ ...editingCustomer, address: e.target.value })}
                        className="w-full px-4 py-2 border rounded-lg"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                        <input
                          type="tel"
                          value={editingCustomer.phone || ''}
                          onChange={e => setEditingCustomer({ ...editingCustomer, phone: e.target.value })}
                          className="w-full px-4 py-2 border rounded-lg"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                        <input
                          type="email"
                          value={editingCustomer.email || ''}
                          onChange={e => setEditingCustomer({ ...editingCustomer, email: e.target.value })}
                          className="w-full px-4 py-2 border rounded-lg"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Pool Type</label>
                        <select
                          value={editingCustomer.poolType}
                          onChange={e => setEditingCustomer({ ...editingCustomer, poolType: e.target.value })}
                          className="w-full px-4 py-2 border rounded-lg"
                        >
                          <option value="inground">Inground</option>
                          <option value="above-ground">Above Ground</option>
                          <option value="saltwater">Saltwater</option>
                          <option value="hot-tub">Hot Tub</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Weekly Rate ($)</label>
                        <input
                          type="number"
                          value={editingCustomer.weeklyRate}
                          onChange={e => setEditingCustomer({ ...editingCustomer, weeklyRate: parseInt(e.target.value) || 0 })}
                          className="w-full px-4 py-2 border rounded-lg"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Gate Code</label>
                        <input
                          type="text"
                          value={editingCustomer.gateCode || ''}
                          onChange={e => setEditingCustomer({ ...editingCustomer, gateCode: e.target.value })}
                          className="w-full px-4 py-2 border rounded-lg"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Dog's Name</label>
                        <input
                          type="text"
                          value={editingCustomer.dogName || ''}
                          onChange={e => setEditingCustomer({ ...editingCustomer, dogName: e.target.value })}
                          className="w-full px-4 py-2 border rounded-lg"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                      <textarea
                        value={editingCustomer.notes || ''}
                        onChange={e => setEditingCustomer({ ...editingCustomer, notes: e.target.value })}
                        className="w-full px-4 py-2 border rounded-lg"
                        rows="2"
                      />
                    </div>
                    <button
                      onClick={updateCustomer}
                      className="w-full py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700"
                    >
                      Update Customer
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Customer Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {customers.map(customer => (
                <div key={customer.id} className="bg-white rounded-xl p-5 shadow-lg border-l-4" style={{ borderColor: '#0ea5e9' }}>
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="text-lg font-bold text-gray-800">{customer.name}</h3>
                      <p className="text-sm text-gray-500 flex items-center gap-1">
                        <Icons.MapPin />
                        {customer.address}
                      </p>
                    </div>
                    <div className="text-xl font-black text-green-600">${customer.weeklyRate}/wk</div>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-sm mb-3">
                    <div><span className="text-gray-500">Pool:</span> {customer.poolType}</div>
                    {customer.phone && <div><span className="text-gray-500">Phone:</span> {customer.phone}</div>}
                    {customer.gateCode && <div className="text-blue-600">🔑 Gate: {customer.gateCode}</div>}
                    {customer.dogName && <div className="text-amber-600">🐕 {customer.dogName}</div>}
                  </div>
                  {customer.notes && <p className="text-sm text-gray-600 italic mb-3">{customer.notes}</p>}
                  <div className="flex gap-2">
                    <button
                      onClick={() => setEditingCustomer(customer)}
                      className="flex-1 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-all text-sm font-medium"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => completeService(customer)}
                      className="flex-1 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-all text-sm font-medium"
                    >
                      Log Service
                    </button>
                    <button
                      onClick={() => deleteCustomer(customer.id)}
                      className="px-3 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-all"
                    >
                      <Icons.Trash />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {customers.length === 0 && (
              <div className="bg-white rounded-xl p-12 shadow-lg text-center">
                <div className="text-6xl mb-4">🏊</div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">No customers yet</h3>
                <p className="text-gray-500 mb-4">Add your first customer to get started!</p>
                <button
                  onClick={() => setShowAddCustomer(true)}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all"
                >
                  Add First Customer
                </button>
              </div>
            )}
          </div>
        )}

        {/* RECURRING TAB */}
        {activeTab === 'recurring' && (
          <div className="space-y-6">
            {/* Add Recurring Service */}
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Set Up Recurring Service</h2>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Customer</label>
                  <select
                    id="recurringCustomer"
                    className="w-full px-4 py-2 border rounded-lg"
                  >
                    <option value="">Select customer...</option>
                    {customers.filter(c => !recurringServices.find(r => r.customerId === c.id && r.active)).map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Frequency</label>
                  <select id="recurringFrequency" className="w-full px-4 py-2 border rounded-lg">
                    <option value="weekly">Weekly</option>
                    <option value="biweekly">Bi-Weekly</option>
                    <option value="monthly">Monthly</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Day of Week</label>
                  <select id="recurringDay" className="w-full px-4 py-2 border rounded-lg">
                    <option value="1">Monday</option>
                    <option value="2">Tuesday</option>
                    <option value="3">Wednesday</option>
                    <option value="4">Thursday</option>
                    <option value="5">Friday</option>
                    <option value="6">Saturday</option>
                    <option value="0">Sunday</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                  <input
                    type="date"
                    id="recurringStart"
                    defaultValue={new Date().toISOString().split('T')[0]}
                    className="w-full px-4 py-2 border rounded-lg"
                  />
                </div>
              </div>
              <button
                onClick={() => {
                  const customerId = parseInt(document.getElementById('recurringCustomer').value);
                  const frequency = document.getElementById('recurringFrequency').value;
                  const dayOfWeek = document.getElementById('recurringDay').value;
                  const startDate = document.getElementById('recurringStart').value;
                  if (customerId) {
                    addRecurringService(customerId, frequency, dayOfWeek, startDate);
                    document.getElementById('recurringCustomer').value = '';
                  }
                }}
                className="mt-4 px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
              >
                Add Recurring Service
              </button>
            </div>

            {/* Active Recurring Services */}
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Active Recurring Schedules</h2>
              {recurringServices.filter(r => r.active).length > 0 ? (
                <div className="space-y-3">
                  {recurringServices.filter(r => r.active).map(recurring => {
                    const customer = customers.find(c => c.id === recurring.customerId);
                    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
                    return (
                      <div key={recurring.id} className="flex items-center justify-between p-4 bg-purple-50 rounded-lg border-l-4 border-purple-500">
                        <div>
                          <div className="font-bold text-gray-800">{recurring.customerName}</div>
                          <div className="text-sm text-gray-600">
                            <span className="font-medium text-purple-700 capitalize">{recurring.frequency}</span>
                            {' on '}{dayNames[recurring.dayOfWeek || 1]}
                            <span className="mx-2">•</span>
                            Started: {new Date(recurring.startDate).toLocaleDateString()}
                          </div>
                          {customer && (
                            <div className="text-sm text-green-600 font-medium">${customer.weeklyRate}/visit</div>
                          )}
                        </div>
                        <button
                          onClick={() => deleteRecurringService(recurring.id)}
                          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                        >
                          Cancel
                        </button>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-12 text-gray-500">
                  <Icons.Calendar />
                  <p className="mt-2">No recurring services set up yet</p>
                  <p className="text-sm">Add customers to recurring schedules above</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* QUOTES TAB */}
        {activeTab === 'quotes' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-800">Quotes</h2>
              <button
                onClick={() => setShowCreateQuote(true)}
                className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
              >
                <Icons.Plus />
                Create Quote
              </button>
            </div>

            {/* Create Quote Modal */}
            {showCreateQuote && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-bold">Create Quote</h3>
                    <button onClick={() => setShowCreateQuote(false)} className="text-gray-500 hover:text-gray-700">
                      <Icons.X />
                    </button>
                  </div>

                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Customer</label>
                        <select
                          value={currentQuote.customerId}
                          onChange={e => setCurrentQuote({ ...currentQuote, customerId: e.target.value })}
                          className="w-full px-4 py-2 border rounded-lg"
                        >
                          <option value="">Select customer...</option>
                          {customers.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Valid For (Days)</label>
                        <input
                          type="number"
                          value={currentQuote.validDays}
                          onChange={e => setCurrentQuote({ ...currentQuote, validDays: parseInt(e.target.value) || 30 })}
                          className="w-full px-4 py-2 border rounded-lg"
                        />
                      </div>
                    </div>

                    {/* Add Line Item */}
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-medium mb-3">Add Line Item</h4>
                      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                        <select
                          value={newLineItem.type}
                          onChange={e => setNewLineItem({ ...newLineItem, type: e.target.value })}
                          className="px-3 py-2 border rounded-lg"
                        >
                          <option value="labor">Labor</option>
                          <option value="part">Part/Equipment</option>
                          <option value="chemical">Chemical</option>
                          <option value="other">Other</option>
                        </select>
                        <input
                          type="text"
                          placeholder="Description"
                          value={newLineItem.description}
                          onChange={e => setNewLineItem({ ...newLineItem, description: e.target.value })}
                          className="px-3 py-2 border rounded-lg col-span-2"
                        />
                        <input
                          type="text"
                          placeholder="Model/Part #"
                          value={newLineItem.modelNumber}
                          onChange={e => setNewLineItem({ ...newLineItem, modelNumber: e.target.value })}
                          className="px-3 py-2 border rounded-lg"
                        />
                        <div className="flex gap-2">
                          <input
                            type="number"
                            placeholder="Qty"
                            value={newLineItem.quantity}
                            onChange={e => setNewLineItem({ ...newLineItem, quantity: parseInt(e.target.value) || 1 })}
                            className="px-3 py-2 border rounded-lg w-16"
                          />
                          <input
                            type="number"
                            placeholder="Price"
                            value={newLineItem.price}
                            onChange={e => setNewLineItem({ ...newLineItem, price: parseFloat(e.target.value) || 0 })}
                            className="px-3 py-2 border rounded-lg flex-1"
                          />
                        </div>
                      </div>
                      <button
                        onClick={() => addLineItem(currentQuote, setCurrentQuote)}
                        className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                      >
                        Add Item
                      </button>
                    </div>

                    {/* Line Items List */}
                    {currentQuote.items.length > 0 && (
                      <div className="border rounded-lg overflow-hidden">
                        <table className="w-full">
                          <thead className="bg-gray-50">
                            <tr>
                              <th className="px-4 py-2 text-left text-sm font-medium">Description</th>
                              <th className="px-4 py-2 text-left text-sm font-medium">Qty</th>
                              <th className="px-4 py-2 text-left text-sm font-medium">Price</th>
                              <th className="px-4 py-2 text-left text-sm font-medium">Total</th>
                              <th className="px-4 py-2"></th>
                            </tr>
                          </thead>
                          <tbody>
                            {currentQuote.items.map(item => (
                              <tr key={item.id} className="border-t">
                                <td className="px-4 py-2">
                                  <span className="text-xs bg-gray-200 px-2 py-0.5 rounded mr-2">{item.type}</span>
                                  {item.description}
                                  {item.modelNumber && <div className="text-xs text-gray-500">Part #: {item.modelNumber}</div>}
                                </td>
                                <td className="px-4 py-2">{item.quantity}</td>
                                <td className="px-4 py-2">${item.price.toFixed(2)}</td>
                                <td className="px-4 py-2 font-medium">${(item.quantity * item.price).toFixed(2)}</td>
                                <td className="px-4 py-2">
                                  <button
                                    onClick={() => removeLineItem(currentQuote, setCurrentQuote, item.id)}
                                    className="text-red-500 hover:text-red-700"
                                  >
                                    <Icons.X />
                                  </button>
                                </td>
                              </tr>
                            ))}
                            <tr className="border-t bg-purple-50">
                              <td colSpan="3" className="px-4 py-2 font-bold text-right">Quote Total:</td>
                              <td colSpan="2" className="px-4 py-2 font-bold text-purple-700">
                                ${currentQuote.items.reduce((sum, i) => sum + (i.quantity * i.price), 0).toFixed(2)}
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    )}

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                      <textarea
                        value={currentQuote.notes}
                        onChange={e => setCurrentQuote({ ...currentQuote, notes: e.target.value })}
                        className="w-full px-4 py-2 border rounded-lg"
                        rows="2"
                        placeholder="Any additional notes for the customer..."
                      />
                    </div>

                    <button
                      onClick={generateQuote}
                      disabled={!currentQuote.customerId || currentQuote.items.length === 0}
                      className="w-full py-3 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 disabled:bg-gray-300"
                    >
                      Generate & Send Quote
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Quotes List */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Pending Quotes */}
              <div className="bg-white rounded-xl p-6 shadow-lg">
                <h3 className="text-lg font-bold text-gray-800 mb-4">Pending Quotes</h3>
                {quotes.filter(q => q.status === 'pending').length > 0 ? (
                  <div className="space-y-3">
                    {quotes.filter(q => q.status === 'pending').map(quote => (
                      <div key={quote.id} className="p-4 bg-amber-50 rounded-lg border-l-4 border-amber-500">
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="font-bold">{quote.customerName}</div>
                            <div className="text-sm text-gray-500">{quote.quoteNumber}</div>
                            <div className="text-xs text-gray-400">
                              Valid until: {new Date(quote.validUntil).toLocaleDateString()}
                            </div>
                          </div>
                          <div className="text-xl font-bold text-amber-600">${quote.total.toFixed(2)}</div>
                        </div>
                        <div className="flex gap-2 mt-3">
                          <button
                            onClick={() => convertQuoteToJob(quote)}
                            className="flex-1 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm"
                          >
                            Approve → Job
                          </button>
                          <button
                            onClick={() => convertQuoteToInvoice(quote)}
                            className="flex-1 py-2 text-white rounded-lg hover:opacity-90 text-sm"
                            style={{ backgroundColor: '#1e3a5f' }}
                          >
                            Approve → Invoice
                          </button>
                          <button
                            onClick={() => updateQuoteStatus(quote.id, 'declined')}
                            className="px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm"
                          >
                            ✕
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-8">No pending quotes</p>
                )}
              </div>

              {/* Quote History */}
              <div className="bg-white rounded-xl p-6 shadow-lg">
                <h3 className="text-lg font-bold text-gray-800 mb-4">Quote History</h3>
                {quotes.filter(q => q.status !== 'pending').length > 0 ? (
                  <div className="space-y-3">
                    {quotes.filter(q => q.status !== 'pending').map(quote => (
                      <div key={quote.id} className={`p-4 rounded-lg border-l-4 ${
                        quote.status === 'approved' ? 'bg-green-50 border-green-500' : 
                        quote.status === 'invoiced' ? 'bg-blue-50 border-blue-500' :
                        'bg-red-50 border-red-500'
                      }`}>
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="font-bold">{quote.customerName}</div>
                            <div className="text-sm text-gray-500">{quote.quoteNumber}</div>
                            <span className={`text-xs px-2 py-0.5 rounded ${
                              quote.status === 'approved' ? 'bg-green-200 text-green-800' : 
                              quote.status === 'invoiced' ? 'bg-blue-200 text-blue-800' :
                              'bg-red-200 text-red-800'
                            }`}>
                              {quote.status.toUpperCase()}
                            </span>
                          </div>
                          <div className="text-lg font-bold text-gray-600">${quote.total.toFixed(2)}</div>
                        </div>
                        {quote.status === 'approved' && (
                          <button
                            onClick={() => convertQuoteToInvoice(quote)}
                            className="mt-3 w-full py-2 text-white rounded-lg text-sm"
                            style={{ backgroundColor: '#1e3a5f' }}
                          >
                            Convert to Invoice
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-8">No quote history</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* JOBS TAB */}
        {activeTab === 'jobs' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-800">One-Time Jobs</h2>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowWearItemsSettings(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-amber-100 text-amber-800 rounded-lg hover:bg-amber-200 transition-all border border-amber-300"
                >
                  <Icons.Wrench />
                  Quick Add Items
                </button>
                <button
                  onClick={() => setShowAddJob(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-all"
                >
                  <Icons.Plus />
                  Add Job
                </button>
              </div>
            </div>

            {/* Wear Items Settings Modal */}
            {showWearItemsSettings && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-bold text-gray-800">⚙️ Common Wear Items</h3>
                    <button onClick={() => setShowWearItemsSettings(false)} className="text-gray-500 hover:text-gray-700">
                      <Icons.X />
                    </button>
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-4">
                    Save common parts and wear items here. They'll be available to quickly add when completing jobs.
                  </p>

                  {/* Add New Wear Item */}
                  <div className="bg-gray-50 p-4 rounded-lg mb-4">
                    <h4 className="font-medium text-gray-700 mb-3">Add New Item</h4>
                    <div className="space-y-3">
                      <div className="grid grid-cols-2 gap-3">
                        <input
                          type="text"
                          placeholder="Item name (e.g., O-ring)"
                          value={newWearItem.name}
                          onChange={e => setNewWearItem({ ...newWearItem, name: e.target.value })}
                          className="px-3 py-2 border rounded-lg"
                        />
                        <input
                          type="number"
                          step="0.01"
                          placeholder="Price ($)"
                          value={newWearItem.price || ''}
                          onChange={e => setNewWearItem({ ...newWearItem, price: parseFloat(e.target.value) || 0 })}
                          className="px-3 py-2 border rounded-lg"
                        />
                      </div>
                      <input
                        type="text"
                        placeholder="Description (optional)"
                        value={newWearItem.description}
                        onChange={e => setNewWearItem({ ...newWearItem, description: e.target.value })}
                        className="w-full px-3 py-2 border rounded-lg"
                      />
                      <button
                        onClick={addWearItem}
                        disabled={!newWearItem.name || newWearItem.price <= 0}
                        className="w-full py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:bg-gray-300"
                      >
                        Add Item
                      </button>
                    </div>
                  </div>

                  {/* Existing Wear Items */}
                  <div>
                    <h4 className="font-medium text-gray-700 mb-3">Saved Items ({wearItems.length})</h4>
                    {wearItems.length > 0 ? (
                      <div className="space-y-2">
                        {wearItems.map(item => (
                          <div key={item.id} className="flex items-center justify-between p-3 bg-white border rounded-lg">
                            <div>
                              <div className="font-medium text-gray-800">{item.name}</div>
                              {item.description && <div className="text-xs text-gray-500">{item.description}</div>}
                            </div>
                            <div className="flex items-center gap-3">
                              <span className="font-bold text-green-600">${item.price.toFixed(2)}</span>
                              <button
                                onClick={() => deleteWearItem(item.id)}
                                className="text-red-500 hover:text-red-700"
                              >
                                <Icons.Trash />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-center text-gray-500 py-4">No wear items saved yet</p>
                    )}
                  </div>

                  <button
                    onClick={() => setShowWearItemsSettings(false)}
                    className="w-full mt-4 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                  >
                    Done
                  </button>
                </div>
              </div>
            )}

            {/* Job Completion Modal */}
            {showCompleteJobModal && jobToComplete && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-bold text-green-700">✓ Complete Job</h3>
                    <button onClick={() => { setShowCompleteJobModal(false); setJobToComplete(null); setJobCompletionItems([]); setJobChemicals([]); }} className="text-gray-500 hover:text-gray-700">
                      <Icons.X />
                    </button>
                  </div>

                  {/* Job Info */}
                  <div className="bg-gray-50 p-4 rounded-lg mb-4">
                    <div className="font-bold text-lg">{jobToComplete.customerName}</div>
                    <div className="text-sm text-gray-600 capitalize">{jobToComplete.jobType.replace('-', ' ')}</div>
                    {jobToComplete.notes && <div className="text-sm text-gray-500 mt-1">{jobToComplete.notes}</div>}
                  </div>

                  {/* Base Price */}
                  <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg mb-4">
                    <span className="font-medium">Job Price:</span>
                    <span className="text-xl font-bold text-purple-700">${jobToComplete.price.toFixed(2)}</span>
                  </div>

                  {/* Add Wear Items */}
                  {wearItems.length > 0 && (
                    <div className="mb-4">
                      <h4 className="font-bold text-gray-700 mb-2">Quick Add Wear Items</h4>
                      <div className="flex flex-wrap gap-2">
                        {wearItems.map(item => (
                          <button
                            key={item.id}
                            onClick={() => addWearItemToJob(item)}
                            className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm flex items-center gap-1"
                          >
                            <span>{item.name}</span>
                            <span className="text-green-600 font-medium">${item.price.toFixed(2)}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Add Custom Item */}
                  <div className="mb-4 bg-gray-50 p-3 rounded-lg">
                    <h4 className="font-medium text-gray-700 mb-2">Add Custom Item</h4>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Item name"
                        className="flex-1 px-3 py-2 border rounded-lg text-sm"
                        id="customJobItemName"
                      />
                      <input
                        type="number"
                        step="0.01"
                        placeholder="Price"
                        className="w-24 px-3 py-2 border rounded-lg text-sm"
                        id="customJobItemPrice"
                      />
                      <button
                        onClick={() => {
                          const name = document.getElementById('customJobItemName').value;
                          const price = parseFloat(document.getElementById('customJobItemPrice').value) || 0;
                          if (name && price > 0) {
                            addCustomItemToJob(name, price);
                            document.getElementById('customJobItemName').value = '';
                            document.getElementById('customJobItemPrice').value = '';
                          }
                        }}
                        className="px-3 py-2 bg-purple-600 text-white rounded-lg text-sm hover:bg-purple-700"
                      >
                        Add
                      </button>
                    </div>
                  </div>

                  {/* Add Chemicals */}
                  <div className="mb-4">
                    <h4 className="font-bold text-gray-700 mb-2">Add Chemicals Used</h4>
                    {chemicalInventory.length > 0 ? (
                      <div className="space-y-2">
                        {chemicalInventory.map(chem => (
                          <div key={chem.id} className="flex items-center gap-3 p-3 bg-teal-50 rounded-lg">
                            <div className="flex-1">
                              <div className="font-medium text-gray-800">{chem.name}</div>
                              <div className="text-xs text-gray-500">
                                ${chem.costPerUnit.toFixed(2)}/{chem.unit} • {chem.quantity} {chem.unit} in stock
                              </div>
                            </div>
                            <input
                              type="number"
                              min="0"
                              max={chem.quantity}
                              step="0.1"
                              placeholder="Qty"
                              className="w-20 px-2 py-1 border rounded text-center"
                              id={`job-chem-qty-${chem.id}`}
                            />
                            <button
                              onClick={() => {
                                const input = document.getElementById(`job-chem-qty-${chem.id}`);
                                const qty = parseFloat(input.value) || 0;
                                if (qty > 0 && qty <= chem.quantity) {
                                  addChemicalToJob(chem, qty);
                                  input.value = '';
                                }
                              }}
                              className="px-3 py-1 bg-teal-600 text-white rounded hover:bg-teal-700 text-sm"
                            >
                              Add
                            </button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500 text-sm p-3 bg-gray-50 rounded-lg">
                        No chemicals in inventory. Add chemicals in the Chemicals tab.
                      </p>
                    )}
                  </div>

                  {/* Chemicals Added */}
                  {jobChemicals.length > 0 && (
                    <div className="mb-4">
                      <h4 className="font-bold text-gray-700 mb-2">Chemicals for This Job</h4>
                      <div className="border rounded-lg overflow-hidden">
                        <table className="w-full">
                          <thead className="bg-teal-50">
                            <tr>
                              <th className="px-3 py-2 text-left text-sm">Chemical</th>
                              <th className="px-3 py-2 text-left text-sm">Qty</th>
                              <th className="px-3 py-2 text-left text-sm">Cost</th>
                              <th className="px-3 py-2"></th>
                            </tr>
                          </thead>
                          <tbody>
                            {jobChemicals.map(chem => (
                              <tr key={chem.id} className="border-t">
                                <td className="px-3 py-2 text-sm">{chem.name}</td>
                                <td className="px-3 py-2 text-sm">{chem.quantityUsed} {chem.unit}</td>
                                <td className="px-3 py-2 text-sm font-medium">${(chem.quantityUsed * chem.costPerUnit).toFixed(2)}</td>
                                <td className="px-3 py-2">
                                  <button 
                                    onClick={() => removeChemicalFromJob(chem.id)}
                                    className="text-red-500 hover:text-red-700"
                                  >
                                    <Icons.X />
                                  </button>
                                </td>
                              </tr>
                            ))}
                            <tr className="border-t bg-teal-50">
                              <td colSpan="2" className="px-3 py-2 font-bold text-right">Chemical Total:</td>
                              <td colSpan="2" className="px-3 py-2 font-bold text-teal-700">
                                ${jobChemicals.reduce((sum, c) => sum + (c.quantityUsed * c.costPerUnit), 0).toFixed(2)}
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  {/* Items Added */}
                  {jobCompletionItems.length > 0 && (
                    <div className="mb-4">
                      <h4 className="font-bold text-gray-700 mb-2">Additional Items</h4>
                      <div className="border rounded-lg overflow-hidden">
                        <table className="w-full">
                          <thead className="bg-purple-50">
                            <tr>
                              <th className="px-3 py-2 text-left text-sm">Item</th>
                              <th className="px-3 py-2 text-left text-sm">Qty</th>
                              <th className="px-3 py-2 text-left text-sm">Total</th>
                              <th className="px-3 py-2"></th>
                            </tr>
                          </thead>
                          <tbody>
                            {jobCompletionItems.map(item => (
                              <tr key={item.id} className="border-t">
                                <td className="px-3 py-2 text-sm">{item.name}</td>
                                <td className="px-3 py-2 text-sm">
                                  <div className="flex items-center gap-1">
                                    <button 
                                      onClick={() => {
                                        if (item.quantity > 1) {
                                          setJobCompletionItems(jobCompletionItems.map(i => 
                                            i.id === item.id ? { ...i, quantity: i.quantity - 1 } : i
                                          ));
                                        }
                                      }}
                                      className="w-6 h-6 bg-gray-200 rounded text-sm hover:bg-gray-300"
                                    >-</button>
                                    <span className="w-6 text-center">{item.quantity}</span>
                                    <button 
                                      onClick={() => {
                                        setJobCompletionItems(jobCompletionItems.map(i => 
                                          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
                                        ));
                                      }}
                                      className="w-6 h-6 bg-gray-200 rounded text-sm hover:bg-gray-300"
                                    >+</button>
                                  </div>
                                </td>
                                <td className="px-3 py-2 text-sm font-medium">${(item.price * item.quantity).toFixed(2)}</td>
                                <td className="px-3 py-2">
                                  <button onClick={() => removeItemFromJob(item.id)} className="text-red-500 hover:text-red-700">
                                    <Icons.X />
                                  </button>
                                </td>
                              </tr>
                            ))}
                            <tr className="border-t bg-purple-50">
                              <td colSpan="2" className="px-3 py-2 font-bold text-right">Items Total:</td>
                              <td colSpan="2" className="px-3 py-2 font-bold text-purple-700">
                                ${jobCompletionItems.reduce((sum, i) => sum + (i.price * i.quantity), 0).toFixed(2)}
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  {/* Grand Total */}
                  <div className="bg-green-50 p-4 rounded-lg mb-4 border-2 border-green-200">
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="text-sm text-gray-600">Job Price</div>
                        <div className="text-sm text-gray-600">Additional Items</div>
                        <div className="text-sm text-gray-600">Chemicals</div>
                        <div className="font-bold text-lg mt-1">Grand Total</div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm">${jobToComplete.price.toFixed(2)}</div>
                        <div className="text-sm">${jobCompletionItems.reduce((sum, i) => sum + (i.price * i.quantity), 0).toFixed(2)}</div>
                        <div className="text-sm">${jobChemicals.reduce((sum, c) => sum + (c.quantityUsed * c.costPerUnit), 0).toFixed(2)}</div>
                        <div className="font-bold text-xl text-green-700">
                          ${(jobToComplete.price + jobCompletionItems.reduce((sum, i) => sum + (i.price * i.quantity), 0) + jobChemicals.reduce((sum, c) => sum + (c.quantityUsed * c.costPerUnit), 0)).toFixed(2)}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3">
                    <button
                      onClick={() => { setShowCompleteJobModal(false); setJobToComplete(null); setJobCompletionItems([]); setJobChemicals([]); }}
                      className="flex-1 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={completeJobWithItems}
                      className="flex-1 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700"
                    >
                      ✓ Complete Job
                    </button>
                  </div>
                </div>
              </div>
            )}

            {showAddJob && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-xl p-6 w-full max-w-md">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-bold">Schedule Job</h3>
                    <button onClick={() => setShowAddJob(false)} className="text-gray-500 hover:text-gray-700">
                      <Icons.X />
                    </button>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Customer</label>
                      <select
                        value={newJob.customerId}
                        onChange={e => setNewJob({ ...newJob, customerId: e.target.value })}
                        className="w-full px-4 py-2 border rounded-lg"
                      >
                        <option value="">Select customer...</option>
                        {customers.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Job Type</label>
                      <select
                        value={newJob.jobType}
                        onChange={e => setNewJob({ ...newJob, jobType: e.target.value })}
                        className="w-full px-4 py-2 border rounded-lg"
                      >
                        <option value="opening">Pool Opening</option>
                        <option value="closing">Pool Closing</option>
                        <option value="repair">Repair</option>
                        <option value="green-to-clean">Green to Clean</option>
                        <option value="equipment">Equipment Install</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                        <input
                          type="date"
                          value={newJob.date}
                          onChange={e => setNewJob({ ...newJob, date: e.target.value })}
                          className="w-full px-4 py-2 border rounded-lg"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Price ($)</label>
                        <input
                          type="number"
                          value={newJob.price}
                          onChange={e => setNewJob({ ...newJob, price: parseInt(e.target.value) || 0 })}
                          className="w-full px-4 py-2 border rounded-lg"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                      <textarea
                        value={newJob.notes}
                        onChange={e => setNewJob({ ...newJob, notes: e.target.value })}
                        className="w-full px-4 py-2 border rounded-lg"
                        rows="2"
                      />
                    </div>
                    <button
                      onClick={addJob}
                      className="w-full py-3 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700"
                    >
                      Schedule Job
                    </button>
                  </div>
                </div>
              </div>
            )}

            {oneTimeJobs.length > 0 ? (
              <div className="space-y-3">
                {oneTimeJobs.map(job => (
                  <div key={job.id} className="bg-white rounded-xl p-5 shadow-lg flex items-center justify-between">
                    <div>
                      <div className="font-bold text-gray-800">{job.customerName}</div>
                      <div className="text-sm text-gray-500">
                        {job.jobType} • {new Date(job.date).toLocaleDateString()}
                      </div>
                      {job.notes && <div className="text-sm text-gray-600 italic mt-1">{job.notes}</div>}
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-xl font-bold text-green-600">${job.price}</div>
                      <button
                        onClick={() => completeJob(job)}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                      >
                        Complete
                      </button>
                      <button
                        onClick={() => saveJobs(oneTimeJobs.filter(j => j.id !== job.id))}
                        className="p-2 text-red-500 hover:text-red-700"
                      >
                        <Icons.Trash />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-xl p-12 shadow-lg text-center">
                <div className="text-6xl mb-4">🔧</div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">No jobs scheduled</h3>
                <p className="text-gray-500">Schedule openings, closings, repairs, and more.</p>
              </div>
            )}
          </div>
        )}

        {/* PAYMENTS TAB */}
        {activeTab === 'payments' && (
          <div className="space-y-6">
            {/* Stripe Connection Status */}
            <div className="bg-white rounded-xl p-6 shadow-lg border-l-4" style={{ borderColor: '#635bff' }}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#635bff' }}>
                    <span className="text-white text-2xl">💳</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800">Stripe Payments</h3>
                    <p className="text-sm text-green-600">✓ Connected (Test Mode)</p>
                    <p className="text-xs text-gray-500">Server: {PAYMENT_SERVER_URL}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={refreshPaymentStatuses}
                    className="px-4 py-2 border rounded-lg hover:bg-gray-50 text-sm"
                  >
                    🔄 Refresh Status
                  </button>
                  <button
                    onClick={() => setShowPaymentModal(true)}
                    className="px-6 py-3 text-white rounded-lg font-medium hover:opacity-90"
                    style={{ backgroundColor: '#635bff' }}
                  >
                    + Request Payment
                  </button>
                </div>
              </div>
            </div>

            {/* Quick Payment Request */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Request Payment Card */}
              <div className="bg-white rounded-xl p-6 shadow-lg">
                <h3 className="text-lg font-bold text-gray-800 mb-4">Quick Payment Request</h3>
                <p className="text-gray-600 mb-4">Send a Stripe payment link to any customer.</p>
                <div className="space-y-3">
                  <select
                    id="quickPayCustomer"
                    className="w-full px-4 py-2 border rounded-lg"
                  >
                    <option value="">Select customer...</option>
                    {customers.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                  <input
                    type="number"
                    id="quickPayAmount"
                    placeholder="Amount ($)"
                    className="w-full px-4 py-2 border rounded-lg"
                  />
                  <input
                    type="text"
                    id="quickPayDesc"
                    placeholder="Description (optional)"
                    className="w-full px-4 py-2 border rounded-lg"
                  />
                  <button
                    onClick={() => {
                      const customerId = document.getElementById('quickPayCustomer').value;
                      const amount = parseFloat(document.getElementById('quickPayAmount').value) || 0;
                      const desc = document.getElementById('quickPayDesc').value;
                      if (customerId && amount > 0) {
                        openPaymentRequest(customerId, amount, desc);
                      }
                    }}
                    className="w-full py-3 text-white rounded-lg font-medium"
                    style={{ backgroundColor: '#635bff' }}
                  >
                    Generate Stripe Link
                  </button>
                </div>
              </div>

              {/* Payment Stats */}
              <div className="bg-white rounded-xl p-6 shadow-lg">
                <h3 className="text-lg font-bold text-gray-800 mb-4">Payment Overview</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                    <span className="text-gray-600">Paid</span>
                    <span className="text-xl font-bold text-green-600">
                      ${invoices.filter(i => i.paid).reduce((sum, i) => sum + (i.amount || 0), 0).toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-amber-50 rounded-lg">
                    <span className="text-gray-600">Pending</span>
                    <span className="text-xl font-bold text-amber-600">
                      ${invoices.filter(i => !i.paid && i.type === 'payment-request').reduce((sum, i) => sum + (i.amount || 0), 0).toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-600">Total Requests</span>
                    <span className="text-xl font-bold text-gray-800">
                      {invoices.filter(i => i.type === 'payment-request').length}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Pending Payment Requests */}
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <h3 className="text-lg font-bold text-gray-800 mb-4">Pending Payment Requests</h3>
              {invoices.filter(i => i.type === 'payment-request' && !i.paid).length > 0 ? (
                <div className="space-y-3">
                  {invoices.filter(i => i.type === 'payment-request' && !i.paid).map(inv => (
                    <div key={inv.id} className="p-4 bg-amber-50 rounded-lg border-l-4 border-amber-500">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <div className="font-bold text-gray-800">{inv.customerName}</div>
                          <div className="text-sm text-gray-500">
                            {inv.invoiceNumber} • {new Date(inv.createdDate).toLocaleDateString()}
                          </div>
                          {inv.description && <div className="text-sm text-gray-600">{inv.description}</div>}
                        </div>
                        <div className="text-xl font-bold text-amber-600">${inv.amount.toFixed(2)}</div>
                      </div>
                      <div className="flex gap-2 mt-3">
                        {inv.paymentUrl && (
                          <>
                            <button
                              onClick={() => window.open(inv.paymentUrl, '_blank')}
                              className="flex-1 py-2 text-white rounded-lg text-sm"
                              style={{ backgroundColor: '#635bff' }}
                            >
                              Open Payment Link
                            </button>
                            <button
                              onClick={() => {
                                navigator.clipboard.writeText(inv.paymentUrl);
                                alert('Payment link copied!');
                              }}
                              className="px-4 py-2 border rounded-lg text-sm hover:bg-gray-50"
                            >
                              📋 Copy
                            </button>
                          </>
                        )}
                        <button
                          onClick={() => markPaymentReceived(inv.id)}
                          className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700"
                        >
                          ✓ Mark Paid
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-8">No pending payment requests</p>
              )}
            </div>

            {/* Payment History */}
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <h3 className="text-lg font-bold text-gray-800 mb-4">Payment History</h3>
              {invoices.filter(i => i.type === 'payment-request' && i.paid).length > 0 ? (
                <div className="space-y-3">
                  {invoices.filter(i => i.type === 'payment-request' && i.paid).map(inv => (
                    <div key={inv.id} className="flex items-center justify-between p-4 bg-green-50 rounded-lg border-l-4 border-green-500">
                      <div>
                        <div className="font-bold text-gray-800">{inv.customerName}</div>
                        <div className="text-sm text-gray-500">
                          {inv.invoiceNumber} • Paid {new Date(inv.paidDate).toLocaleDateString()}
                        </div>
                      </div>
                      <div className="text-xl font-bold text-green-600">${inv.amount.toFixed(2)}</div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-8">No payment history yet</p>
              )}
            </div>
          </div>
        )}

        {/* Payment Request Modal */}
        {showPaymentModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl p-6 w-full max-w-md">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold" style={{ color: '#635bff' }}>💳 Request Payment</h3>
                <button onClick={() => { setShowPaymentModal(false); setPaymentError(''); }} className="text-gray-500 hover:text-gray-700">
                  <Icons.X />
                </button>
              </div>
              
              {paymentError && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                  ⚠️ {paymentError}
                </div>
              )}
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Customer</label>
                  <select
                    value={paymentDetails.customerId}
                    onChange={e => setPaymentDetails({ ...paymentDetails, customerId: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg"
                    disabled={isProcessingPayment}
                  >
                    <option value="">Select customer...</option>
                    {customers.map(c => <option key={c.id} value={c.id}>{c.name} {c.email ? `(${c.email})` : ''}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Amount ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={paymentDetails.amount || ''}
                    onChange={e => setPaymentDetails({ ...paymentDetails, amount: parseFloat(e.target.value) || 0 })}
                    className="w-full px-4 py-3 border-2 rounded-lg text-2xl font-bold text-center"
                    style={{ borderColor: '#635bff' }}
                    placeholder="0.00"
                    disabled={isProcessingPayment}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description (optional)</label>
                  <input
                    type="text"
                    value={paymentDetails.description}
                    onChange={e => setPaymentDetails({ ...paymentDetails, description: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg"
                    placeholder="e.g., Monthly pool service - January"
                    disabled={isProcessingPayment}
                  />
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="text-sm text-gray-600 mb-2">Payment will be processed via:</div>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">💳</span>
                    <span className="font-bold" style={{ color: '#635bff' }}>Stripe Checkout</span>
                    <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded">Secure</span>
                  </div>
                  <div className="text-xs text-gray-500 mt-2">
                    Creates a real Stripe payment link your customer can use to pay instantly.
                  </div>
                </div>
                <button
                  onClick={sendPaymentRequest}
                  disabled={!paymentDetails.customerId || paymentDetails.amount <= 0 || isProcessingPayment}
                  className="w-full py-3 text-white rounded-lg font-medium disabled:bg-gray-300 flex items-center justify-center gap-2"
                  style={{ backgroundColor: paymentDetails.customerId && paymentDetails.amount > 0 && !isProcessingPayment ? '#635bff' : undefined }}
                >
                  {isProcessingPayment ? (
                    <>
                      <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Creating Payment Link...
                    </>
                  ) : (
                    'Generate Stripe Payment Link'
                  )}
                </button>
                <p className="text-xs text-gray-500 text-center">
                  A real Stripe Checkout link will be created. You can open it or copy it to send to your customer.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Service Completion Modal */}
        {showCompleteServiceModal && serviceToComplete && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-green-700">✓ Complete Service</h3>
                <button onClick={() => { setShowCompleteServiceModal(false); setServiceToComplete(null); setServiceChemicals([]); }} className="text-gray-500 hover:text-gray-700">
                  <Icons.X />
                </button>
              </div>
              
              {/* Customer Info */}
              <div className="bg-gray-50 p-4 rounded-lg mb-4">
                <div className="font-bold text-lg">{serviceToComplete.name}</div>
                <div className="text-sm text-gray-500">{serviceToComplete.address}</div>
                <div className="text-sm text-gray-600 mt-1">
                  {serviceToComplete.poolType && <span className="capitalize">{serviceToComplete.poolType} Pool</span>}
                </div>
              </div>

              {/* Service Cost */}
              <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg mb-4">
                <span className="font-medium">Service Rate:</span>
                <span className="text-xl font-bold text-blue-700">
                  ${(serviceToComplete.isOneTimeJob ? serviceToComplete.jobPrice : serviceToComplete.weeklyRate).toFixed(2)}
                </span>
              </div>

              {/* Add Chemicals */}
              <div className="mb-4">
                <h4 className="font-bold text-gray-700 mb-2">Add Chemicals Used</h4>
                {chemicalInventory.length > 0 ? (
                  <div className="space-y-2">
                    {chemicalInventory.map(chem => (
                      <div key={chem.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                        <div className="flex-1">
                          <div className="font-medium">{chem.name}</div>
                          <div className="text-xs text-gray-500">
                            ${chem.costPerUnit.toFixed(2)}/{chem.unit} • {chem.quantity} {chem.unit} in stock
                          </div>
                        </div>
                        <input
                          type="number"
                          min="0"
                          max={chem.quantity}
                          step="0.1"
                          placeholder="Qty"
                          className="w-20 px-2 py-1 border rounded text-center"
                          id={`chem-qty-${chem.id}`}
                        />
                        <button
                          onClick={() => {
                            const input = document.getElementById(`chem-qty-${chem.id}`);
                            const qty = parseFloat(input.value) || 0;
                            if (qty > 0 && qty <= chem.quantity) {
                              addChemicalToService(chem, qty);
                              input.value = '';
                            }
                          }}
                          className="px-3 py-1 bg-teal-600 text-white rounded hover:bg-teal-700 text-sm"
                        >
                          Add
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-sm p-3 bg-gray-50 rounded-lg">
                    No chemicals in inventory. Add chemicals in the Chemicals tab.
                  </p>
                )}
              </div>

              {/* Chemicals Added */}
              {serviceChemicals.length > 0 && (
                <div className="mb-4">
                  <h4 className="font-bold text-gray-700 mb-2">Chemicals for This Service</h4>
                  <div className="border rounded-lg overflow-hidden">
                    <table className="w-full">
                      <thead className="bg-teal-50">
                        <tr>
                          <th className="px-3 py-2 text-left text-sm">Chemical</th>
                          <th className="px-3 py-2 text-left text-sm">Qty</th>
                          <th className="px-3 py-2 text-left text-sm">Cost</th>
                          <th className="px-3 py-2"></th>
                        </tr>
                      </thead>
                      <tbody>
                        {serviceChemicals.map(chem => (
                          <tr key={chem.id} className="border-t">
                            <td className="px-3 py-2 text-sm">{chem.name}</td>
                            <td className="px-3 py-2 text-sm">{chem.quantityUsed} {chem.unit}</td>
                            <td className="px-3 py-2 text-sm font-medium">${(chem.quantityUsed * chem.costPerUnit).toFixed(2)}</td>
                            <td className="px-3 py-2">
                              <button 
                                onClick={() => removeChemicalFromService(chem.id)}
                                className="text-red-500 hover:text-red-700"
                              >
                                <Icons.X />
                              </button>
                            </td>
                          </tr>
                        ))}
                        <tr className="border-t bg-teal-50">
                          <td colSpan="2" className="px-3 py-2 font-bold text-right">Chemical Total:</td>
                          <td colSpan="2" className="px-3 py-2 font-bold text-teal-700">
                            ${serviceChemicals.reduce((sum, c) => sum + (c.quantityUsed * c.costPerUnit), 0).toFixed(2)}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Total */}
              <div className="bg-green-50 p-4 rounded-lg mb-4 border-2 border-green-200">
                <div className="flex justify-between items-center">
                  <div>
                    <div className="text-sm text-gray-600">Service Rate</div>
                    <div className="text-sm text-gray-600">Chemicals</div>
                    <div className="font-bold text-lg mt-1">Total</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm">${(serviceToComplete.isOneTimeJob ? serviceToComplete.jobPrice : serviceToComplete.weeklyRate).toFixed(2)}</div>
                    <div className="text-sm">${serviceChemicals.reduce((sum, c) => sum + (c.quantityUsed * c.costPerUnit), 0).toFixed(2)}</div>
                    <div className="font-bold text-xl text-green-700">
                      ${((serviceToComplete.isOneTimeJob ? serviceToComplete.jobPrice : serviceToComplete.weeklyRate) + serviceChemicals.reduce((sum, c) => sum + (c.quantityUsed * c.costPerUnit), 0)).toFixed(2)}
                    </div>
                  </div>
                </div>
              </div>

              {/* Complete Button */}
              <div className="flex gap-3">
                <button
                  onClick={() => { setShowCompleteServiceModal(false); setServiceToComplete(null); setServiceChemicals([]); }}
                  className="flex-1 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={completeServiceWithChemicals}
                  className="flex-1 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700"
                >
                  ✓ Complete Service
                </button>
              </div>
            </div>
          </div>
        )}

        {/* CHEMICALS TAB */}
        {activeTab === 'chemicals' && (
          <div className="space-y-6">
            {/* Chemical Usage Chart */}
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-800">Chemical Usage Tracking</h2>
                <div className="flex bg-gray-100 rounded-lg p-1">
                  {['weekly', 'monthly', 'annual'].map(scale => (
                    <button
                      key={scale}
                      onClick={() => setChemicalChartScale(scale)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                        chemicalChartScale === scale 
                          ? 'bg-teal-600 text-white shadow' 
                          : 'text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {scale.charAt(0).toUpperCase() + scale.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
              
              {(() => {
                const { data, chemicals } = getChemicalUsageData(chemicalChartScale);
                if (chemicals.length === 0) {
                  return (
                    <div className="text-center py-12 text-gray-500">
                      <div className="text-4xl mb-3">📊</div>
                      <p>No chemical usage data yet.</p>
                      <p className="text-sm">Complete services with chemicals to see usage trends.</p>
                    </div>
                  );
                }
                return (
                  <div>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                        <XAxis dataKey="period" stroke="#6b7280" fontSize={12} />
                        <YAxis stroke="#6b7280" fontSize={12} />
                        <Tooltip 
                          content={({ active, payload, label }) => {
                            if (active && payload && payload.length) {
                              return (
                                <div className="bg-white p-3 rounded-lg shadow-lg border">
                                  <p className="font-bold text-gray-800 mb-2">{payload[0]?.payload?.fullPeriod || label}</p>
                                  {payload.map((entry, idx) => (
                                    <p key={idx} style={{ color: entry.color }} className="text-sm">
                                      {entry.name}: {entry.value.toFixed(1)} {serviceHistory.find(s => s.chemicalsUsed?.find(c => c.name === entry.name))?.chemicalsUsed?.find(c => c.name === entry.name)?.unit || 'units'}
                                    </p>
                                  ))}
                                </div>
                              );
                            }
                            return null;
                          }}
                        />
                        {chemicals.map((chem, idx) => (
                          <Bar 
                            key={chem} 
                            dataKey={chem} 
                            fill={chemicalColors[idx % chemicalColors.length]} 
                            name={chem}
                            radius={[4, 4, 0, 0]}
                          />
                        ))}
                      </BarChart>
                    </ResponsiveContainer>
                    
                    {/* Legend */}
                    <div className="flex flex-wrap gap-4 justify-center mt-4">
                      {chemicals.map((chem, idx) => (
                        <div key={chem} className="flex items-center gap-2">
                          <div 
                            className="w-4 h-4 rounded" 
                            style={{ backgroundColor: chemicalColors[idx % chemicalColors.length] }}
                          />
                          <span className="text-sm text-gray-700">{chem}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })()}
            </div>

            {/* Chemical Usage Summary */}
            {getChemicalUsageSummary().length > 0 && (
              <div className="bg-white rounded-xl p-6 shadow-lg">
                <h3 className="text-lg font-bold text-gray-800 mb-4">Monthly Usage Summary</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {getChemicalUsageSummary().map(chem => {
                    const trend = chem.lastMonth > 0 
                      ? ((chem.thisMonth - chem.lastMonth) / chem.lastMonth * 100).toFixed(0)
                      : chem.thisMonth > 0 ? '+100' : '0';
                    const trendUp = parseFloat(trend) > 0;
                    const trendDown = parseFloat(trend) < 0;
                    return (
                      <div key={chem.name} className="bg-gray-50 p-4 rounded-lg">
                        <div className="font-bold text-gray-800 mb-2">{chem.name}</div>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div>
                            <div className="text-gray-500">This Month</div>
                            <div className="text-lg font-bold text-teal-600">{chem.thisMonth.toFixed(1)} {chem.unit}</div>
                          </div>
                          <div>
                            <div className="text-gray-500">Last Month</div>
                            <div className="text-lg font-bold text-gray-600">{chem.lastMonth.toFixed(1)} {chem.unit}</div>
                          </div>
                        </div>
                        <div className={`mt-2 text-sm font-medium ${trendUp ? 'text-amber-600' : trendDown ? 'text-green-600' : 'text-gray-500'}`}>
                          {trendUp ? '↑' : trendDown ? '↓' : '→'} {Math.abs(parseFloat(trend))}% vs last month
                        </div>
                        <div className="text-xs text-gray-400 mt-1">All-time: {chem.total.toFixed(1)} {chem.unit}</div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Inventory Section */}
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-800">Chemical Inventory</h2>
              <button
                onClick={() => setShowAddChemical(true)}
                className="flex items-center gap-2 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-all"
              >
                <Icons.Plus />
                Add Chemical
              </button>
            </div>

            {showAddChemical && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-xl p-6 w-full max-w-md">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-bold">Add Chemical</h3>
                    <button onClick={() => setShowAddChemical(false)} className="text-gray-500 hover:text-gray-700">
                      <Icons.X />
                    </button>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Chemical Name</label>
                      <input
                        type="text"
                        value={newChemical.name}
                        onChange={e => setNewChemical({ ...newChemical, name: e.target.value })}
                        className="w-full px-4 py-2 border rounded-lg"
                        placeholder="Chlorine tablets"
                      />
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
                        <input
                          type="number"
                          value={newChemical.quantity}
                          onChange={e => setNewChemical({ ...newChemical, quantity: parseFloat(e.target.value) || 0 })}
                          className="w-full px-4 py-2 border rounded-lg"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Unit</label>
                        <select
                          value={newChemical.unit}
                          onChange={e => setNewChemical({ ...newChemical, unit: e.target.value })}
                          className="w-full px-4 py-2 border rounded-lg"
                        >
                          <option value="lbs">lbs</option>
                          <option value="gal">gallons</option>
                          <option value="oz">oz</option>
                          <option value="tablets">tablets</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">$/Unit</label>
                        <input
                          type="number"
                          step="0.01"
                          value={newChemical.costPerUnit}
                          onChange={e => setNewChemical({ ...newChemical, costPerUnit: parseFloat(e.target.value) || 0 })}
                          className="w-full px-4 py-2 border rounded-lg"
                        />
                      </div>
                    </div>
                    <button
                      onClick={addChemical}
                      className="w-full py-3 bg-teal-600 text-white rounded-lg font-medium hover:bg-teal-700"
                    >
                      Add Chemical
                    </button>
                  </div>
                </div>
              </div>
            )}

            {chemicalInventory.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {chemicalInventory.map(chem => (
                  <div key={chem.id} className="bg-white rounded-xl p-5 shadow-lg">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-bold text-gray-800">{chem.name}</h3>
                      <div className="flex gap-1">
                        <button
                          onClick={() => setEditingChemical({ ...chem })}
                          className="text-blue-500 hover:text-blue-700 p-1"
                        >
                          <Icons.Edit />
                        </button>
                        <button
                          onClick={() => deleteChemical(chem.id)}
                          className="text-red-500 hover:text-red-700 p-1"
                        >
                          <Icons.Trash />
                        </button>
                      </div>
                    </div>
                    <div className={`text-2xl font-black mb-1 ${chem.quantity <= 5 ? 'text-red-600' : chem.quantity <= 10 ? 'text-amber-600' : 'text-teal-600'}`}>
                      {chem.quantity} {chem.unit}
                      {chem.quantity <= 5 && <span className="text-sm ml-2">⚠️ Low!</span>}
                    </div>
                    <div className="text-sm text-gray-500">
                      ${chem.costPerUnit.toFixed(2)}/{chem.unit} • Value: ${(chem.quantity * chem.costPerUnit).toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-xl p-12 shadow-lg text-center">
                <div className="text-6xl mb-4">🧪</div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">No chemicals tracked</h3>
                <p className="text-gray-500">Track your chemical inventory and costs.</p>
              </div>
            )}

            {/* Edit Chemical Modal */}
            {editingChemical && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-xl p-6 w-full max-w-md">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-bold">Edit Chemical</h3>
                    <button onClick={() => setEditingChemical(null)} className="text-gray-500 hover:text-gray-700">
                      <Icons.X />
                    </button>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Chemical Name</label>
                      <input
                        type="text"
                        value={editingChemical.name}
                        onChange={e => setEditingChemical({ ...editingChemical, name: e.target.value })}
                        className="w-full px-4 py-2 border rounded-lg"
                      />
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
                        <input
                          type="number"
                          step="0.1"
                          value={editingChemical.quantity}
                          onChange={e => setEditingChemical({ ...editingChemical, quantity: parseFloat(e.target.value) || 0 })}
                          className="w-full px-4 py-2 border rounded-lg"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Unit</label>
                        <select
                          value={editingChemical.unit}
                          onChange={e => setEditingChemical({ ...editingChemical, unit: e.target.value })}
                          className="w-full px-4 py-2 border rounded-lg"
                        >
                          <option value="lbs">lbs</option>
                          <option value="gal">gallons</option>
                          <option value="oz">oz</option>
                          <option value="tablets">tablets</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">$/Unit</label>
                        <input
                          type="number"
                          step="0.01"
                          value={editingChemical.costPerUnit}
                          onChange={e => setEditingChemical({ ...editingChemical, costPerUnit: parseFloat(e.target.value) || 0 })}
                          className="w-full px-4 py-2 border rounded-lg"
                        />
                      </div>
                    </div>
                    <div className="bg-teal-50 p-3 rounded-lg">
                      <div className="text-sm text-gray-600">Inventory Value:</div>
                      <div className="text-xl font-bold text-teal-700">
                        ${(editingChemical.quantity * editingChemical.costPerUnit).toFixed(2)}
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <button
                        onClick={() => setEditingChemical(null)}
                        className="flex-1 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={updateChemical}
                        className="flex-1 py-3 bg-teal-600 text-white rounded-lg font-medium hover:bg-teal-700"
                      >
                        Save Changes
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* BILLING TAB */}
        {activeTab === 'billing' && (
          <div className="space-y-6">
            {/* Custom Invoice Section */}
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-800">Service Call Invoice</h2>
                <button
                  onClick={() => setShowCustomInvoice(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  <Icons.Plus />
                  Create Service Invoice
                </button>
              </div>
              <p className="text-gray-600">Create itemized invoices for service calls with parts, labor, and descriptions.</p>
            </div>

            {/* Custom Invoice Modal */}
            {showCustomInvoice && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-bold">Create Service Invoice</h3>
                    <button onClick={() => setShowCustomInvoice(false)} className="text-gray-500 hover:text-gray-700">
                      <Icons.X />
                    </button>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Customer</label>
                      <select
                        value={customInvoice.customerId}
                        onChange={e => setCustomInvoice({ ...customInvoice, customerId: e.target.value })}
                        className="w-full px-4 py-2 border rounded-lg"
                      >
                        <option value="">Select customer...</option>
                        {customers.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                      </select>
                    </div>

                    {/* Add Line Item */}
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-medium mb-3">Add Parts & Labor</h4>
                      <div className="space-y-3">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                          <select
                            value={newLineItem.type}
                            onChange={e => setNewLineItem({ ...newLineItem, type: e.target.value })}
                            className="px-3 py-2 border rounded-lg"
                          >
                            <option value="labor">Labor</option>
                            <option value="part">Part/Equipment</option>
                            <option value="chemical">Chemical</option>
                            <option value="other">Other</option>
                          </select>
                          <input
                            type="number"
                            placeholder="Qty"
                            value={newLineItem.quantity}
                            onChange={e => setNewLineItem({ ...newLineItem, quantity: parseInt(e.target.value) || 1 })}
                            className="px-3 py-2 border rounded-lg"
                          />
                          <input
                            type="number"
                            placeholder="Price ($)"
                            value={newLineItem.price || ''}
                            onChange={e => setNewLineItem({ ...newLineItem, price: parseFloat(e.target.value) || 0 })}
                            className="px-3 py-2 border rounded-lg"
                          />
                          <input
                            type="text"
                            placeholder="Model/Part # (optional)"
                            value={newLineItem.modelNumber}
                            onChange={e => setNewLineItem({ ...newLineItem, modelNumber: e.target.value })}
                            className="px-3 py-2 border rounded-lg"
                          />
                        </div>
                        <input
                          type="text"
                          placeholder="Description (e.g., 'Replaced pool pump motor - Pentair WhisperFlo 1.5HP')"
                          value={newLineItem.description}
                          onChange={e => setNewLineItem({ ...newLineItem, description: e.target.value })}
                          className="w-full px-3 py-2 border rounded-lg"
                        />
                        <button
                          onClick={() => addLineItem(customInvoice, setCustomInvoice)}
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                        >
                          Add Item
                        </button>
                      </div>
                    </div>

                    {/* Line Items List */}
                    {customInvoice.items.length > 0 && (
                      <div className="border rounded-lg overflow-hidden">
                        <table className="w-full">
                          <thead className="bg-gray-50">
                            <tr>
                              <th className="px-4 py-2 text-left text-sm font-medium">Description</th>
                              <th className="px-4 py-2 text-left text-sm font-medium">Qty</th>
                              <th className="px-4 py-2 text-left text-sm font-medium">Price</th>
                              <th className="px-4 py-2 text-left text-sm font-medium">Total</th>
                              <th className="px-4 py-2"></th>
                            </tr>
                          </thead>
                          <tbody>
                            {customInvoice.items.map(item => (
                              <tr key={item.id} className="border-t">
                                <td className="px-4 py-2">
                                  <span className={`text-xs px-2 py-0.5 rounded mr-2 ${
                                    item.type === 'labor' ? 'bg-blue-200 text-blue-800' :
                                    item.type === 'part' ? 'bg-orange-200 text-orange-800' :
                                    item.type === 'chemical' ? 'bg-green-200 text-green-800' :
                                    'bg-gray-200 text-gray-800'
                                  }`}>{item.type.toUpperCase()}</span>
                                  {item.description}
                                  {item.modelNumber && <div className="text-xs text-gray-500 mt-1">Model/Part #: {item.modelNumber}</div>}
                                </td>
                                <td className="px-4 py-2">{item.quantity}</td>
                                <td className="px-4 py-2">${item.price.toFixed(2)}</td>
                                <td className="px-4 py-2 font-medium">${(item.quantity * item.price).toFixed(2)}</td>
                                <td className="px-4 py-2">
                                  <button
                                    onClick={() => removeLineItem(customInvoice, setCustomInvoice, item.id)}
                                    className="text-red-500 hover:text-red-700"
                                  >
                                    <Icons.X />
                                  </button>
                                </td>
                              </tr>
                            ))}
                            <tr className="border-t bg-green-50">
                              <td colSpan="3" className="px-4 py-3 font-bold text-right">Invoice Total:</td>
                              <td colSpan="2" className="px-4 py-3 font-bold text-green-700 text-xl">
                                ${customInvoice.items.reduce((sum, i) => sum + (i.quantity * i.price), 0).toFixed(2)}
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    )}

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Notes for Customer</label>
                      <textarea
                        value={customInvoice.notes}
                        onChange={e => setCustomInvoice({ ...customInvoice, notes: e.target.value })}
                        className="w-full px-4 py-2 border rounded-lg"
                        rows="2"
                        placeholder="Any additional notes (warranty info, maintenance tips, etc.)"
                      />
                    </div>

                    <button
                      onClick={generateCustomInvoice}
                      disabled={!customInvoice.customerId || customInvoice.items.length === 0}
                      className="w-full py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 disabled:bg-gray-300"
                    >
                      Generate & Email Invoice
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Monthly Invoices Section */}
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-800">Monthly Service Invoices</h2>
                <input
                  type="month"
                  value={invoiceMonth}
                  onChange={e => setInvoiceMonth(e.target.value)}
                  className="px-4 py-2 border rounded-lg"
                />
              </div>

              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Customer</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Services</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Service $</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Chemicals $</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Total</th>
                    <th className="px-4 py-3 text-right text-sm font-medium text-gray-500">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {customers.map(customer => {
                    const services = getMonthServices(customer.id, invoiceMonth);
                    const serviceTotal = services.reduce((sum, s) => sum + s.weeklyRate, 0);
                    const chemicalTotal = services.reduce((sum, s) => sum + (s.chemicalCost || 0), 0);
                    const total = services.reduce((sum, s) => sum + s.totalAmount, 0);
                    return (
                      <tr key={customer.id} className="hover:bg-gray-50">
                        <td className="px-4 py-4">
                          <div className="font-medium text-gray-800">{customer.name}</div>
                          <div className="text-sm text-gray-500">{customer.address}</div>
                        </td>
                        <td className="px-4 py-4 text-gray-600">{services.length}</td>
                        <td className="px-4 py-4 text-gray-600">${serviceTotal.toFixed(2)}</td>
                        <td className="px-4 py-4 text-teal-600">${chemicalTotal.toFixed(2)}</td>
                        <td className="px-4 py-4 font-bold text-green-600">${total.toFixed(2)}</td>
                        <td className="px-4 py-4 text-right">
                          <div className="flex gap-1 justify-end flex-wrap">
                            <button
                              onClick={() => openCustomerBillingDetail(customer)}
                              disabled={services.length === 0}
                              className="px-2 py-1 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 disabled:opacity-50 text-xs"
                            >
                              View/Edit
                            </button>
                            <button
                              onClick={() => downloadInvoice(customer, invoiceMonth)}
                              disabled={services.length === 0}
                              className="px-2 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-300 text-xs"
                            >
                              PDF
                            </button>
                            <button
                              onClick={() => openPaymentRequest(customer.id, total, `Monthly service - ${new Date(invoiceMonth + '-01').toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}`)}
                              disabled={services.length === 0 || total === 0}
                              className="px-2 py-1 text-white rounded disabled:bg-gray-300 text-xs"
                              style={{ backgroundColor: services.length > 0 && total > 0 ? '#635bff' : undefined }}
                            >
                              💳 Pay
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              {customers.length === 0 && (
                <div className="p-12 text-center text-gray-500">No customers to invoice</div>
              )}
            </div>

            {/* Customer Billing Detail Modal */}
            {selectedCustomerBilling && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
                  <div className="flex justify-between items-center mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-gray-800">{selectedCustomerBilling.customer.name}</h3>
                      <p className="text-sm text-gray-500">
                        Billing Detail - {new Date(invoiceMonth + '-01').toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                      </p>
                    </div>
                    <button onClick={() => setSelectedCustomerBilling(null)} className="text-gray-500 hover:text-gray-700">
                      <Icons.X />
                    </button>
                  </div>

                  {/* Services List with Edit */}
                  <div className="mb-6">
                    <h4 className="font-bold text-gray-700 mb-3">Services This Month</h4>
                    {selectedCustomerBilling.services.length > 0 ? (
                      <div className="space-y-3">
                        {selectedCustomerBilling.services.map(service => (
                          <div key={service.id} className="border rounded-lg p-4">
                            <div className="flex justify-between items-start mb-2">
                              <div>
                                <div className="font-medium">{new Date(service.date).toLocaleDateString()}</div>
                                <div className="text-sm text-gray-500">{service.poolType}</div>
                              </div>
                              <div className="text-right">
                                <div className="font-bold text-green-600">${service.totalAmount.toFixed(2)}</div>
                                <button
                                  onClick={() => openEditServiceModal(service)}
                                  className="text-xs text-blue-600 hover:text-blue-800"
                                >
                                  Edit
                                </button>
                              </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4 text-sm">
                              <div>
                                <span className="text-gray-500">Service Rate:</span> ${service.weeklyRate.toFixed(2)}
                              </div>
                              <div>
                                <span className="text-gray-500">Chemicals:</span> ${(service.chemicalCost || 0).toFixed(2)}
                              </div>
                            </div>
                            {service.chemicalsUsed && service.chemicalsUsed.length > 0 && (
                              <div className="mt-2 pt-2 border-t">
                                <div className="text-xs text-gray-500 mb-1">Chemicals Used:</div>
                                <div className="flex flex-wrap gap-1">
                                  {service.chemicalsUsed.map((chem, idx) => (
                                    <span key={idx} className="text-xs bg-teal-50 text-teal-700 px-2 py-0.5 rounded">
                                      {chem.name}: {chem.quantity} {chem.unit} (${chem.totalCost.toFixed(2)})
                                    </span>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500 text-center py-4">No services this month</p>
                    )}
                  </div>

                  {/* Manual Adjustments */}
                  <div className="mb-6 bg-amber-50 p-4 rounded-lg">
                    <h4 className="font-bold text-gray-700 mb-3">Manual Adjustments</h4>
                    <div className="flex gap-2 mb-3">
                      <input
                        type="text"
                        placeholder="Description (e.g., Discount, Extra charge)"
                        className="flex-1 px-3 py-2 border rounded-lg text-sm"
                        id="adjustmentDesc"
                      />
                      <input
                        type="number"
                        placeholder="Amount"
                        className="w-24 px-3 py-2 border rounded-lg text-sm"
                        id="adjustmentAmount"
                      />
                      <button
                        onClick={() => {
                          const desc = document.getElementById('adjustmentDesc').value;
                          const amount = parseFloat(document.getElementById('adjustmentAmount').value) || 0;
                          if (desc && amount !== 0) {
                            addBillingAdjustment(desc, amount);
                            document.getElementById('adjustmentDesc').value = '';
                            document.getElementById('adjustmentAmount').value = '';
                          }
                        }}
                        className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 text-sm"
                      >
                        Add
                      </button>
                    </div>
                    <p className="text-xs text-gray-500 mb-2">Use negative amounts for discounts, positive for extra charges</p>
                    {billingAdjustments.length > 0 && (
                      <div className="space-y-2">
                        {billingAdjustments.map(adj => (
                          <div key={adj.id} className="flex justify-between items-center bg-white p-2 rounded">
                            <span className="text-sm">{adj.description}</span>
                            <div className="flex items-center gap-2">
                              <span className={`font-medium ${adj.amount < 0 ? 'text-red-600' : 'text-green-600'}`}>
                                {adj.amount < 0 ? '-' : '+'}${Math.abs(adj.amount).toFixed(2)}
                              </span>
                              <button onClick={() => removeBillingAdjustment(adj.id)} className="text-red-500 hover:text-red-700">
                                <Icons.X />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Invoice Summary */}
                  <div className="bg-gray-50 p-4 rounded-lg mb-4">
                    <h4 className="font-bold text-gray-700 mb-3">Invoice Summary</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Service Charges ({selectedCustomerBilling.services.length} services)</span>
                        <span>${selectedCustomerBilling.services.reduce((sum, s) => sum + s.weeklyRate, 0).toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Chemical Charges</span>
                        <span className="text-teal-600">${selectedCustomerBilling.services.reduce((sum, s) => sum + (s.chemicalCost || 0), 0).toFixed(2)}</span>
                      </div>
                      {billingAdjustments.map(adj => (
                        <div key={adj.id} className="flex justify-between text-amber-700">
                          <span>{adj.description}</span>
                          <span>{adj.amount < 0 ? '-' : '+'}${Math.abs(adj.amount).toFixed(2)}</span>
                        </div>
                      ))}
                      <div className="flex justify-between pt-2 border-t-2 border-gray-300 font-bold text-lg">
                        <span>Total Due</span>
                        <span className="text-green-600">
                          ${(selectedCustomerBilling.services.reduce((sum, s) => sum + s.totalAmount, 0) + billingAdjustments.reduce((sum, a) => sum + a.amount, 0)).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3">
                    <button
                      onClick={() => setSelectedCustomerBilling(null)}
                      className="flex-1 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50"
                    >
                      Close
                    </button>
                    <button
                      onClick={() => {
                        downloadInvoice(selectedCustomerBilling.customer, invoiceMonth);
                        setSelectedCustomerBilling(null);
                      }}
                      className="flex-1 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700"
                    >
                      Download Invoice
                    </button>
                    <button
                      onClick={() => {
                        const total = selectedCustomerBilling.services.reduce((sum, s) => sum + s.totalAmount, 0) + billingAdjustments.reduce((sum, a) => sum + a.amount, 0);
                        openPaymentRequest(selectedCustomerBilling.customer.id, total, `Monthly service - ${new Date(invoiceMonth + '-01').toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}`);
                        setSelectedCustomerBilling(null);
                      }}
                      className="flex-1 py-3 text-white rounded-lg font-medium"
                      style={{ backgroundColor: '#635bff' }}
                    >
                      💳 Request Payment
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Edit Service Modal */}
            {showEditServiceModal && editingService && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-bold text-gray-800">Edit Service Record</h3>
                    <button onClick={() => { setShowEditServiceModal(false); setEditingService(null); }} className="text-gray-500 hover:text-gray-700">
                      <Icons.X />
                    </button>
                  </div>

                  <div className="space-y-4">
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <div className="font-medium">{editingService.customerName}</div>
                      <div className="text-sm text-gray-500">{new Date(editingService.date).toLocaleDateString()}</div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Service Rate ($)</label>
                      <input
                        type="number"
                        value={editingService.weeklyRate}
                        onChange={e => setEditingService({ 
                          ...editingService, 
                          weeklyRate: parseFloat(e.target.value) || 0,
                          totalAmount: (parseFloat(e.target.value) || 0) + (editingService.chemicalCost || 0)
                        })}
                        className="w-full px-4 py-2 border rounded-lg"
                      />
                    </div>

                    {/* Edit Chemicals */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Chemicals Used</label>
                      {editingService.chemicalsUsed && editingService.chemicalsUsed.length > 0 ? (
                        <div className="space-y-2 mb-3">
                          {editingService.chemicalsUsed.map(chem => (
                            <div key={chem.id} className="flex items-center justify-between bg-teal-50 p-2 rounded">
                              <span className="text-sm">{chem.name}: {chem.quantity} {chem.unit}</span>
                              <div className="flex items-center gap-2">
                                <span className="font-medium text-teal-700">${chem.totalCost.toFixed(2)}</span>
                                <button 
                                  onClick={() => removeChemicalFromEditingService(chem.id)}
                                  className="text-red-500 hover:text-red-700"
                                >
                                  <Icons.X />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-gray-500 mb-3">No chemicals recorded</p>
                      )}

                      {/* Add Chemical to Service */}
                      {chemicalInventory.length > 0 && (
                        <div className="bg-gray-50 p-3 rounded-lg">
                          <div className="text-sm font-medium mb-2">Add Chemical:</div>
                          <div className="flex gap-2">
                            <select id="editServiceChemical" className="flex-1 px-3 py-2 border rounded-lg text-sm">
                              <option value="">Select chemical...</option>
                              {chemicalInventory.map(c => (
                                <option key={c.id} value={c.id}>{c.name} (${c.costPerUnit}/{c.unit})</option>
                              ))}
                            </select>
                            <input
                              type="number"
                              step="0.1"
                              placeholder="Qty"
                              className="w-20 px-3 py-2 border rounded-lg text-sm"
                              id="editServiceChemicalQty"
                            />
                            <button
                              onClick={() => {
                                const chemId = parseInt(document.getElementById('editServiceChemical').value);
                                const qty = parseFloat(document.getElementById('editServiceChemicalQty').value) || 0;
                                const chem = chemicalInventory.find(c => c.id === chemId);
                                if (chem && qty > 0) {
                                  addChemicalToEditingService(chem, qty);
                                  document.getElementById('editServiceChemical').value = '';
                                  document.getElementById('editServiceChemicalQty').value = '';
                                }
                              }}
                              className="px-3 py-2 bg-teal-600 text-white rounded-lg text-sm hover:bg-teal-700"
                            >
                              Add
                            </button>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Summary */}
                    <div className="bg-green-50 p-4 rounded-lg border-2 border-green-200">
                      <div className="flex justify-between mb-1">
                        <span>Service Rate:</span>
                        <span>${editingService.weeklyRate.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between mb-1">
                        <span>Chemical Cost:</span>
                        <span>${(editingService.chemicalCost || 0).toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between font-bold text-lg pt-2 border-t border-green-300">
                        <span>Total:</span>
                        <span className="text-green-700">${editingService.totalAmount.toFixed(2)}</span>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <button
                        onClick={() => deleteService(editingService.id)}
                        className="px-4 py-3 bg-red-100 text-red-700 rounded-lg font-medium hover:bg-red-200"
                      >
                        Delete
                      </button>
                      <button
                        onClick={() => { setShowEditServiceModal(false); setEditingService(null); }}
                        className="flex-1 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={updateService}
                        className="flex-1 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700"
                      >
                        Save Changes
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Recent Service Invoices */}
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <h3 className="text-lg font-bold text-gray-800 mb-4">Recent Service Call Invoices</h3>
              {serviceHistory.filter(s => s.type === 'custom-invoice').length > 0 ? (
                <div className="space-y-3">
                  {serviceHistory.filter(s => s.type === 'custom-invoice').slice(0, 10).map(s => (
                    <div key={s.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <div className="font-bold">{s.customerName}</div>
                        <div className="text-sm text-gray-500">{s.invoiceNumber} • {new Date(s.date).toLocaleDateString()}</div>
                        <div className="text-xs text-gray-400">{s.invoiceItems?.length} items</div>
                      </div>
                      <div className="text-xl font-bold text-green-600">${s.totalAmount.toFixed(2)}</div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-8">No service call invoices yet</p>
              )}
            </div>
          </div>
        )}

        {/* HISTORY TAB */}
        {activeTab === 'history' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-800">Service History</h2>
              <div className="text-lg font-bold text-green-600">
                Total: ${totalRevenue.toFixed(2)}
              </div>
            </div>

            {serviceHistory.length > 0 ? (
              <div className="space-y-3">
                {serviceHistory.map(service => (
                  <div key={service.id} className="bg-white rounded-xl p-4 shadow-lg border-l-4 border-green-500">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="font-bold text-gray-800">{service.customerName}</div>
                        <div className="text-sm text-gray-500">
                          {new Date(service.date).toLocaleDateString()} • {service.poolType}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-xl font-bold text-green-600">${service.totalAmount.toFixed(2)}</div>
                        {(service.chemicalCost > 0 || service.additionalItemsCost > 0) && (
                          <div className="text-xs text-gray-500">
                            Base: ${service.weeklyRate.toFixed(2)}
                            {service.chemicalCost > 0 && ` + Chemicals: $${service.chemicalCost.toFixed(2)}`}
                            {service.additionalItemsCost > 0 && ` + Items: $${service.additionalItemsCost.toFixed(2)}`}
                          </div>
                        )}
                      </div>
                      <div className="flex gap-1 ml-3">
                        <button
                          onClick={() => openEditServiceModal(service)}
                          className="p-2 text-blue-500 hover:text-blue-700 hover:bg-blue-50 rounded"
                          title="Edit"
                        >
                          <Icons.Edit />
                        </button>
                        <button
                          onClick={() => deleteService(service.id)}
                          className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded"
                          title="Delete"
                        >
                          <Icons.Trash />
                        </button>
                      </div>
                    </div>
                    {service.chemicalsUsed && service.chemicalsUsed.length > 0 && (
                      <div className="mt-2 pt-2 border-t border-gray-100">
                        <div className="text-xs text-teal-700 font-medium mb-1">Chemicals Used:</div>
                        <div className="flex flex-wrap gap-1">
                          {service.chemicalsUsed.map((chem, idx) => (
                            <span key={idx} className="text-xs bg-teal-50 text-teal-700 px-2 py-0.5 rounded">
                              {chem.name}: {chem.quantity} {chem.unit} (${chem.totalCost.toFixed(2)})
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    {service.additionalItems && service.additionalItems.length > 0 && (
                      <div className="mt-2 pt-2 border-t border-gray-100">
                        <div className="text-xs text-purple-700 font-medium mb-1">Additional Items:</div>
                        <div className="flex flex-wrap gap-1">
                          {service.additionalItems.map((item, idx) => (
                            <span key={idx} className="text-xs bg-purple-50 text-purple-700 px-2 py-0.5 rounded">
                              {item.name} x{item.quantity} (${item.totalCost.toFixed(2)})
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-xl p-12 shadow-lg text-center">
                <div className="text-6xl mb-4">📋</div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">No service history</h3>
                <p className="text-gray-500">Complete services to see them here.</p>
              </div>
            )}
          </div>
        )}

        {/* SETTINGS TAB */}
        {activeTab === 'settings' && (
          <div className="space-y-6">
            {/* Company Profile Section */}
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <h2 className="text-xl font-bold text-gray-800 mb-4">🏢 Company Profile</h2>
              <p className="text-sm text-gray-500 mb-4">This information will be used in your emails and invoices.</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
                  <input
                    type="text"
                    value={companySettings.companyName}
                    onChange={e => setCompanySettings({ ...companySettings, companyName: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg"
                    placeholder="Your Pool Company"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Owner/Contact Name</label>
                  <input
                    type="text"
                    value={companySettings.ownerName}
                    onChange={e => setCompanySettings({ ...companySettings, ownerName: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg"
                    placeholder="John Smith"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                  <input
                    type="tel"
                    value={companySettings.phone}
                    onChange={e => setCompanySettings({ ...companySettings, phone: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg"
                    placeholder="(555) 123-4567"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    value={companySettings.email}
                    onChange={e => setCompanySettings({ ...companySettings, email: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg"
                    placeholder="info@yourpoolco.com"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Business Address</label>
                  <input
                    type="text"
                    value={companySettings.address}
                    onChange={e => setCompanySettings({ ...companySettings, address: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg"
                    placeholder="123 Main St, City, State ZIP"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Website (optional)</label>
                  <input
                    type="url"
                    value={companySettings.website}
                    onChange={e => setCompanySettings({ ...companySettings, website: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg"
                    placeholder="https://yourpoolco.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Logo URL (optional)</label>
                  <input
                    type="url"
                    value={companySettings.logoUrl}
                    onChange={e => setCompanySettings({ ...companySettings, logoUrl: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg"
                    placeholder="https://yoursite.com/logo.png"
                  />
                </div>
              </div>
              
              <div className="mt-4 pt-4 border-t">
                <h4 className="font-medium text-gray-700 mb-3">Brand Colors</h4>
                <div className="flex gap-4">
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Primary Color</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={companySettings.primaryColor}
                        onChange={e => setCompanySettings({ ...companySettings, primaryColor: e.target.value })}
                        className="w-10 h-10 rounded cursor-pointer"
                      />
                      <input
                        type="text"
                        value={companySettings.primaryColor}
                        onChange={e => setCompanySettings({ ...companySettings, primaryColor: e.target.value })}
                        className="w-24 px-2 py-1 border rounded text-sm"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Accent Color</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={companySettings.accentColor}
                        onChange={e => setCompanySettings({ ...companySettings, accentColor: e.target.value })}
                        className="w-10 h-10 rounded cursor-pointer"
                      />
                      <input
                        type="text"
                        value={companySettings.accentColor}
                        onChange={e => setCompanySettings({ ...companySettings, accentColor: e.target.value })}
                        className="w-24 px-2 py-1 border rounded text-sm"
                      />
                    </div>
                  </div>
                </div>
              </div>
              
              <button
                onClick={() => saveCompanySettings(companySettings)}
                className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Save Company Settings
              </button>
            </div>

            {/* Email Templates Section */}
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <h2 className="text-xl font-bold text-gray-800 mb-4">📧 Email Templates</h2>
              <p className="text-sm text-gray-500 mb-4">Customize the emails sent to your customers. Use merge tags to personalize content.</p>
              
              {/* Merge Tags Reference */}
              <div className="bg-blue-50 p-4 rounded-lg mb-6">
                <h4 className="font-medium text-blue-800 mb-2">Available Merge Tags</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                  {[
                    '{{company_name}}', '{{owner_name}}', '{{company_phone}}', '{{company_email}}',
                    '{{customer_name}}', '{{customer_email}}', '{{service_date}}', '{{month}}',
                    '{{total}}', '{{subtotal}}', '{{chemical_total}}', '{{chemicals_used}}',
                    '{{service_summary}}', '{{payment_link}}', '{{quote_number}}', '{{line_items}}'
                  ].map(tag => (
                    <code key={tag} className="bg-white px-2 py-1 rounded text-blue-700 text-xs">{tag}</code>
                  ))}
                </div>
              </div>

              {/* Template Cards */}
              <div className="space-y-4">
                {/* Weekly Update Template */}
                <div className="border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-bold text-gray-800">📅 Weekly Service Update</h3>
                      <p className="text-sm text-gray-500">Sent after completing weekly service</p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setPreviewTemplate('weeklyUpdate')}
                        className="px-3 py-1 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 text-sm"
                      >
                        Preview
                      </button>
                      <button
                        onClick={() => setEditingTemplate('weeklyUpdate')}
                        className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
                      >
                        Edit
                      </button>
                    </div>
                  </div>
                  <div className="bg-gray-50 p-3 rounded">
                    <div className="text-sm text-gray-600"><strong>Subject:</strong> {emailTemplates.weeklyUpdate.subject}</div>
                  </div>
                </div>

                {/* Monthly Invoice Template */}
                <div className="border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-bold text-gray-800">📄 Monthly Invoice</h3>
                      <p className="text-sm text-gray-500">Sent with monthly billing</p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setPreviewTemplate('monthlyInvoice')}
                        className="px-3 py-1 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 text-sm"
                      >
                        Preview
                      </button>
                      <button
                        onClick={() => setEditingTemplate('monthlyInvoice')}
                        className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
                      >
                        Edit
                      </button>
                    </div>
                  </div>
                  <div className="bg-gray-50 p-3 rounded">
                    <div className="text-sm text-gray-600"><strong>Subject:</strong> {emailTemplates.monthlyInvoice.subject}</div>
                  </div>
                </div>

                {/* Quote Template */}
                <div className="border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-bold text-gray-800">💰 Quote</h3>
                      <p className="text-sm text-gray-500">Sent when creating quotes for customers</p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setPreviewTemplate('quote')}
                        className="px-3 py-1 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 text-sm"
                      >
                        Preview
                      </button>
                      <button
                        onClick={() => setEditingTemplate('quote')}
                        className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
                      >
                        Edit
                      </button>
                    </div>
                  </div>
                  <div className="bg-gray-50 p-3 rounded">
                    <div className="text-sm text-gray-600"><strong>Subject:</strong> {emailTemplates.quote.subject}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Edit Template Modal */}
            {editingTemplate && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-bold text-gray-800">
                      Edit {editingTemplate === 'weeklyUpdate' ? 'Weekly Update' : editingTemplate === 'monthlyInvoice' ? 'Monthly Invoice' : 'Quote'} Template
                    </h3>
                    <button onClick={() => setEditingTemplate(null)} className="text-gray-500 hover:text-gray-700">
                      <Icons.X />
                    </button>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email Subject</label>
                      <input
                        type="text"
                        value={emailTemplates[editingTemplate].subject}
                        onChange={e => setEmailTemplates({
                          ...emailTemplates,
                          [editingTemplate]: { ...emailTemplates[editingTemplate], subject: e.target.value }
                        })}
                        className="w-full px-4 py-2 border rounded-lg"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email Body</label>
                      <textarea
                        value={emailTemplates[editingTemplate].body}
                        onChange={e => setEmailTemplates({
                          ...emailTemplates,
                          [editingTemplate]: { ...emailTemplates[editingTemplate], body: e.target.value }
                        })}
                        className="w-full px-4 py-2 border rounded-lg font-mono text-sm"
                        rows="15"
                      />
                    </div>

                    <div className="bg-amber-50 p-3 rounded-lg">
                      <h4 className="font-medium text-amber-800 mb-2">💡 Tips</h4>
                      <ul className="text-sm text-amber-700 space-y-1">
                        <li>• Use **text** for bold formatting</li>
                        <li>• Use merge tags like {'{{customer_name}}'} for personalization</li>
                        <li>• Use {'{{#if condition}}...{{/if}}'} for conditional content</li>
                      </ul>
                    </div>

                    <div className="flex gap-3">
                      <button
                        onClick={() => setEditingTemplate(null)}
                        className="flex-1 py-2 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => {
                          saveEmailTemplates(emailTemplates);
                          setEditingTemplate(null);
                        }}
                        className="flex-1 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                      >
                        Save Template
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Preview Template Modal */}
            {previewTemplate && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-bold text-gray-800">Email Preview</h3>
                    <button onClick={() => setPreviewTemplate(null)} className="text-gray-500 hover:text-gray-700">
                      <Icons.X />
                    </button>
                  </div>

                  <div className="border rounded-lg overflow-hidden">
                    <div className="bg-gray-100 px-4 py-2 border-b">
                      <div className="text-sm">
                        <strong>Subject:</strong> {emailTemplates[previewTemplate].subject
                          .replace('{{company_name}}', companySettings.companyName || 'Your Company')
                          .replace('{{month}}', 'January 2025')
                          .replace('{{quote_number}}', 'Q-001')}
                      </div>
                    </div>
                    <div className="p-4 bg-white">
                      <pre className="whitespace-pre-wrap font-sans text-sm text-gray-700">
                        {emailTemplates[previewTemplate].body
                          .replace(/\{\{company_name\}\}/g, companySettings.companyName || 'Your Company')
                          .replace(/\{\{owner_name\}\}/g, companySettings.ownerName || 'Owner Name')
                          .replace(/\{\{company_phone\}\}/g, companySettings.phone || '(555) 123-4567')
                          .replace(/\{\{company_email\}\}/g, companySettings.email || 'info@company.com')
                          .replace(/\{\{customer_name\}\}/g, 'John Smith')
                          .replace(/\{\{service_date\}\}/g, new Date().toLocaleDateString())
                          .replace(/\{\{month\}\}/g, 'January 2025')
                          .replace(/\{\{total\}\}/g, '450.00')
                          .replace(/\{\{subtotal\}\}/g, '400.00')
                          .replace(/\{\{chemical_total\}\}/g, '50.00')
                          .replace(/\{\{chemicals_used\}\}/g, '• Chlorine: 2 lbs ($15.00)\n• Shock: 1 lb ($12.00)')
                          .replace(/\{\{service_summary\}\}/g, '4 weekly services @ $100.00 each')
                          .replace(/\{\{payment_link\}\}/g, 'https://pay.stripe.com/example')
                          .replace(/\{\{quote_number\}\}/g, 'Q-001')
                          .replace(/\{\{quote_date\}\}/g, new Date().toLocaleDateString())
                          .replace(/\{\{valid_days\}\}/g, '30')
                          .replace(/\{\{line_items\}\}/g, '• Pool Opening - $250.00\n• Filter Cleaning - $75.00')
                          .replace(/\*\*(.*?)\*\*/g, '$1')}
                      </pre>
                    </div>
                  </div>

                  <button
                    onClick={() => setPreviewTemplate(null)}
                    className="mt-4 w-full py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                  >
                    Close Preview
                  </button>
                </div>
              </div>
            )}

            {/* Server Configuration */}
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <h2 className="text-xl font-bold text-gray-800 mb-4">🖥️ Server Configuration</h2>
              <p className="text-sm text-gray-500 mb-4">Configure your email and payment server settings.</p>
              
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-4">
                <h4 className="font-medium text-amber-800 mb-2">⚠️ Server Required</h4>
                <p className="text-sm text-amber-700">
                  To send emails and process payments, you need to deploy the Pool Authority server. 
                  This handles Gmail SMTP and Stripe integration securely.
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Server URL</label>
                  <input
                    type="url"
                    placeholder="https://your-app.railway.app"
                    className="w-full px-4 py-2 border rounded-lg"
                    defaultValue="http://localhost:3001"
                  />
                  <p className="text-xs text-gray-500 mt-1">Your Railway deployment URL (or localhost for testing)</p>
                </div>
              </div>

              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium text-gray-800 mb-2">🚀 Deploy to Railway</h4>
                <ol className="text-sm text-gray-600 space-y-2">
                  <li>1. Create a free account at <a href="https://railway.app" target="_blank" className="text-blue-600 hover:underline">railway.app</a></li>
                  <li>2. Connect your GitHub repository with the server code</li>
                  <li>3. Add environment variables (STRIPE_SECRET_KEY, GMAIL_USER, GMAIL_APP_PASSWORD)</li>
                  <li>4. Deploy and copy your server URL above</li>
                </ol>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
