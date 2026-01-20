import React, { useState, useEffect } from 'react';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, PieChart, Pie, Cell } from 'recharts';

const GOOGLE_MAPS_KEY = 'AIzaSyDnhsQnmylUDFWgbiMF-Etktm-9ZY6Aaw8';
const STRIPE_PUBLISHABLE_KEY = 'pk_test_51SpDftDHbtPuLg7A3guJcp7uNOUYPzADC1Uk0qqlXBvudJB6TwozWNqaCutnDcTXF0VzZWeqDVoWs4YY4ooBDwSl00W4DbIbcf';
const PAYMENT_SERVER_URL = 'https://pool-authority-server.onrender.com';

// Icons as simple SVG components
const Icons = {
  Users: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
  Clock: () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
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
  Menu: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>,
  Phone: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>,
};

// Helper to get local date string (YYYY-MM-DD) without timezone issues
const getLocalDateString = (date = new Date()) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const getLocalMonthString = (date = new Date()) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  return `${year}-${month}`;
};

// Get prior month for billing (services performed last month)
const getPriorMonthString = () => {
  const date = new Date();
  date.setMonth(date.getMonth() - 1);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  return `${year}-${month}`;
};

// Payment terms helper
const getPaymentTermsDays = (terms) => {
  switch(terms) {
    case 'due_receipt': return 0;
    case 'net7': return 7;
    case 'net15': return 15;
    case 'net30': return 30;
    case 'net45': return 45;
    case 'net60': return 60;
    default: return 15;
  }
};

const getPaymentTermsText = (terms) => {
  switch(terms) {
    case 'due_receipt': return 'Due Upon Receipt';
    case 'net7': return 'Net 7';
    case 'net15': return 'Net 15';
    case 'net30': return 'Net 30';
    case 'net45': return 'Net 45';
    case 'net60': return 'Net 60';
    default: return 'Net 15';
  }
};

// Employee colors for visual identification
const employeeColors = [
  { bg: '#3b82f6', text: '#ffffff', name: 'Blue' },
  { bg: '#10b981', text: '#ffffff', name: 'Green' },
  { bg: '#f59e0b', text: '#000000', name: 'Amber' },
  { bg: '#ef4444', text: '#ffffff', name: 'Red' },
  { bg: '#8b5cf6', text: '#ffffff', name: 'Purple' },
  { bg: '#ec4899', text: '#ffffff', name: 'Pink' },
  { bg: '#06b6d4', text: '#ffffff', name: 'Cyan' },
  { bg: '#84cc16', text: '#000000', name: 'Lime' },
];

export default function PoolAuthority() {
  // State
  const [customers, setCustomers] = useState([]);
  const [serviceHistory, setServiceHistory] = useState([]);
  const [recurringServices, setRecurringServices] = useState([]);
  const [chemicalInventory, setChemicalInventory] = useState([]);
  const [oneTimeJobs, setOneTimeJobs] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [activeTab, setActiveTab] = useState('routes'); // Default to routes for tech mode
  const [showMobileMenu, setShowMobileMenu] = useState(false); // Mobile navigation menu
  
  // Admin PIN & Mode State
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [adminPIN, setAdminPIN] = useState('');
  const [showPINSetup, setShowPINSetup] = useState(false);
  const [showPINEntry, setShowPINEntry] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState('');
  const [confirmPIN, setConfirmPIN] = useState('');
  const [adminTimeout, setAdminTimeout] = useState(15); // Minutes until auto-lock
  const [lastActivity, setLastActivity] = useState(Date.now());
  
  const [showAddCustomer, setShowAddCustomer] = useState(false);
  const [showAddChemical, setShowAddChemical] = useState(false);
  const [showAddJob, setShowAddJob] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [routeCustomers, setRouteCustomers] = useState([]);
  const [showMap, setShowMap] = useState(false);
  const [routeDate, setRouteDate] = useState(getLocalDateString());
  const [selectedDate, setSelectedDate] = useState(getLocalDateString());
  const [calendarDate, setCalendarDate] = useState(new Date());
  const [invoiceMonth, setInvoiceMonth] = useState(getPriorMonthString());
  const [defaultPaymentTerms, setDefaultPaymentTerms] = useState('net15');
  const [showCustomInvoice, setShowCustomInvoice] = useState(false);
  const [showCreateQuote, setShowCreateQuote] = useState(false);
  const [quotes, setQuotes] = useState([]);
  const [customInvoice, setCustomInvoice] = useState({ customerId: '', items: [], notes: '' });
  
  // Employee management
  const [employees, setEmployees] = useState([]);
  const [showEmployeeManager, setShowEmployeeManager] = useState(false);
  const [newEmployee, setNewEmployee] = useState({ name: '', phone: '', email: '' });
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [selectedRouteEmployee, setSelectedRouteEmployee] = useState('all'); // Filter routes by employee
  const [currentQuote, setCurrentQuote] = useState({ customerId: '', items: [], notes: '', validDays: 30 });
  const [editingQuoteId, setEditingQuoteId] = useState(null); // Track if editing existing quote
  const [newLineItem, setNewLineItem] = useState({ type: 'labor', description: '', modelNumber: '', quantity: 1, price: 0 });
  const [savedQuoteItems, setSavedQuoteItems] = useState([]); // Saved items for reuse in quotes
  const [showSavedItems, setShowSavedItems] = useState(false);
  const [showScheduleQuoteJob, setShowScheduleQuoteJob] = useState(false); // Modal for scheduling quote as job
  const [quoteToSchedule, setQuoteToSchedule] = useState(null); // Quote being scheduled as job
  const [quoteJobDate, setQuoteJobDate] = useState(''); // Selected date for the job
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentDetails, setPaymentDetails] = useState({ customerId: '', amount: 0, description: '', invoiceId: '' });
  const [showCompleteServiceModal, setShowCompleteServiceModal] = useState(false);
  const [serviceToComplete, setServiceToComplete] = useState(null);
  const [serviceChemicals, setServiceChemicals] = useState([]);
  const [serviceWaterTest, setServiceWaterTest] = useState({ chlorine: '', ph: '', alkalinity: '', cya: '', hardness: '', salt: '', phosphates: '', temp: '', notes: '' });
  const [serviceWaterTarget, setServiceWaterTarget] = useState({ chlorine: '3', ph: '7.5', alkalinity: '100', cya: '40', hardness: '300', salt: '3200', phosphates: '0' });
  const [serviceChlorineType, setServiceChlorineType] = useState('liquid12'); // liquid10, liquid12, calHypo68, calHypo73, dichlor
  const [serviceAcidType, setServiceAcidType] = useState('muriatic'); // muriatic, dryAcid
  const [sendEmailOnComplete, setSendEmailOnComplete] = useState(true);
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
  const [jobCompletionNotes, setJobCompletionNotes] = useState('');
  const [sendJobEmailOnComplete, setSendJobEmailOnComplete] = useState(true);
  
  // Search state for billing and history
  const [billingSearch, setBillingSearch] = useState('');
  const [billingDateFilter, setBillingDateFilter] = useState('');
  const [jobsSearch, setJobsSearch] = useState('');
  const [jobsDateFilter, setJobsDateFilter] = useState('');
  const [historySearch, setHistorySearch] = useState('');
  const [historyDateFilter, setHistoryDateFilter] = useState('');
  
  // Water Test Calculator State
  const [waterTestCustomer, setWaterTestCustomer] = useState('');
  const [waterTestPoolGallons, setWaterTestPoolGallons] = useState(15000);
  const [waterTestTemperature, setWaterTestTemperature] = useState(78);
  const [waterTestReadings, setWaterTestReadings] = useState({
    freeChlorine: '',
    pH: '',
    alkalinity: '',
    cyanuricAcid: '',
    calciumHardness: '',
    salt: '',
    phosphates: ''
  });
  const [waterTestTargets, setWaterTestTargets] = useState({
    freeChlorine: 3,
    pH: 7.4,
    alkalinity: 100,
    cyanuricAcid: 40,
    calciumHardness: 300,
    salt: 3200
  });
  const [waterTestChemicalTypes, setWaterTestChemicalTypes] = useState({
    chlorine: 'liquid12',  // liquid10, liquid12, calHypo68, calHypo73, dichlor, trichlor
    cya: 'granular',       // granular, liquid
    acid: 'muriatic'       // muriatic, dryAcid
  });
  const [waterTestResults, setWaterTestResults] = useState(null);
  const [chemicalsAdded, setChemicalsAdded] = useState([]); // Track what chemicals were actually added
  const [waterTestNotes, setWaterTestNotes] = useState('');
  const [showWaterTestEmailModal, setShowWaterTestEmailModal] = useState(false);
  const [waterTestHistory, setWaterTestHistory] = useState([]); // Store past water tests
  
  // Email state
  const [emailLog, setEmailLog] = useState([]);
  const [billedCustomers, setBilledCustomers] = useState({}); // Track customers billed this month: { 'customerId-YYYY-MM': true }
  const [emailNotification, setEmailNotification] = useState(null);
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  
  // Payment tracking state
  const [showPaymentMethodModal, setShowPaymentMethodModal] = useState(false);
  const [paymentToMark, setPaymentToMark] = useState(null); // { invoiceId, customerId, amount }
  const [paymentMethod, setPaymentMethod] = useState({ method: 'electronic', checkNumber: '', source: '' });
  const [paidInvoices, setPaidInvoices] = useState({}); // { 'customerId-YYYY-MM': { paid: true, method: 'check', checkNumber: '123', paidDate: '...' } }
  
  // Invoice terms modal state
  const [showInvoiceTermsModal, setShowInvoiceTermsModal] = useState(false);
  const [invoiceTermsAction, setInvoiceTermsAction] = useState(null); // { type: 'pdf' | 'email', customer, services, totals }
  const [selectedInvoiceTerms, setSelectedInvoiceTerms] = useState('net15');

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

{{#if water_test}}
**Water Test Results:** {{water_test}}
{{/if}}

{{#if chemicals_used}}
**Chemicals Applied:**
{{chemicals_used}}
{{/if}}

{{#if service_notes}}
**Notes:** {{service_notes}}
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

{{#if itemized_services}}
**Service Details:**
{{itemized_services}}
{{/if}}

**Subtotal:** \${{subtotal}}
**Chemicals:** \${{chemical_total}}
**Total Due:** \${{total}}

**Payment Terms:** {{payment_terms}}
**Due Date:** {{due_date}}

{{#if payment_link}}
**Pay Online:** {{payment_link}}
{{/if}}

Thank you for your business!

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

**Total:** \${{total}}

To accept this quote, simply reply to this email or give us a call.

Best regards,
{{owner_name}}
{{company_name}}
{{company_phone}}
{{company_email}}`
    },
    paymentReminder: {
      subject: 'Friendly Reminder: Invoice for {{month}} - {{company_name}}',
      body: `Hi {{customer_name}},

We hope this message finds you well! This is a friendly reminder that your invoice for pool services in {{month}} is now past due.

**Invoice Details:**
{{service_summary}}

**Amount Due:** \${{total}}
**Days Past Due:** {{days_past_due}}

We understand that things can slip through the cracks, so we wanted to reach out. If you've already sent payment, please disregard this reminder and thank you!

{{#if payment_link}}
**Pay Online:** {{payment_link}}
{{/if}}

If you have any questions about this invoice or would like to discuss payment options, please don't hesitate to reach out.

Thank you for your continued business!

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
    weeklyRate: 100, gateCode: '', dogName: '', notes: '', 
    poolGallons: 15000, isSaltPool: false, targetSalt: 3200
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
        const keys = ['pool-customers', 'pool-history', 'pool-recurring', 'pool-chemicals', 'pool-jobs', 'pool-invoices', 'pool-quotes', 'pool-wear-items', 'pool-company-settings', 'pool-email-templates', 'pool-email-log', 'pool-paid-invoices', 'pool-billed-customers', 'pool-saved-quote-items', 'pool-employees', 'pool-water-test-history'];
        const setters = [setCustomers, setServiceHistory, setRecurringServices, setChemicalInventory, setOneTimeJobs, setInvoices, setQuotes, setWearItems, setCompanySettings, setEmailTemplates, setEmailLog, setPaidInvoices, setBilledCustomers, setSavedQuoteItems, setEmployees, setWaterTestHistory];
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
        
        // Load admin PIN settings
        const savedPIN = localStorage.getItem('pool-admin-pin');
        if (savedPIN) {
          setAdminPIN(savedPIN);
        } else {
          // No PIN set - show setup on first visit
          setShowPINSetup(true);
        }
        
        const savedTimeout = localStorage.getItem('pool-admin-timeout');
        if (savedTimeout) {
          setAdminTimeout(parseInt(savedTimeout));
        }
      } catch (e) { console.log('No existing data'); }
    };
    loadData();
  }, []);

  // Auto-lock admin mode after timeout
  useEffect(() => {
    if (!isAdminMode) return;
    
    const checkTimeout = setInterval(() => {
      const elapsed = (Date.now() - lastActivity) / 1000 / 60; // minutes
      if (elapsed >= adminTimeout) {
        setIsAdminMode(false);
        setActiveTab('routes');
      }
    }, 30000); // Check every 30 seconds
    
    return () => clearInterval(checkTimeout);
  }, [isAdminMode, lastActivity, adminTimeout]);

  // Track activity to reset timeout
  useEffect(() => {
    const resetActivity = () => setLastActivity(Date.now());
    window.addEventListener('click', resetActivity);
    window.addEventListener('keypress', resetActivity);
    window.addEventListener('touchstart', resetActivity);
    return () => {
      window.removeEventListener('click', resetActivity);
      window.removeEventListener('keypress', resetActivity);
      window.removeEventListener('touchstart', resetActivity);
    };
  }, []);

  // Save helpers
  const saveData = (key, data, setter) => {
    setter(data);
    try { localStorage.setItem(key, JSON.stringify(data)); } 
    catch (e) { console.error('Save error:', e); }
  };

  const saveAdminPIN = (pin) => {
    setAdminPIN(pin);
    localStorage.setItem('pool-admin-pin', pin);
  };

  const saveAdminTimeout = (minutes) => {
    setAdminTimeout(minutes);
    localStorage.setItem('pool-admin-timeout', minutes.toString());
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
  const saveEmailLog = (data) => saveData('pool-email-log', data, setEmailLog);
  const savePaidInvoices = (data) => saveData('pool-paid-invoices', data, setPaidInvoices);
  const saveBilledCustomers = (data) => saveData('pool-billed-customers', data, setBilledCustomers);
  const saveSavedQuoteItems = (data) => saveData('pool-saved-quote-items', data, setSavedQuoteItems);
  const saveEmployees = (data) => saveData('pool-employees', data, setEmployees);
  const saveWaterTestHistory = (data) => saveData('pool-water-test-history', data, setWaterTestHistory);

  // Searchable Customer Select Component
  const CustomerSelect = ({ value, onChange, placeholder = "Search or select customer...", className = "" }) => {
    const [search, setSearch] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    const selectedCustomer = customers.find(c => c.id === parseInt(value));
    
    const filteredCustomers = customers.filter(c => 
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.address.toLowerCase().includes(search.toLowerCase())
    );
    
    return (
      <div className={`relative ${className}`}>
        <input
          type="text"
          value={isOpen ? search : (selectedCustomer?.name || '')}
          onChange={e => { setSearch(e.target.value); setIsOpen(true); }}
          onFocus={() => setIsOpen(true)}
          placeholder={placeholder}
          className="w-full px-4 py-2 border rounded-lg"
        />
        {isOpen && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
            <div className="absolute z-50 w-full mt-1 bg-white border rounded-lg shadow-lg max-h-60 overflow-y-auto">
              {filteredCustomers.length > 0 ? filteredCustomers.map(c => (
                <div
                  key={c.id}
                  onClick={() => { onChange(c.id.toString()); setSearch(''); setIsOpen(false); }}
                  className={`px-4 py-2 cursor-pointer hover:bg-blue-50 ${parseInt(value) === c.id ? 'bg-blue-100' : ''}`}
                >
                  <div className="font-medium">{c.name}</div>
                  <div className="text-xs text-gray-500">{c.address}</div>
                </div>
              )) : (
                <div className="px-4 py-2 text-gray-500">No customers found</div>
              )}
            </div>
          </>
        )}
      </div>
    );
  };

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
    setServiceWaterTest({ chlorine: '', ph: '', alkalinity: '', cya: '', hardness: '', salt: '', phosphates: '', temp: '', notes: '' });
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
  const completeServiceWithChemicals = async () => {
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
    
    // Only include water test if any values were entered
    const hasWaterTest = serviceWaterTest.chlorine || serviceWaterTest.ph || serviceWaterTest.alkalinity || serviceWaterTest.cya || serviceWaterTest.hardness || serviceWaterTest.phosphates;
    
    const service = {
      id: Date.now(),
      customerId: serviceToComplete.id,
      customerName: serviceToComplete.name,
      date: new Date().toISOString(),
      weeklyRate: serviceToComplete.isOneTimeJob ? serviceToComplete.jobPrice : serviceToComplete.weeklyRate,
      chemicalCost,
      chemicalsUsed,
      totalAmount: (serviceToComplete.isOneTimeJob ? serviceToComplete.jobPrice : serviceToComplete.weeklyRate) + chemicalCost,
      poolType: serviceToComplete.poolType || serviceToComplete.jobType || 'service',
      waterTest: hasWaterTest ? { ...serviceWaterTest } : null,
      serviceNotes: serviceWaterTest.notes || ''
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
    
    // Auto-send weekly update email if enabled and customer has email
    if (sendEmailOnComplete && serviceToComplete.email) {
      await sendWeeklyUpdateEmail(serviceToComplete, {
        date: service.date,
        chemicalsUsed: chemicalsUsed,
        waterTest: hasWaterTest ? serviceWaterTest : null,
        notes: serviceWaterTest.notes
      });
    }
    
    setShowCompleteServiceModal(false);
    setServiceToComplete(null);
    setServiceChemicals([]);
    setServiceWaterTest({ chlorine: '', ph: '', alkalinity: '', cya: '', hardness: '', salt: '', phosphates: '', temp: '', notes: '' });
  };

  // Quick complete without chemicals (legacy support)
  const completeService = (customer, chemicalCost = 0) => {
    openCompleteServiceModal(customer);
  };

  // Get recurring services for a month (excludes one-time jobs)
  const getMonthServices = (custId, yearMonth) => 
    serviceHistory.filter(s => s.customerId === custId && s.date.startsWith(yearMonth) && !s.isJobService);

  // Get job/service call completions for a month
  const getMonthJobServices = (custId, yearMonth) => 
    serviceHistory.filter(s => s.customerId === custId && s.date.startsWith(yearMonth) && s.isJobService);

  // Get all job services for a month (across all customers)
  const getAllMonthJobServices = (yearMonth) => 
    serviceHistory.filter(s => s.date.startsWith(yearMonth) && s.isJobService);

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
      
      // Parse dates as local dates (no timezone issues)
      const [year, month, day] = dateStr.split('-').map(Number);
      const serviceDate = new Date(year, month - 1, day);
      
      const startDateStr = r.startDate || customer.createdDate || dateStr;
      const [sYear, sMonth, sDay] = startDateStr.split('-').map(Number);
      const startDate = new Date(sYear, sMonth - 1, sDay);
      
      if (serviceDate < startDate) return false;
      const dayOfWeek = serviceDate.getDay();
      const scheduledDay = r.dayOfWeek !== undefined ? parseInt(r.dayOfWeek) : 1;
      if (r.frequency === 'weekly') return dayOfWeek === scheduledDay;
      if (r.frequency === 'biweekly') {
        const timeDiff = serviceDate.getTime() - startDate.getTime();
        const weeksDiff = Math.floor(timeDiff / (7 * 24 * 60 * 60 * 1000));
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
  const getScheduledCustomersForDate = (dateStr, employeeFilter = 'all') => {
    let scheduledCustomers = [];
    
    // Parse the target date as local date (no timezone issues)
    const [year, month, day] = dateStr.split('-').map(Number);
    const targetDate = new Date(year, month - 1, day);
    const dayOfWeek = targetDate.getDay();
    
    // Get customers from recurring services
    recurringServices.filter(r => r.active).forEach(r => {
      const customer = customers.find(c => c.id === r.customerId);
      if (!customer) return;
      
      // Filter by employee if specified
      if (employeeFilter !== 'all') {
        if (employeeFilter === '' && r.employeeId) return; // Filter for unassigned only
        if (employeeFilter !== '' && r.employeeId !== parseInt(employeeFilter)) return;
      }
      
      // Parse start date as local date
      const startDateStr = r.startDate || customer.createdDate || dateStr;
      const [sYear, sMonth, sDay] = startDateStr.split('-').map(Number);
      const startDate = new Date(sYear, sMonth - 1, sDay);
      
      if (targetDate < startDate) return;
      
      const scheduledDay = r.dayOfWeek !== undefined ? parseInt(r.dayOfWeek) : 1;
      
      let isScheduled = false;
      if (r.frequency === 'weekly') {
        isScheduled = dayOfWeek === scheduledDay;
      } else if (r.frequency === 'biweekly') {
        const timeDiff = targetDate.getTime() - startDate.getTime();
        const weeksDiff = Math.floor(timeDiff / (7 * 24 * 60 * 60 * 1000));
        isScheduled = dayOfWeek === scheduledDay && weeksDiff % 2 === 0;
      } else if (r.frequency === 'monthly') {
        isScheduled = targetDate.getDate() === startDate.getDate();
      }
      
      if (isScheduled && !scheduledCustomers.find(c => c.id === customer.id && c.recurringId === r.id)) {
        scheduledCustomers.push({ 
          ...customer, 
          recurringId: r.id, 
          frequency: r.frequency,
          scheduledTime: r.scheduledTime || null,
          employeeId: r.employeeId || null
        });
      }
    });
    
    // Also add customers from one-time jobs scheduled for this date
    oneTimeJobs.filter(j => j.date === dateStr).forEach(job => {
      // Filter by employee if specified
      if (employeeFilter !== 'all') {
        if (employeeFilter === '' && job.employeeId) return;
        if (employeeFilter !== '' && job.employeeId !== parseInt(employeeFilter)) return;
      }
      
      const customer = customers.find(c => c.id === parseInt(job.customerId));
      if (customer && !scheduledCustomers.find(c => c.id === customer.id && c.isOneTimeJob && c.jobId === job.id)) {
        scheduledCustomers.push({ 
          ...customer, 
          isOneTimeJob: true, 
          jobType: job.jobType, 
          jobPrice: job.price,
          jobId: job.id,
          jobData: job,
          scheduledTime: job.scheduledTime || null,
          employeeId: job.employeeId || null
        });
      }
    });
    
    // Sort: timed appointments first (by time), then untimed
    scheduledCustomers.sort((a, b) => {
      if (a.scheduledTime && b.scheduledTime) {
        return a.scheduledTime.localeCompare(b.scheduledTime);
      }
      if (a.scheduledTime && !b.scheduledTime) return -1;
      if (!a.scheduledTime && b.scheduledTime) return 1;
      return 0;
    });
    
    return scheduledCustomers;
  };

  // LSI (Langelier Saturation Index) Calculation - Using standard factor tables
  // Formula: LSI = pH + TF + CF + AF - TDS Factor
  // Where TF = Temperature Factor, CF = Calcium Factor, AF = Alkalinity Factor
  const calculateLSI = () => {
    const ph = parseFloat(waterTestReadings.pH) || 7.4;
    const temp = waterTestTemperature || 78;
    const calcium = parseFloat(waterTestReadings.calciumHardness) || 250;
    const alk = parseFloat(waterTestReadings.alkalinity) || 100;
    const cya = parseFloat(waterTestReadings.cyanuricAcid) || 0;
    const salt = parseFloat(waterTestReadings.salt) || 0;
    
    // Temperature Factor - interpolated from standard table
    // Table: 32°F=0.0, 37°F=0.1, 46°F=0.2, 53°F=0.3, 60°F=0.4, 66°F=0.5, 76°F=0.6, 84°F=0.7, 94°F=0.8, 105°F=0.9
    const tempTable = [
      { t: 32, f: 0.0 }, { t: 37, f: 0.1 }, { t: 46, f: 0.2 }, { t: 53, f: 0.3 },
      { t: 60, f: 0.4 }, { t: 66, f: 0.5 }, { t: 76, f: 0.6 }, { t: 84, f: 0.7 },
      { t: 94, f: 0.8 }, { t: 105, f: 0.9 }
    ];
    let TF = 0.6; // default
    for (let i = 0; i < tempTable.length - 1; i++) {
      if (temp >= tempTable[i].t && temp <= tempTable[i + 1].t) {
        const ratio = (temp - tempTable[i].t) / (tempTable[i + 1].t - tempTable[i].t);
        TF = tempTable[i].f + ratio * (tempTable[i + 1].f - tempTable[i].f);
        break;
      }
    }
    if (temp < 32) TF = 0.0;
    if (temp > 105) TF = 0.9;
    
    // Calcium Hardness Factor - interpolated from standard table
    // Table: 25=1.0, 50=1.3, 75=1.5, 100=1.6, 125=1.7, 150=1.8, 200=1.9, 250=2.0, 300=2.1, 400=2.2, 600=2.5, 800=2.6, 1000=2.7
    const calcTable = [
      { c: 25, f: 1.0 }, { c: 50, f: 1.3 }, { c: 75, f: 1.5 }, { c: 100, f: 1.6 },
      { c: 125, f: 1.7 }, { c: 150, f: 1.8 }, { c: 200, f: 1.9 }, { c: 250, f: 2.0 },
      { c: 300, f: 2.1 }, { c: 400, f: 2.2 }, { c: 600, f: 2.5 }, { c: 800, f: 2.6 }, { c: 1000, f: 2.7 }
    ];
    let CF = 2.0; // default for 250
    for (let i = 0; i < calcTable.length - 1; i++) {
      if (calcium >= calcTable[i].c && calcium <= calcTable[i + 1].c) {
        const ratio = (calcium - calcTable[i].c) / (calcTable[i + 1].c - calcTable[i].c);
        CF = calcTable[i].f + ratio * (calcTable[i + 1].f - calcTable[i].f);
        break;
      }
    }
    if (calcium < 25) CF = 1.0;
    if (calcium > 1000) CF = 2.7;
    
    // Carbonate Alkalinity = TA - (CYA × correction factor)
    // CYA correction factor at pH 7.5 is ~0.33 (one-third)
    // pH-dependent correction: 7.0=0.31, 7.2=0.31, 7.4=0.32, 7.5=0.33, 7.6=0.33, 7.8=0.35, 8.0=0.38
    let cyaCorrection = 0.33;
    if (ph <= 7.2) cyaCorrection = 0.31;
    else if (ph <= 7.4) cyaCorrection = 0.32;
    else if (ph <= 7.6) cyaCorrection = 0.33;
    else if (ph <= 7.8) cyaCorrection = 0.35;
    else cyaCorrection = 0.38;
    
    const carbAlk = Math.max(alk - (cya * cyaCorrection), 10);
    
    // Alkalinity Factor - interpolated from standard table  
    // Table: 25=1.4, 50=1.7, 75=1.9, 100=2.0, 125=2.1, 150=2.2, 200=2.3, 250=2.4, 300=2.5, 400=2.6, 600=2.8, 800=2.9
    const alkTable = [
      { a: 25, f: 1.4 }, { a: 50, f: 1.7 }, { a: 75, f: 1.9 }, { a: 100, f: 2.0 },
      { a: 125, f: 2.1 }, { a: 150, f: 2.2 }, { a: 200, f: 2.3 }, { a: 250, f: 2.4 },
      { a: 300, f: 2.5 }, { a: 400, f: 2.6 }, { a: 600, f: 2.8 }, { a: 800, f: 2.9 }
    ];
    let AF = 2.0; // default for 100
    for (let i = 0; i < alkTable.length - 1; i++) {
      if (carbAlk >= alkTable[i].a && carbAlk <= alkTable[i + 1].a) {
        const ratio = (carbAlk - alkTable[i].a) / (alkTable[i + 1].a - alkTable[i].a);
        AF = alkTable[i].f + ratio * (alkTable[i + 1].f - alkTable[i].f);
        break;
      }
    }
    if (carbAlk < 25) AF = 1.4;
    if (carbAlk > 800) AF = 2.9;
    
    // TDS Factor - Table: 0=12.0, 1000=12.1, 2000=12.2, 3000=12.25, 4000=12.3, 5000=12.35
    const tds = 1000 + salt; // Salt directly adds to TDS
    let TDSF = 12.1; // default for 1000
    if (tds < 1000) TDSF = 12.0;
    else if (tds < 2000) TDSF = 12.1;
    else if (tds < 3000) TDSF = 12.2;
    else if (tds < 4000) TDSF = 12.25;
    else if (tds < 5000) TDSF = 12.3;
    else TDSF = 12.35;
    
    // LSI = pH + TF + CF + AF - TDS Factor
    const lsi = ph + TF + CF + AF - TDSF;
    
    return lsi;
  };

  // Get LSI status color and text
  const getLSIStatus = (lsi) => {
    if (lsi >= 0.31) {
      return { color: '#a855f7', bgColor: 'bg-purple-100', borderColor: 'border-purple-500', text: 'SCALING ⚠️', description: 'Over-saturated, scale-forming water' };
    } else if (lsi >= 0) {
      return { color: '#22c55e', bgColor: 'bg-green-100', borderColor: 'border-green-500', text: 'BALANCED ✓', description: 'Ideal LSI balance' };
    } else if (lsi >= -0.30) {
      return { color: '#eab308', bgColor: 'bg-yellow-100', borderColor: 'border-yellow-500', text: 'ACCEPTABLE', description: 'Close enough, but slightly corrosive' };
    } else {
      return { color: '#ef4444', bgColor: 'bg-red-100', borderColor: 'border-red-500', text: 'CORROSIVE ⚠️', description: 'Aggressive, corrosive water' };
    }
  };

  // Chemical dosing rates per 10,000 gallons (per 1 ppm increase)
  const chemicalRates = {
    chlorine: {
      liquid10: { rate: 12.8, name: 'Liquid Chlorine 10%', unit: 'fl oz', isLiquid: true },
      liquid12: { rate: 10.7, name: 'Liquid Chlorine 12.5%', unit: 'fl oz', isLiquid: true },
      calHypo68: { rate: 1.95, name: 'Cal-Hypo 68%', unit: 'oz', isLiquid: false },
      calHypo73: { rate: 1.8, name: 'Cal-Hypo 73%', unit: 'oz', isLiquid: false },
      dichlor: { rate: 2.1, name: 'Dichlor 56%', unit: 'oz', isLiquid: false },
      trichlor: { rate: 1.5, name: 'Trichlor', unit: 'oz', isLiquid: false }
    },
    cya: {
      granular: { rate: 13, name: 'Granular CYA', unit: 'oz', isLiquid: false, per10ppm: true },
      liquid: { rate: 16, name: 'Liquid CYA', unit: 'fl oz', isLiquid: true, per10ppm: true }
    },
    acid: {
      muriatic: { rate: 14, name: 'Muriatic Acid 31.45%', unit: 'fl oz', isLiquid: true, per02pH: true },
      dryAcid: { rate: 2.1, name: 'Dry Acid', unit: 'oz', isLiquid: false, per02pH: true }
    }
  };

  // Real-time chemical dosing calculation (Orenda-style)
  const getChemicalDoses = () => {
    const gallons = waterTestPoolGallons || 15000;
    const factor = gallons / 10000;
    const doses = [];

    // Chlorine
    const currentCl = parseFloat(waterTestReadings.freeChlorine) || 0;
    const targetCl = waterTestTargets.freeChlorine;
    const clType = chemicalRates.chlorine[waterTestChemicalTypes.chlorine] || chemicalRates.chlorine.liquid12;
    
    if (currentCl < targetCl - 0.2) {
      const ppmNeeded = targetCl - currentCl;
      const amount = ppmNeeded * clType.rate * factor;
      doses.push({
        id: 'chlorine',
        chemical: clType.name,
        amount: amount,
        unit: clType.unit,
        altAmount: clType.isLiquid ? (amount / 128).toFixed(2) : (amount / 16).toFixed(2),
        altUnit: clType.isLiquid ? 'gal' : 'lbs',
        from: currentCl,
        to: targetCl,
        label: 'FC',
        color: 'yellow',
        needed: true
      });
    }

    // pH
    const currentpH = parseFloat(waterTestReadings.pH) || 0;
    const targetpH = waterTestTargets.pH;
    
    if (currentpH > 0 && currentpH > targetpH + 0.1) {
      const acidType = chemicalRates.acid[waterTestChemicalTypes.acid] || chemicalRates.acid.muriatic;
      const pHDrop = currentpH - targetpH;
      const amount = (pHDrop / 0.2) * acidType.rate * factor;
      doses.push({
        id: 'acid',
        chemical: acidType.name,
        amount: amount,
        unit: acidType.unit,
        altAmount: acidType.isLiquid ? (amount / 128).toFixed(2) : (amount / 16).toFixed(2),
        altUnit: acidType.isLiquid ? 'gal' : 'lbs',
        from: currentpH,
        to: targetpH,
        label: 'pH',
        color: 'red',
        warning: 'Add slowly with pump running',
        needed: true
      });
    } else if (currentpH > 0 && currentpH < targetpH - 0.1) {
      const pHRaise = targetpH - currentpH;
      const amount = (pHRaise / 0.2) * 6 * factor;
      doses.push({
        id: 'sodaAsh',
        chemical: 'Soda Ash',
        amount: amount,
        unit: 'oz',
        altAmount: (amount / 16).toFixed(2),
        altUnit: 'lbs',
        from: currentpH,
        to: targetpH,
        label: 'pH',
        color: 'blue',
        needed: true
      });
    }

    // Alkalinity
    const currentTA = parseFloat(waterTestReadings.alkalinity) || 0;
    const targetTA = waterTestTargets.alkalinity;
    
    if (currentTA > 0 && currentTA < targetTA - 10) {
      const ppmNeeded = targetTA - currentTA;
      const amount = (ppmNeeded / 10) * 1.4 * factor;
      doses.push({
        id: 'alkalinity',
        chemical: 'Sodium Bicarbonate',
        amount: amount * 16, // convert to oz
        unit: 'oz',
        altAmount: amount.toFixed(2),
        altUnit: 'lbs',
        from: currentTA,
        to: targetTA,
        label: 'TA',
        color: 'blue',
        tip: 'Add before adjusting pH',
        needed: true
      });
    } else if (currentTA > 0 && currentTA > targetTA + 20) {
      const acidType = chemicalRates.acid[waterTestChemicalTypes.acid] || chemicalRates.acid.muriatic;
      const ppmDrop = currentTA - targetTA;
      const amount = (ppmDrop / 10) * acidType.rate * 1.8 * factor;
      doses.push({
        id: 'alkAcid',
        chemical: `${acidType.name} (for TA)`,
        amount: amount,
        unit: acidType.unit,
        altAmount: acidType.isLiquid ? (amount / 128).toFixed(2) : (amount / 16).toFixed(2),
        altUnit: acidType.isLiquid ? 'gal' : 'lbs',
        from: currentTA,
        to: targetTA,
        label: 'TA',
        color: 'red',
        warning: 'Will also lower pH',
        needed: true
      });
    }

    // CYA
    const currentCYA = parseFloat(waterTestReadings.cyanuricAcid) || 0;
    const targetCYA = waterTestTargets.cyanuricAcid;
    const cyaType = chemicalRates.cya[waterTestChemicalTypes.cya] || chemicalRates.cya.granular;
    
    if (currentCYA < targetCYA - 5) {
      const ppmNeeded = targetCYA - currentCYA;
      const amount = (ppmNeeded / 10) * cyaType.rate * factor;
      doses.push({
        id: 'cya',
        chemical: cyaType.name,
        amount: amount,
        unit: cyaType.unit,
        altAmount: cyaType.isLiquid ? (amount / 128).toFixed(2) : (amount / 16).toFixed(2),
        altUnit: cyaType.isLiquid ? 'gal' : 'lbs',
        from: currentCYA,
        to: targetCYA,
        label: 'CYA',
        color: 'purple',
        tip: waterTestChemicalTypes.cya === 'granular' ? 'Dissolve in warm water first' : 'Add directly to skimmer',
        needed: true
      });
    } else if (currentCYA > 100) {
      doses.push({
        id: 'cyaHigh',
        chemical: 'CYA Too High',
        amount: null,
        from: currentCYA,
        to: targetCYA,
        label: 'CYA',
        color: 'red',
        warning: `Drain ${Math.round((1 - targetCYA/currentCYA) * 100)}% and refill`,
        needed: false
      });
    }

    // Calcium
    const currentCH = parseFloat(waterTestReadings.calciumHardness) || 0;
    const targetCH = waterTestTargets.calciumHardness;
    
    if (currentCH > 0 && currentCH < targetCH - 30) {
      const ppmNeeded = targetCH - currentCH;
      const amount = (ppmNeeded / 10) * 1.25 * factor;
      doses.push({
        id: 'calcium',
        chemical: 'Calcium Chloride',
        amount: amount * 16,
        unit: 'oz',
        altAmount: amount.toFixed(2),
        altUnit: 'lbs',
        from: currentCH,
        to: targetCH,
        label: 'CH',
        color: 'gray',
        needed: true
      });
    } else if (currentCH > 500) {
      doses.push({
        id: 'calciumHigh',
        chemical: 'Calcium Too High',
        amount: null,
        from: currentCH,
        to: targetCH,
        label: 'CH',
        color: 'orange',
        warning: 'Consider partial drain to prevent scaling',
        needed: false
      });
    }

    // Salt
    const currentSalt = parseFloat(waterTestReadings.salt) || 0;
    const targetSalt = waterTestTargets.salt;
    
    if (currentSalt > 0 && currentSalt < targetSalt - 200) {
      const ppmNeeded = targetSalt - currentSalt;
      const lbs = (ppmNeeded / 1000) * 83 * factor;
      doses.push({
        id: 'salt',
        chemical: 'Pool Salt',
        amount: lbs,
        unit: 'lbs',
        altAmount: Math.ceil(lbs / 40),
        altUnit: '40lb bags',
        from: currentSalt,
        to: targetSalt,
        label: 'Salt',
        color: 'blue',
        needed: true
      });
    }

    // Phosphates
    const currentPhos = parseFloat(waterTestReadings.phosphates) || 0;
    if (currentPhos > 500) {
      doses.push({
        id: 'phosphates',
        chemical: 'Phosphate Remover',
        amount: null,
        from: currentPhos,
        to: 0,
        label: 'Phos',
        color: 'green',
        warning: `${currentPhos} ppb - Treatment recommended`,
        needed: true
      });
    }

    return doses;
  };

  // Save water test and add chemicals to bill
  const saveWaterTest = (addToBill = false) => {
    const customer = customers.find(c => c.id === parseInt(waterTestCustomer));
    if (!customer) {
      alert('Please select a customer first');
      return;
    }

    const testRecord = {
      id: Date.now(),
      customerId: customer.id,
      customerName: customer.name,
      date: getLocalDateString(),
      readings: { ...waterTestReadings },
      temperature: waterTestTemperature,
      poolGallons: waterTestPoolGallons,
      lsi: calculateLSI(),
      chemicalsAdded: [...chemicalsAdded],
      notes: waterTestNotes,
      billedAmount: addToBill ? chemicalsAdded.reduce((sum, c) => sum + (c.cost || 0), 0) : 0
    };

    // Save to history
    const newHistory = [testRecord, ...waterTestHistory];
    saveWaterTestHistory(newHistory);

    // Add chemicals to customer's service history if billing
    if (addToBill && chemicalsAdded.length > 0) {
      const chemicalCost = chemicalsAdded.reduce((sum, c) => sum + (c.cost || 0), 0);
      const serviceRecord = {
        id: Date.now(),
        customerId: customer.id,
        customerName: customer.name,
        date: getLocalDateString(),
        poolType: customer.poolType || 'Standard',
        weeklyRate: 0,
        totalAmount: chemicalCost,
        chemicalsUsed: chemicalsAdded.map(c => ({
          name: c.chemical,
          amount: c.amount,
          unit: c.unit,
          cost: c.cost || 0
        })),
        waterTest: { ...waterTestReadings },
        serviceNotes: `Water test & chemical treatment. ${waterTestNotes}`,
        isChemicalService: true
      };
      saveServiceHistory([serviceRecord, ...serviceHistory]);
    }

    return testRecord;
  };

  // Email water test results to customer  
  const emailWaterTestResults = async () => {
    const customer = customers.find(c => c.id === parseInt(waterTestCustomer));
    if (!customer || !customer.email) {
      alert('Customer email not found');
      return;
    }

    const lsi = calculateLSI();
    const lsiStatus = getLSIStatus(lsi);
    const doses = getChemicalDoses();

    const readingsHtml = `
      <table style="width:100%; border-collapse: collapse; margin: 15px 0;">
        <tr style="background: #f3f4f6;">
          <th style="padding: 10px; text-align: left; border: 1px solid #e5e7eb;">Parameter</th>
          <th style="padding: 10px; text-align: center; border: 1px solid #e5e7eb;">Reading</th>
          <th style="padding: 10px; text-align: center; border: 1px solid #e5e7eb;">Target</th>
          <th style="padding: 10px; text-align: center; border: 1px solid #e5e7eb;">Status</th>
        </tr>
        <tr>
          <td style="padding: 10px; border: 1px solid #e5e7eb;">Free Chlorine</td>
          <td style="padding: 10px; text-align: center; border: 1px solid #e5e7eb;">${waterTestReadings.freeChlorine || '-'} ppm</td>
          <td style="padding: 10px; text-align: center; border: 1px solid #e5e7eb;">${waterTestTargets.freeChlorine} ppm</td>
          <td style="padding: 10px; text-align: center; border: 1px solid #e5e7eb;">${(parseFloat(waterTestReadings.freeChlorine) || 0) >= waterTestTargets.freeChlorine - 0.5 ? '✓' : '⚠️'}</td>
        </tr>
        <tr style="background: #f9fafb;">
          <td style="padding: 10px; border: 1px solid #e5e7eb;">pH</td>
          <td style="padding: 10px; text-align: center; border: 1px solid #e5e7eb;">${waterTestReadings.pH || '-'}</td>
          <td style="padding: 10px; text-align: center; border: 1px solid #e5e7eb;">${waterTestTargets.pH}</td>
          <td style="padding: 10px; text-align: center; border: 1px solid #e5e7eb;">${Math.abs((parseFloat(waterTestReadings.pH) || 7.4) - waterTestTargets.pH) <= 0.2 ? '✓' : '⚠️'}</td>
        </tr>
        <tr>
          <td style="padding: 10px; border: 1px solid #e5e7eb;">Alkalinity</td>
          <td style="padding: 10px; text-align: center; border: 1px solid #e5e7eb;">${waterTestReadings.alkalinity || '-'} ppm</td>
          <td style="padding: 10px; text-align: center; border: 1px solid #e5e7eb;">${waterTestTargets.alkalinity} ppm</td>
          <td style="padding: 10px; text-align: center; border: 1px solid #e5e7eb;">${Math.abs((parseFloat(waterTestReadings.alkalinity) || 0) - waterTestTargets.alkalinity) <= 20 ? '✓' : '⚠️'}</td>
        </tr>
        <tr style="background: #f9fafb;">
          <td style="padding: 10px; border: 1px solid #e5e7eb;">CYA (Stabilizer)</td>
          <td style="padding: 10px; text-align: center; border: 1px solid #e5e7eb;">${waterTestReadings.cyanuricAcid || '-'} ppm</td>
          <td style="padding: 10px; text-align: center; border: 1px solid #e5e7eb;">${waterTestTargets.cyanuricAcid} ppm</td>
          <td style="padding: 10px; text-align: center; border: 1px solid #e5e7eb;">${Math.abs((parseFloat(waterTestReadings.cyanuricAcid) || 0) - waterTestTargets.cyanuricAcid) <= 15 ? '✓' : '⚠️'}</td>
        </tr>
        <tr>
          <td style="padding: 10px; border: 1px solid #e5e7eb;">Calcium Hardness</td>
          <td style="padding: 10px; text-align: center; border: 1px solid #e5e7eb;">${waterTestReadings.calciumHardness || '-'} ppm</td>
          <td style="padding: 10px; text-align: center; border: 1px solid #e5e7eb;">${waterTestTargets.calciumHardness} ppm</td>
          <td style="padding: 10px; text-align: center; border: 1px solid #e5e7eb;">${Math.abs((parseFloat(waterTestReadings.calciumHardness) || 0) - waterTestTargets.calciumHardness) <= 50 ? '✓' : '⚠️'}</td>
        </tr>
        ${waterTestReadings.salt ? `
        <tr style="background: #f9fafb;">
          <td style="padding: 10px; border: 1px solid #e5e7eb;">Salt</td>
          <td style="padding: 10px; text-align: center; border: 1px solid #e5e7eb;">${waterTestReadings.salt} ppm</td>
          <td style="padding: 10px; text-align: center; border: 1px solid #e5e7eb;">${waterTestTargets.salt} ppm</td>
          <td style="padding: 10px; text-align: center; border: 1px solid #e5e7eb;">${Math.abs((parseFloat(waterTestReadings.salt) || 0) - waterTestTargets.salt) <= 300 ? '✓' : '⚠️'}</td>
        </tr>` : ''}
        ${waterTestReadings.phosphates ? `
        <tr>
          <td style="padding: 10px; border: 1px solid #e5e7eb;">Phosphates</td>
          <td style="padding: 10px; text-align: center; border: 1px solid #e5e7eb;">${waterTestReadings.phosphates} ppb</td>
          <td style="padding: 10px; text-align: center; border: 1px solid #e5e7eb;">&lt;500 ppb</td>
          <td style="padding: 10px; text-align: center; border: 1px solid #e5e7eb;">${(parseFloat(waterTestReadings.phosphates) || 0) <= 500 ? '✓' : '⚠️'}</td>
        </tr>` : ''}
      </table>
    `;

    const chemicalsHtml = chemicalsAdded.length > 0 ? `
      <h3 style="margin-top: 20px; color: #1e3a5f;">Chemicals Added Today:</h3>
      <table style="width:100%; border-collapse: collapse; margin: 15px 0;">
        <tr style="background: #f3f4f6;">
          <th style="padding: 10px; text-align: left; border: 1px solid #e5e7eb;">Chemical</th>
          <th style="padding: 10px; text-align: right; border: 1px solid #e5e7eb;">Amount</th>
          ${chemicalsAdded.some(c => c.cost) ? '<th style="padding: 10px; text-align: right; border: 1px solid #e5e7eb;">Cost</th>' : ''}
        </tr>
        ${chemicalsAdded.map(c => `
          <tr>
            <td style="padding: 10px; border: 1px solid #e5e7eb;">${c.chemical}</td>
            <td style="padding: 10px; text-align: right; border: 1px solid #e5e7eb;">${c.amount.toFixed(1)} ${c.unit}</td>
            ${c.cost ? `<td style="padding: 10px; text-align: right; border: 1px solid #e5e7eb;">$${c.cost.toFixed(2)}</td>` : ''}
          </tr>
        `).join('')}
        ${chemicalsAdded.some(c => c.cost) ? `
        <tr style="background: #f3f4f6; font-weight: bold;">
          <td style="padding: 10px; border: 1px solid #e5e7eb;">Total</td>
          <td style="padding: 10px; border: 1px solid #e5e7eb;"></td>
          <td style="padding: 10px; text-align: right; border: 1px solid #e5e7eb;">$${chemicalsAdded.reduce((sum, c) => sum + (c.cost || 0), 0).toFixed(2)}</td>
        </tr>` : ''}
      </table>
    ` : '';

    const emailBody = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #1e3a5f 0%, #5bb4d8 100%); padding: 20px; text-align: center;">
          <h1 style="color: white; margin: 0;">Pool Water Test Results</h1>
        </div>
        <div style="padding: 20px; background: white;">
          <p>Dear ${customer.name},</p>
          <p>Here are the results from your pool water test on ${new Date().toLocaleDateString()}:</p>
          
          <div style="background: ${lsiStatus.color}20; border-left: 4px solid ${lsiStatus.color}; padding: 15px; margin: 15px 0; border-radius: 0 8px 8px 0;">
            <strong style="color: ${lsiStatus.color};">Water Balance (LSI): ${lsi >= 0 ? '+' : ''}${lsi.toFixed(2)} - ${lsiStatus.text}</strong>
            <p style="margin: 5px 0 0 0; font-size: 14px; color: #666;">${lsiStatus.description}</p>
          </div>

          ${readingsHtml}
          ${chemicalsHtml}
          ${waterTestNotes ? `<p style="background: #f3f4f6; padding: 15px; border-radius: 8px; margin-top: 20px;"><strong>Notes:</strong> ${waterTestNotes}</p>` : ''}
          
          <p style="margin-top: 20px;">If you have any questions about these results, please don't hesitate to contact us.</p>
          <p>Thank you for choosing ${companySettings.name || 'Pool Authority'}!</p>
        </div>
        <div style="background: #f3f4f6; padding: 15px; text-align: center; font-size: 12px; color: #666;">
          ${companySettings.name || 'Pool Authority'}<br/>
          ${companySettings.phone || ''} | ${companySettings.email || ''}
        </div>
      </div>
    `;

    setIsSendingEmail(true);
    try {
      const response = await fetch(`${PAYMENT_SERVER_URL}/api/send-email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: customer.email,
          subject: `Pool Water Test Results - ${new Date().toLocaleDateString()}`,
          html: emailBody,
          from: companySettings.email || 'noreply@poolauthority.com'
        })
      });
      
      if (response.ok) {
        setEmailNotification({ type: 'success', message: 'Water test results emailed!' });
        // Save the test
        saveWaterTest(false);
      } else {
        setEmailNotification({ type: 'error', message: 'Failed to send email' });
      }
    } catch (err) {
      setEmailNotification({ type: 'error', message: 'Email error: ' + err.message });
    }
    setIsSendingEmail(false);
    setTimeout(() => setEmailNotification(null), 3000);
  };

  // Update route when date changes or employee filter changes
  useEffect(() => {
    const scheduled = getScheduledCustomersForDate(routeDate, selectedRouteEmployee);
    setRouteCustomers(scheduled);
  }, [routeDate, recurringServices, oneTimeJobs, customers, selectedRouteEmployee, employees]);

  // Helper to change route date
  const changeRouteDate = (days) => {
    const current = new Date(routeDate + 'T12:00:00'); // Add time to avoid timezone issues
    current.setDate(current.getDate() + days);
    setRouteDate(getLocalDateString(current));
  };

  const formatRouteDate = (dateStr) => {
    // Parse the date string as local time, not UTC
    const [year, month, day] = dateStr.split('-').map(Number);
    const date = new Date(year, month - 1, day);
    
    const today = getLocalDateString();
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowStr = getLocalDateString(tomorrow);
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = getLocalDateString(yesterday);
    
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
  const addRecurringService = (customerId, frequency, dayOfWeek, startDate, scheduledTime = null, employeeId = null) => {
    const customer = customers.find(c => c.id === customerId);
    if (!customer) return;
    const recurring = {
      id: Date.now(),
      customerId,
      customerName: customer.name,
      frequency,
      dayOfWeek: parseInt(dayOfWeek),
      startDate,
      scheduledTime, // Optional time for appointment
      employeeId: employeeId ? parseInt(employeeId) : null, // Optional employee assignment
      active: true
    };
    saveRecurring([...recurringServices, recurring]);
  };

  const deleteRecurringService = (id) => {
    saveRecurring(recurringServices.filter(r => r.id !== id));
  };

  // Update recurring service (for editing time/employee)
  const updateRecurringService = (id, updates) => {
    saveRecurring(recurringServices.map(r => r.id === id ? { ...r, ...updates } : r));
  };

  // Update job (for editing time/employee)
  const updateJob = (id, updates) => {
    saveJobs(oneTimeJobs.map(j => j.id === id ? { ...j, ...updates } : j));
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
    const validUntil = new Date();
    validUntil.setDate(validUntil.getDate() + currentQuote.validDays);

    if (editingQuoteId) {
      // Update existing quote
      const updatedQuotes = quotes.map(q => {
        if (q.id === editingQuoteId) {
          return {
            ...q,
            customerId: customer.id,
            customerName: customer.name,
            customerEmail: customer.email,
            items: currentQuote.items,
            notes: currentQuote.notes,
            total,
            validUntil: validUntil.toISOString(),
            validDays: currentQuote.validDays,
            updatedDate: new Date().toISOString()
          };
        }
        return q;
      });
      saveQuotes(updatedQuotes);
      setEditingQuoteId(null);
      setCurrentQuote({ customerId: '', items: [], notes: '', validDays: 30 });
      setShowCreateQuote(false);
      showEmailNotification('success', 'Quote updated successfully');
      return;
    }

    // Create new quote
    const quoteNumber = `QT-${Date.now().toString().slice(-8)}`;

    const quote = {
      id: Date.now(),
      quoteNumber,
      customerId: customer.id,
      customerName: customer.name,
      customerEmail: customer.email,
      items: currentQuote.items,
      notes: currentQuote.notes,
      total,
      validDays: currentQuote.validDays,
      validUntil: validUntil.toISOString(),
      status: 'pending',
      date: new Date().toISOString(),
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

    // Store the HTML in the quote for later PDF download (don't auto-download)
    quote.pdfHtml = html;
    saveQuotes([quote, ...quotes]);

    setCurrentQuote({ customerId: '', items: [], notes: '', validDays: 30 });
    setShowCreateQuote(false);
    showEmailNotification('success', `Quote ${quoteNumber} created! Use PDF or Email buttons to send to customer.`);
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

  // Email Functions
  const showEmailNotification = (type, message) => {
    setEmailNotification({ type, message });
    setTimeout(() => setEmailNotification(null), 4000);
  };

  const sendInvoiceEmail = async (customer, invoiceData, paymentLink = null) => {
    if (!customer.email) {
      showEmailNotification('error', 'Customer has no email address');
      return false;
    }

    setIsSendingEmail(true);
    try {
      // Build itemized service list
      let itemizedServices = '';
      if (invoiceData.services && invoiceData.services.length > 0) {
        itemizedServices = invoiceData.services.map(s => 
          `• ${new Date(s.date).toLocaleDateString()} - $${s.totalAmount.toFixed(2)}`
        ).join('\n');
      }
      
      // Calculate due date based on payment terms
      const termsDays = invoiceData.paymentTerms === 'due_receipt' ? 0 : 
                        invoiceData.paymentTerms === 'net15' ? 15 :
                        invoiceData.paymentTerms === 'net30' ? 30 : 15;
      const dueDate = new Date();
      dueDate.setDate(dueDate.getDate() + termsDays);
      const dueDateStr = dueDate.toLocaleDateString();
      const termsText = invoiceData.paymentTerms === 'due_receipt' ? 'Due Upon Receipt' :
                        invoiceData.paymentTerms === 'net15' ? 'Net 15' :
                        invoiceData.paymentTerms === 'net30' ? 'Net 30' : 'Net 15';

      const response = await fetch(`${PAYMENT_SERVER_URL}/send-invoice`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: customer.email,
          template: emailTemplates.monthlyInvoice,
          data: {
            customer_name: customer.name,
            month: invoiceData.month,
            service_summary: invoiceData.serviceSummary,
            itemized_services: itemizedServices,
            subtotal: invoiceData.subtotal.toFixed(2),
            chemical_total: invoiceData.chemicalTotal.toFixed(2),
            total: invoiceData.total.toFixed(2),
            payment_terms: termsText,
            due_date: dueDateStr
          },
          companySettings,
          paymentLink
        })
      });

      const result = await response.json();
      
      if (result.success) {
        // Log the email
        const logEntry = {
          id: Date.now(),
          type: 'invoice',
          to: customer.email,
          customerName: customer.name,
          subject: `Invoice for ${invoiceData.month}`,
          sentDate: new Date().toISOString(),
          status: 'sent'
        };
        saveEmailLog([logEntry, ...emailLog]);
        // Mark customer as billed for this month (persisted with date and terms)
        if (invoiceData.billingMonth) {
          const newBilledCustomers = { 
            ...billedCustomers, 
            [`${customer.id}-${invoiceData.billingMonth}`]: {
              billed: true,
              billedDate: new Date().toISOString(),
              terms: invoiceData.paymentTerms || 'net15',
              amount: invoiceData.total
            }
          };
          saveBilledCustomers(newBilledCustomers);
        }
        showEmailNotification('success', `Invoice sent to ${customer.email}`);
        return true;
      } else {
        throw new Error(result.error || 'Failed to send email');
      }
    } catch (error) {
      console.error('Email error:', error);
      showEmailNotification('error', `Failed to send email: ${error.message}`);
      return false;
    } finally {
      setIsSendingEmail(false);
    }
  };

  const sendWeeklyUpdateEmail = async (customer, serviceData) => {
    if (!customer.email) {
      showEmailNotification('error', 'Customer has no email address');
      return false;
    }

    setIsSendingEmail(true);
    try {
      const chemicalsUsed = serviceData.chemicalsUsed?.length > 0
        ? serviceData.chemicalsUsed.map(c => `• ${c.name}: ${c.quantity} ${c.unit}`).join('\n')
        : '';
      
      // Format water test results if available
      let waterTestResults = '';
      if (serviceData.waterTest) {
        const wt = serviceData.waterTest;
        const results = [];
        if (wt.temp) results.push(`Temp: ${wt.temp}°F`);
        if (wt.chlorine) results.push(`FC: ${wt.chlorine} ppm`);
        if (wt.ph) results.push(`pH: ${wt.ph}`);
        if (wt.alkalinity) results.push(`TA: ${wt.alkalinity} ppm`);
        if (wt.cya) results.push(`CYA: ${wt.cya} ppm`);
        if (wt.hardness) results.push(`Calcium: ${wt.hardness} ppm`);
        if (wt.salt) results.push(`Salt: ${wt.salt} ppm`);
        if (wt.phosphates) results.push(`Phosphates: ${wt.phosphates} ppb`);
        if (results.length > 0) {
          waterTestResults = results.join(' | ');
        }
      }

      const response = await fetch(`${PAYMENT_SERVER_URL}/send-weekly-update`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: customer.email,
          template: emailTemplates.weeklyUpdate,
          data: {
            customer_name: customer.name,
            service_date: new Date(serviceData.date).toLocaleDateString(),
            chemicals_used: chemicalsUsed,
            water_test: waterTestResults,
            service_notes: serviceData.notes || ''
          },
          companySettings
        })
      });

      const result = await response.json();
      
      if (result.success) {
        const logEntry = {
          id: Date.now(),
          type: 'weekly-update',
          to: customer.email,
          customerName: customer.name,
          subject: 'Weekly Pool Service Update',
          sentDate: new Date().toISOString(),
          status: 'sent'
        };
        saveEmailLog([logEntry, ...emailLog]);
        showEmailNotification('success', `Weekly update sent to ${customer.email}`);
        return true;
      } else {
        throw new Error(result.error || 'Failed to send email');
      }
    } catch (error) {
      console.error('Email error:', error);
      showEmailNotification('error', `Failed to send email: ${error.message}`);
      return false;
    } finally {
      setIsSendingEmail(false);
    }
  };

  // Download Quote as PDF/HTML
  const downloadQuotePdf = (quote) => {
    const customer = customers.find(c => c.id === quote.customerId);
    const validUntil = new Date(quote.validUntil).toLocaleDateString();
    
    const html = `<!DOCTYPE html>
<html><head><style>
  body { font-family: 'Segoe UI', Arial, sans-serif; max-width: 800px; margin: 40px auto; padding: 20px; color: #1e3a5f; }
  .header { background: linear-gradient(135deg, #7c3aed 0%, #9333ea 100%); color: white; padding: 30px; border-radius: 12px; margin-bottom: 30px; display: flex; align-items: center; gap: 20px; }
  .header h1 { margin: 0 0 5px 0; font-size: 28px; }
  .logo { width: 60px; height: 60px; }
  .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 30px; margin-bottom: 30px; }
  .info-box h3 { margin: 0 0 10px 0; color: #1e3a5f; font-size: 14px; text-transform: uppercase; letter-spacing: 1px; }
  .info-box p { margin: 5px 0; color: #4a5568; }
  table { width: 100%; border-collapse: collapse; margin: 20px 0; }
  th { background: #7c3aed; color: white; padding: 12px; text-align: left; }
  td { padding: 12px; border-bottom: 1px solid #e2e8f0; }
  .total-box { background: linear-gradient(135deg, #7c3aed 0%, #9333ea 100%); color: white; padding: 20px 30px; border-radius: 12px; text-align: right; }
  .total-box span { font-size: 14px; opacity: 0.9; }
  .total-box div { font-size: 32px; font-weight: bold; margin-top: 5px; }
  .validity { background: #fef3c7; padding: 15px; border-radius: 8px; margin-bottom: 20px; text-align: center; }
</style></head>
<body>
  <div class="header">
    <svg viewBox="0 0 100 110" class="logo">
      <path d="M50 5 L90 25 L90 70 Q90 95 50 105 Q10 95 10 70 L10 25 Z" fill="#a855f7"/>
      <path d="M50 12 L83 28 L83 68 Q83 88 50 98 Q17 88 17 68 L17 28 Z" fill="white" opacity="0.3"/>
      <path d="M20 35 Q35 40 50 35 Q65 30 80 35" stroke="white" stroke-width="2" fill="none" opacity="0.8"/>
      <path d="M20 48 Q35 53 50 48 Q65 43 80 48" stroke="white" stroke-width="2" fill="none" opacity="0.8"/>
      <path d="M20 61 Q35 66 50 61 Q65 56 80 61" stroke="white" stroke-width="2" fill="none" opacity="0.8"/>
    </svg>
    <div>
      <h1>POOL AUTHORITY</h1>
      <p style="margin:0;opacity:0.9;">Quote</p>
    </div>
  </div>
  <h2 style="color:#7c3aed;">${quote.quoteNumber}</h2>
  <div class="validity">⏰ This quote is valid until <strong>${validUntil}</strong></div>
  <div class="info-grid">
    <div class="info-box">
      <h3>Quote For</h3>
      <p><strong>${customer?.name || quote.customerName}</strong></p>
      <p>${customer?.address || ''}</p>
      ${customer?.phone ? `<p>${customer.phone}</p>` : ''}
      ${customer?.email ? `<p>${customer.email}</p>` : ''}
    </div>
    <div class="info-box">
      <h3>Quote Details</h3>
      <p><strong>Quote #:</strong> ${quote.quoteNumber}</p>
      <p><strong>Date:</strong> ${new Date(quote.date).toLocaleDateString()}</p>
      <p><strong>Valid Until:</strong> ${validUntil}</p>
    </div>
  </div>
  <table>
    <thead>
      <tr>
        <th>Description</th>
        <th>Type</th>
        <th>Qty</th>
        <th>Price</th>
        <th>Total</th>
      </tr>
    </thead>
    <tbody>
      ${quote.items.map(item => `
        <tr>
          <td>${item.description}${item.modelNumber ? `<br><small style="color:#666;">Part #: ${item.modelNumber}</small>` : ''}</td>
          <td><span style="background:#f3e8ff;padding:2px 8px;border-radius:4px;font-size:12px;">${item.type}</span></td>
          <td>${item.quantity}</td>
          <td>$${item.price.toFixed(2)}</td>
          <td><strong>$${(item.quantity * item.price).toFixed(2)}</strong></td>
        </tr>
      `).join('')}
    </tbody>
  </table>
  <div class="total-box">
    <span>Quote Total</span>
    <div>$${quote.total.toFixed(2)}</div>
  </div>
  ${quote.notes ? `<div style="margin-top:20px;padding:15px;background:#f8fafc;border-radius:8px;"><strong>Notes:</strong><br>${quote.notes}</div>` : ''}
  <p style="text-align:center;margin-top:30px;color:#666;">To accept this quote, please contact us. Thank you for choosing Pool Authority!</p>
</body></html>`;

    const blob = new Blob([html], { type: 'text/html' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `PoolAuthority-Quote-${quote.quoteNumber}.html`;
    a.click();
  };

  const sendQuoteEmail = async (quote, customer) => {
    if (!customer.email) {
      showEmailNotification('error', 'Customer has no email address');
      return false;
    }

    setIsSendingEmail(true);
    try {
      const lineItems = quote.items.map(i => `• ${i.description}${i.modelNumber ? ` (${i.modelNumber})` : ''} x${i.quantity} - $${(i.quantity * i.price).toFixed(2)}`).join('\n');

      const response = await fetch(`${PAYMENT_SERVER_URL}/send-quote`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: customer.email,
          template: emailTemplates.quote,
          data: {
            customer_name: customer.name,
            quote_number: quote.quoteNumber,
            quote_date: new Date(quote.date).toLocaleDateString(),
            valid_days: quote.validDays || '30',
            line_items: lineItems,
            total: quote.total.toFixed(2)
          },
          companySettings
        })
      });

      const result = await response.json();
      
      if (result.success) {
        const logEntry = {
          id: Date.now(),
          type: 'quote',
          to: customer.email,
          customerName: customer.name,
          subject: `Quote #${quote.quoteNumber}`,
          sentDate: new Date().toISOString(),
          status: 'sent'
        };
        saveEmailLog([logEntry, ...emailLog]);
        showEmailNotification('success', `Quote sent to ${customer.email}`);
        return true;
      } else {
        throw new Error(result.error || 'Failed to send email');
      }
    } catch (error) {
      console.error('Email error:', error);
      showEmailNotification('error', `Failed to send email: ${error.message}`);
      return false;
    } finally {
      setIsSendingEmail(false);
    }
  };

  const sendJobCompletionEmail = async (customer, jobData, paymentLink = null) => {
    if (!customer.email) {
      showEmailNotification('error', 'Customer has no email address');
      return false;
    }

    setIsSendingEmail(true);
    try {
      // Build itemized list
      let itemsList = '';
      if (jobData.additionalItems?.length > 0) {
        itemsList = jobData.additionalItems.map(i => `• ${i.name} x${i.quantity} - $${i.totalCost.toFixed(2)}`).join('\n');
      }
      
      const chemicalsUsed = jobData.chemicalsUsed?.length > 0
        ? jobData.chemicalsUsed.map(c => `• ${c.name}: ${c.quantity} ${c.unit}`).join('\n')
        : '';

      const paymentSection = paymentLink 
        ? `\n**Pay Online:** ${paymentLink}\n`
        : '';

      const jobTemplate = {
        subject: `Service Invoice - ${jobData.jobType} - {{company_name}}`,
        body: `Hi {{customer_name}},

We've completed the following work at your property:

**Job Type:** ${jobData.jobType}
**Date:** {{service_date}}

**Invoice Details:**
━━━━━━━━━━━━━━━━━━━━━━━━━━
Labor/Service: $${jobData.basePrice.toFixed(2)}
${itemsList ? `\n**Parts & Materials:**\n${itemsList}\n` : ''}${chemicalsUsed ? `\n**Chemicals Applied:**\n${chemicalsUsed}\n` : ''}
━━━━━━━━━━━━━━━━━━━━━━━━━━
**Total Due:** $${jobData.total.toFixed(2)}
${paymentSection}
${jobData.notes ? `**Technician Notes:**\n${jobData.notes}\n` : ''}
Thank you for your business!

Best regards,
{{owner_name}}
{{company_name}}
{{company_phone}}`
      };

      const response = await fetch(`${PAYMENT_SERVER_URL}/send-weekly-update`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: customer.email,
          template: jobTemplate,
          data: {
            customer_name: customer.name,
            service_date: new Date().toLocaleDateString()
          },
          companySettings,
          paymentLink
        })
      });

      const result = await response.json();
      
      if (result.success) {
        const logEntry = {
          id: Date.now(),
          type: 'job-invoice',
          to: customer.email,
          customerName: customer.name,
          subject: `Service Invoice - ${jobData.jobType}`,
          sentDate: new Date().toISOString(),
          status: 'sent'
        };
        saveEmailLog([logEntry, ...emailLog]);
        showEmailNotification('success', `Job invoice email sent to ${customer.email}`);
        return true;
      } else {
        throw new Error(result.error || 'Failed to send email');
      }
    } catch (error) {
      console.error('Email error:', error);
      showEmailNotification('error', `Failed to send email: ${error.message}`);
      return false;
    } finally {
      setIsSendingEmail(false);
    }
  };

  const sendPaymentReminder = async (customer, reminderData, paymentLink = null) => {
    if (!customer.email) {
      showEmailNotification('error', 'Customer has no email address');
      return false;
    }

    setIsSendingEmail(true);
    try {
      const response = await fetch(`${PAYMENT_SERVER_URL}/send-invoice`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: customer.email,
          template: emailTemplates.paymentReminder,
          data: {
            customer_name: customer.name,
            month: reminderData.month,
            service_summary: reminderData.serviceSummary,
            total: reminderData.total.toFixed(2),
            days_past_due: reminderData.daysPastDue
          },
          companySettings,
          paymentLink
        })
      });

      const result = await response.json();
      
      if (result.success) {
        const logEntry = {
          id: Date.now(),
          type: 'payment-reminder',
          to: customer.email,
          customerName: customer.name,
          subject: `Payment Reminder for ${reminderData.month}`,
          sentDate: new Date().toISOString(),
          status: 'sent'
        };
        saveEmailLog([logEntry, ...emailLog]);
        showEmailNotification('success', `Payment reminder sent to ${customer.email}`);
        return true;
      } else {
        throw new Error(result.error || 'Failed to send email');
      }
    } catch (error) {
      console.error('Email error:', error);
      showEmailNotification('error', `Failed to send email: ${error.message}`);
      return false;
    } finally {
      setIsSendingEmail(false);
    }
  };

  const updateQuoteStatus = (quoteId, status) => {
    saveQuotes(quotes.map(q => q.id === quoteId ? { ...q, status } : q));
  };

  // Open modal to schedule quote as job
  const convertQuoteToJob = (quote) => {
    setQuoteToSchedule(quote);
    setQuoteJobDate(getLocalDateString()); // Default to today
    setShowScheduleQuoteJob(true);
  };

  // Actually create the job with selected date
  const confirmQuoteToJob = () => {
    if (!quoteToSchedule || !quoteJobDate) return;
    
    const customer = customers.find(c => c.id === quoteToSchedule.customerId);
    if (!customer) return;
    
    const job = {
      id: Date.now(),
      customerId: quoteToSchedule.customerId,
      customerName: quoteToSchedule.customerName,
      jobType: 'quoted-work',
      date: quoteJobDate,
      price: quoteToSchedule.total,
      notes: `From Quote ${quoteToSchedule.quoteNumber}: ${quoteToSchedule.items.map(i => i.description).join(', ')}`,
      quoteId: quoteToSchedule.id,
      quoteItems: quoteToSchedule.items // Store quote items for reference
    };
    saveJobs([...oneTimeJobs, job]);
    updateQuoteStatus(quoteToSchedule.id, 'approved');
    
    // Close modal and reset
    setShowScheduleQuoteJob(false);
    setQuoteToSchedule(null);
    setQuoteJobDate('');
    
    showEmailNotification('success', `Job scheduled for ${new Date(quoteJobDate + 'T12:00:00').toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}`);
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
  const downloadInvoice = (customer, yearMonth, paymentTerms = 'net15') => {
    const services = getMonthServices(customer.id, yearMonth);
    const total = services.reduce((sum, s) => sum + s.totalAmount, 0);
    const totalChemicals = services.reduce((sum, s) => sum + (s.chemicalCost || 0), 0);
    const monthName = new Date(yearMonth + '-01').toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    
    // Calculate due date
    const termsDays = paymentTerms === 'due_receipt' ? 0 : paymentTerms === 'net15' ? 15 : 30;
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + termsDays);
    const dueDateStr = dueDate.toLocaleDateString();
    const termsText = paymentTerms === 'due_receipt' ? 'Due Upon Receipt' : paymentTerms === 'net15' ? 'Net 15' : 'Net 30';
    
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
  .terms-box { background: #fef3c7; padding: 15px; border-radius: 8px; margin-bottom: 20px; }
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
  <div class="terms-box">
    <strong>Payment Terms:</strong> ${termsText} | <strong>Due Date:</strong> ${dueDateStr}
  </div>
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

  // Generate PDF for job/service call invoice
  const downloadJobInvoice = (service, paymentTerms = 'net15') => {
    const customer = customers.find(c => c.id === service.customerId);
    if (!customer) return;
    
    const invoiceNumber = `JOB-${service.id.toString().slice(-8)}`;
    const serviceDate = new Date(service.date).toLocaleDateString();
    
    // Calculate due date
    const termsDays = paymentTerms === 'due_receipt' ? 0 : 
                      paymentTerms === 'net7' ? 7 :
                      paymentTerms === 'net15' ? 15 : 
                      paymentTerms === 'net30' ? 30 :
                      paymentTerms === 'net45' ? 45 :
                      paymentTerms === 'net60' ? 60 : 15;
    const dueDate = new Date(service.date);
    dueDate.setDate(dueDate.getDate() + termsDays);
    const dueDateStr = dueDate.toLocaleDateString();
    const termsText = paymentTerms === 'due_receipt' ? 'Due Upon Receipt' : 
                      `Net ${termsDays}`;

    const html = `<!DOCTYPE html>
<html><head><style>
  body { font-family: 'Segoe UI', Arial, sans-serif; max-width: 800px; margin: 40px auto; padding: 20px; color: #1e3a5f; }
  .header { background: linear-gradient(135deg, #7c3aed 0%, #a855f7 100%); color: white; padding: 30px; border-radius: 12px; margin-bottom: 30px; display: flex; align-items: center; gap: 20px; }
  .header h1 { margin: 0 0 5px 0; font-size: 28px; }
  .logo { width: 60px; height: 60px; }
  .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 30px; margin-bottom: 30px; }
  .info-box h3 { margin: 0 0 10px 0; color: #1e3a5f; font-size: 14px; text-transform: uppercase; letter-spacing: 1px; }
  .info-box p { margin: 5px 0; color: #4a5568; }
  table { width: 100%; border-collapse: collapse; margin: 20px 0; }
  th { background: #7c3aed; color: white; padding: 12px; text-align: left; }
  td { padding: 12px; border-bottom: 1px solid #e2e8f0; }
  .total-box { background: linear-gradient(135deg, #7c3aed 0%, #a855f7 100%); color: white; padding: 20px 30px; border-radius: 12px; text-align: right; }
  .total-box span { font-size: 14px; opacity: 0.9; }
  .total-box div { font-size: 32px; font-weight: bold; margin-top: 5px; }
  .terms-box { background: #fef3c7; padding: 15px; border-radius: 8px; margin-bottom: 20px; }
  .notes-box { background: #f0fdf4; padding: 15px; border-radius: 8px; margin-top: 20px; }
</style></head>
<body>
  <div class="header">
    <svg viewBox="0 0 100 110" class="logo">
      <path d="M50 5 L90 25 L90 70 Q90 95 50 105 Q10 95 10 70 L10 25 Z" fill="#a855f7"/>
      <path d="M50 12 L83 28 L83 68 Q83 88 50 98 Q17 88 17 68 L17 28 Z" fill="white" opacity="0.3"/>
      <path d="M35 45 L45 55 L65 35" stroke="white" stroke-width="6" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
    <div>
      <h1>POOL AUTHORITY</h1>
      <p style="margin:0;opacity:0.9;">Service Call Invoice</p>
    </div>
  </div>
  <h2 style="color:#7c3aed;">Invoice #${invoiceNumber}</h2>
  <div class="terms-box">
    <strong>Payment Terms:</strong> ${termsText} | <strong>Due Date:</strong> ${dueDateStr}
  </div>
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
      <p><strong>Job Type:</strong> ${service.jobType || service.poolType}</p>
      <p><strong>Service Date:</strong> ${serviceDate}</p>
      <p><strong>Invoice Date:</strong> ${new Date().toLocaleDateString()}</p>
    </div>
  </div>
  
  <table>
    <thead>
      <tr>
        <th>Description</th>
        <th style="text-align:right;">Amount</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><strong>${service.jobType || service.poolType}</strong> - Labor</td>
        <td style="text-align:right;">$${service.weeklyRate.toFixed(2)}</td>
      </tr>
      ${(service.additionalItems || []).map(item => `
      <tr>
        <td>${item.name} (x${item.quantity})</td>
        <td style="text-align:right;">$${item.totalCost.toFixed(2)}</td>
      </tr>`).join('')}
      ${(service.chemicalsUsed || []).map(chem => `
      <tr>
        <td>${chem.name} (${chem.quantity} ${chem.unit})</td>
        <td style="text-align:right;">$${chem.totalCost.toFixed(2)}</td>
      </tr>`).join('')}
    </tbody>
  </table>
  
  <div class="total-box">
    <span>Total Due</span>
    <div>$${service.totalAmount.toFixed(2)}</div>
  </div>
  
  ${service.techNotes ? `<div class="notes-box"><strong>Service Notes:</strong><br>${service.techNotes}</div>` : ''}
  
  <div style="margin-top: 40px; text-align: center; color: #718096; font-size: 14px;">
    <p>Thank you for your business!</p>
    <p>${companySettings.companyName || 'Pool Authority'} | ${companySettings.phone || ''} | ${companySettings.email || ''}</p>
  </div>
</body></html>`;

    const blob = new Blob([html], { type: 'text/html' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `PoolAuthority-Job-${invoiceNumber}-${customer.name.replace(/\s+/g, '-')}.html`;
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
      saveJobs([...oneTimeJobs, { 
        ...newJob, 
        id: Date.now(), 
        customerName: customer?.name || 'Unknown',
        scheduledTime: newJob.scheduledTime || null,
        employeeId: newJob.employeeId || null
      }]);
      setNewJob({ customerId: '', jobType: 'opening', date: '', price: 250, notes: '', scheduledTime: null, employeeId: null });
      setShowAddJob(false);
    }
  };

  // Open job completion modal
  const openCompleteJobModal = (job) => {
    setJobToComplete(job);
    setJobCompletionItems([]);
    setJobChemicals([]);
    setJobCompletionNotes('');
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
  const completeJobWithItems = async () => {
    if (!jobToComplete) return;
    
    const additionalCost = jobCompletionItems.reduce((sum, i) => sum + (i.price * i.quantity), 0);
    const chemicalCost = jobChemicals.reduce((sum, c) => sum + (c.quantityUsed * c.costPerUnit), 0);
    const totalAmount = jobToComplete.price + additionalCost + chemicalCost;
    
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
      totalAmount: totalAmount,
      poolType: jobToComplete.jobType,
      jobNotes: jobToComplete.notes,
      techNotes: jobCompletionNotes,
      isJobService: true,  // Flag to distinguish from recurring services
      jobType: jobToComplete.jobType
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
    
    // Send job completion email if enabled
    const customer = customers.find(c => c.id === parseInt(jobToComplete.customerId));
    if (sendJobEmailOnComplete && customer?.email) {
      await sendJobCompletionEmail(customer, {
        jobType: jobToComplete.jobType,
        basePrice: jobToComplete.price,
        additionalItems: itemsUsed,
        chemicalsUsed: chemicalsUsed,
        total: totalAmount,
        notes: jobCompletionNotes
      });
    }
    
    setShowCompleteJobModal(false);
    setJobToComplete(null);
    setJobCompletionItems([]);
    setJobChemicals([]);
    setJobCompletionNotes('');
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
  // All tabs with admin-only flag
  const allTabs = [
    { key: 'home', label: 'Home', icon: Icons.Home, adminOnly: true },
    { key: 'calendar', label: 'Calendar', icon: Icons.Calendar, adminOnly: false },
    { key: 'routes', label: 'Routes', icon: Icons.Map, adminOnly: false },
    { key: 'watertest', label: 'Water Test', icon: Icons.Beaker, adminOnly: false },
    { key: 'customers', label: 'Customers', icon: Icons.Users, adminOnly: true },
    { key: 'recurring', label: 'Recurring', icon: Icons.History, adminOnly: true },
    { key: 'jobs', label: 'Jobs', icon: Icons.Wrench, adminOnly: true },
    { key: 'quotes', label: 'Quotes', icon: Icons.FileText, adminOnly: true },
    { key: 'billing', label: 'Billing', icon: Icons.Receipt, adminOnly: true },
    { key: 'payments', label: 'Payments', icon: Icons.CreditCard, adminOnly: true },
    { key: 'chemicals', label: 'Chemicals', icon: Icons.Beaker, adminOnly: false },
    { key: 'history', label: 'History', icon: Icons.DollarSign, adminOnly: true },
    { key: 'settings', label: 'Settings', icon: Icons.Settings, adminOnly: true },
  ];

  // Filter tabs based on mode
  const tabs = isAdminMode ? allTabs : allTabs.filter(t => !t.adminOnly);

  // Tech mode tabs for mobile bottom nav
  const techMobileTabs = [
    { key: 'routes', label: 'Routes', icon: Icons.Map },
    { key: 'calendar', label: 'Calendar', icon: Icons.Calendar },
    { key: 'chemicals', label: 'Chemicals', icon: Icons.Beaker },
  ];

  // Verify PIN
  const verifyPIN = () => {
    if (pinInput === adminPIN) {
      setIsAdminMode(true);
      setShowPINEntry(false);
      setPinInput('');
      setPinError('');
      setLastActivity(Date.now());
      setActiveTab('home');
    } else {
      setPinError('Incorrect PIN');
      setPinInput('');
    }
  };

  // Setup new PIN
  const setupPIN = () => {
    if (pinInput.length !== 4 || !/^\d+$/.test(pinInput)) {
      setPinError('PIN must be 4 digits');
      return;
    }
    if (confirmPIN !== pinInput) {
      setPinError('PINs do not match');
      return;
    }
    saveAdminPIN(pinInput);
    setShowPINSetup(false);
    setIsAdminMode(true);
    setActiveTab('home');
    setPinInput('');
    setConfirmPIN('');
    setPinError('');
  };

  // Lock to tech mode
  const lockToTechMode = () => {
    setIsAdminMode(false);
    setActiveTab('routes');
  };

  return (
    <div className="min-h-screen pb-20 md:pb-8" style={{ background: 'linear-gradient(180deg, #f0f9ff 0%, #e0f2fe 100%)' }}>
      
      {/* PIN Setup Modal (First Time) */}
      {showPINSetup && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm text-center">
            <div className="text-5xl mb-4">🔐</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Set Up Admin PIN</h2>
            <p className="text-gray-600 mb-6">Create a 4-digit PIN to protect admin features from employees.</p>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Create PIN</label>
                <input
                  type="password"
                  inputMode="numeric"
                  maxLength="4"
                  value={pinInput}
                  onChange={(e) => setPinInput(e.target.value.replace(/\D/g, '').slice(0, 4))}
                  className="w-full px-4 py-3 text-center text-2xl tracking-widest border-2 rounded-xl focus:border-blue-500 focus:outline-none"
                  placeholder="••••"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Confirm PIN</label>
                <input
                  type="password"
                  inputMode="numeric"
                  maxLength="4"
                  value={confirmPIN}
                  onChange={(e) => setConfirmPIN(e.target.value.replace(/\D/g, '').slice(0, 4))}
                  className="w-full px-4 py-3 text-center text-2xl tracking-widest border-2 rounded-xl focus:border-blue-500 focus:outline-none"
                  placeholder="••••"
                />
              </div>
              
              {pinError && <p className="text-red-500 text-sm">{pinError}</p>}
              
              <button
                onClick={setupPIN}
                disabled={pinInput.length !== 4 || confirmPIN.length !== 4}
                className="w-full py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                Set PIN & Continue
              </button>
              
              <button
                onClick={() => {
                  saveAdminPIN('0000');
                  setShowPINSetup(false);
                  setIsAdminMode(true);
                }}
                className="w-full py-2 text-gray-500 text-sm hover:text-gray-700"
              >
                Skip for now (PIN will be 0000)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PIN Entry Modal */}
      {showPINEntry && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm text-center">
            <div className="text-5xl mb-4">🔒</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Admin Access</h2>
            <p className="text-gray-600 mb-6">Enter your PIN to access admin features.</p>
            
            <div className="space-y-4">
              <input
                type="password"
                inputMode="numeric"
                maxLength="4"
                value={pinInput}
                onChange={(e) => setPinInput(e.target.value.replace(/\D/g, '').slice(0, 4))}
                onKeyDown={(e) => e.key === 'Enter' && pinInput.length === 4 && verifyPIN()}
                className="w-full px-4 py-3 text-center text-2xl tracking-widest border-2 rounded-xl focus:border-blue-500 focus:outline-none"
                placeholder="••••"
                autoFocus
              />
              
              {pinError && <p className="text-red-500 text-sm">{pinError}</p>}
              
              <button
                onClick={verifyPIN}
                disabled={pinInput.length !== 4}
                className="w-full py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 disabled:bg-gray-300"
              >
                Unlock
              </button>
              
              <button
                onClick={() => { setShowPINEntry(false); setPinInput(''); setPinError(''); }}
                className="w-full py-2 text-gray-500 text-sm hover:text-gray-700"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Email Notification Popup */}
      {emailNotification && (
        <div className={`fixed top-4 left-4 right-4 md:left-auto md:right-4 md:w-auto z-50 p-4 rounded-lg shadow-lg flex items-center gap-3 animate-pulse ${
          emailNotification.type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
        }`}>
          <span className="text-xl">{emailNotification.type === 'success' ? '✓' : '✗'}</span>
          <span>{emailNotification.message}</span>
        </div>
      )}

      {/* Header */}
      <div className="bg-white shadow-lg border-b-4 sticky top-0 z-40" style={{ borderColor: '#5bb4d8' }}>
        <div className="max-w-6xl mx-auto px-3 md:px-4 py-3 md:py-4 flex items-center gap-3 md:gap-4">
          {/* Pool Authority Shield Logo */}
          <svg viewBox="0 0 100 110" className="w-10 h-10 md:w-14 md:h-14 flex-shrink-0">
            <path d="M50 5 L90 25 L90 70 Q90 95 50 105 Q10 95 10 70 L10 25 Z" fill="#1e3a5f" stroke="#1e3a5f" strokeWidth="2"/>
            <path d="M50 12 L83 28 L83 68 Q83 88 50 98 Q17 88 17 68 L17 28 Z" fill="#5bb4d8"/>
            <path d="M20 35 Q35 40 50 35 Q65 30 80 35" stroke="white" strokeWidth="2.5" fill="none" opacity="0.7"/>
            <path d="M20 48 Q35 53 50 48 Q65 43 80 48" stroke="white" strokeWidth="2.5" fill="none" opacity="0.7"/>
            <path d="M20 61 Q35 66 50 61 Q65 56 80 61" stroke="white" strokeWidth="2.5" fill="none" opacity="0.7"/>
            <path d="M25 74 Q40 79 55 74 Q70 69 78 74" stroke="white" strokeWidth="2.5" fill="none" opacity="0.7"/>
            <path d="M35 85 Q45 88 55 85 Q65 82 70 85" stroke="white" strokeWidth="2" fill="none" opacity="0.6"/>
          </svg>
          <div className="flex-1 min-w-0">
            <h1 className="text-lg md:text-2xl font-black tracking-tight truncate">
              <span style={{ color: '#1e3a5f' }}>POOL</span>
              <span style={{ color: '#9b3544' }}> AUTHORITY</span>
            </h1>
            <p className="text-xs md:text-sm text-gray-500 hidden sm:block">Professional Pool Service Management</p>
          </div>
          
          {/* Admin/Tech Mode Indicator & Controls */}
          <div className="flex items-center gap-2">
            {isAdminMode ? (
              <>
                <span className="hidden md:inline-block text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full font-medium">
                  🔓 Admin Mode
                </span>
                <button
                  onClick={lockToTechMode}
                  className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                  title="Lock to Tech Mode"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                </button>
              </>
            ) : (
              <button
                onClick={() => setShowPINEntry(true)}
                className="flex items-center gap-1 px-3 py-1.5 text-xs bg-gray-100 text-gray-600 hover:bg-blue-100 hover:text-blue-700 rounded-lg transition-all"
                title="Admin Login"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                <span className="hidden sm:inline">Admin</span>
              </button>
            )}
            <span className="text-xs text-gray-400 hidden md:block">v3.4.0</span>
          </div>
        </div>
      </div>

      {/* Desktop Navigation - Hidden on mobile */}
      <div className="max-w-6xl mx-auto px-4 py-4 hidden md:block">
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

      {/* Mobile Bottom Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg z-50 safe-area-bottom">
        <div className="flex justify-around items-center py-2 px-1">
          {(isAdminMode ? [
            { key: 'home', label: 'Home', icon: Icons.Home },
            { key: 'routes', label: 'Routes', icon: Icons.Map },
            { key: 'customers', label: 'Customers', icon: Icons.Users },
            { key: 'jobs', label: 'Jobs', icon: Icons.Wrench },
            { key: 'more', label: 'More', icon: Icons.Menu },
          ] : [
            { key: 'routes', label: 'Routes', icon: Icons.Map },
            { key: 'watertest', label: 'Water Test', icon: Icons.Beaker },
            { key: 'calendar', label: 'Calendar', icon: Icons.Calendar },
            { key: 'admin', label: 'Admin', icon: Icons.Settings },
          ]).map(({ key, label, icon: Icon }) => (
            key === 'admin' ? (
              <button
                key={key}
                onClick={() => setShowPINEntry(true)}
                className="flex flex-col items-center px-3 py-1 rounded-lg text-gray-600"
              >
                <div className="p-1.5 rounded-lg">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                </div>
                <span className="text-xs mt-1 font-medium">{label}</span>
              </button>
            ) :
            key === 'more' ? (
              <div key={key} className="relative">
                <button
                  onClick={() => setShowMobileMenu(!showMobileMenu)}
                  className={`flex flex-col items-center px-3 py-1 rounded-lg ${
                    showMobileMenu ? 'text-blue-600' : 'text-gray-600'
                  }`}
                >
                  <Icon />
                  <span className="text-xs mt-1">{label}</span>
                </button>
                
                {/* More Menu Popup */}
                {showMobileMenu && (
                  <div className="absolute bottom-full right-0 mb-2 bg-white rounded-xl shadow-2xl border p-2 min-w-48">
                    {tabs.filter(t => !['home', 'routes', 'customers', 'jobs'].includes(t.key)).map(({ key, label, icon: TabIcon }) => (
                      <button
                        key={key}
                        onClick={() => {
                          setActiveTab(key);
                          setShowMobileMenu(false);
                        }}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left ${
                          activeTab === key ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        <TabIcon />
                        <span className="font-medium">{label}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <button
                key={key}
                onClick={() => {
                  setActiveTab(key);
                  setShowMobileMenu(false);
                }}
                className={`flex flex-col items-center px-3 py-1 rounded-lg transition-all ${
                  activeTab === key
                    ? 'text-blue-600'
                    : 'text-gray-600'
                }`}
              >
                <div className={`p-1.5 rounded-lg ${activeTab === key ? 'bg-blue-100' : ''}`}>
                  <Icon />
                </div>
                <span className="text-xs mt-1 font-medium">{label}</span>
              </button>
            )
          ))}
        </div>
      </div>

      {/* Click outside to close mobile menu */}
      {showMobileMenu && (
        <div 
          className="md:hidden fixed inset-0 z-40" 
          onClick={() => setShowMobileMenu(false)}
        />
      )}

      {/* Content */}
      <div className="max-w-6xl mx-auto px-3 md:px-4 pb-8 md:pt-0 pt-2">
        
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
                          onClick={() => {
                            setPaymentToMark({ 
                              invoiceKey: `ar-${account.id}`, 
                              customerId: account.id, 
                              customerName: account.name, 
                              amount: account.balance 
                            });
                            setPaymentMethod({ method: 'electronic', checkNumber: '', source: '' });
                            setShowPaymentMethodModal(true);
                          }}
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
                        <div className="text-sm text-gray-500">{job.jobType} • {(() => {
                          const [y, m, d] = job.date.split('-').map(Number);
                          return new Date(y, m - 1, d).toLocaleDateString();
                        })()}</div>
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
                    const isToday = dateStr === getLocalDateString();
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
          <div className="space-y-4 md:space-y-6">
            
            {/* MOBILE: Sticky Header with Date Nav */}
            <div className="md:hidden">
              <div className="bg-gradient-to-r from-blue-900 to-blue-700 text-white p-4 rounded-xl shadow-lg">
                <div className="flex items-center justify-between">
                  <button
                    onClick={() => changeRouteDate(-1)}
                    className="w-12 h-12 flex items-center justify-center bg-white/20 rounded-full active:bg-white/30"
                  >
                    <Icons.ChevronLeft />
                  </button>
                  <div className="text-center">
                    <div className="text-2xl font-black">{formatRouteDate(routeDate)}</div>
                    <div className="text-sm opacity-90">
                      {(() => {
                        const [y, m, d] = routeDate.split('-').map(Number);
                        return new Date(y, m - 1, d).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
                      })()}
                    </div>
                  </div>
                  <button
                    onClick={() => changeRouteDate(1)}
                    className="w-12 h-12 flex items-center justify-center bg-white/20 rounded-full active:bg-white/30"
                  >
                    <Icons.ChevronRight />
                  </button>
                </div>
                
                {/* Quick Stats */}
                <div className="flex justify-around mt-4 pt-3 border-t border-white/20">
                  <div className="text-center">
                    <div className="text-2xl font-bold">{routeCustomers.length}</div>
                    <div className="text-xs opacity-75">Stops</div>
                  </div>
                  {isAdminMode && (
                    <div className="text-center">
                      <div className="text-2xl font-bold">${routeCustomers.reduce((sum, c) => sum + (c.isOneTimeJob ? c.jobPrice : c.weeklyRate), 0)}</div>
                      <div className="text-xs opacity-75">Est. Total</div>
                    </div>
                  )}
                  <div className="text-center">
                    <div className="text-2xl font-bold">{routeCustomers.filter(c => c.recurringId).length}</div>
                    <div className="text-xs opacity-75">Recurring</div>
                  </div>
                </div>
                
                {routeDate !== getLocalDateString() && (
                  <button
                    onClick={() => setRouteDate(getLocalDateString())}
                    className="w-full mt-3 py-2 bg-white/20 rounded-lg text-sm font-medium"
                  >
                    Jump to Today
                  </button>
                )}
              </div>
              
              {/* Employee Filter Pills - Mobile */}
              <div className="flex gap-2 overflow-x-auto py-3 px-1 -mx-1">
                <button
                  onClick={() => setSelectedRouteEmployee('all')}
                  className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap ${
                    selectedRouteEmployee === 'all' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 shadow'
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => setSelectedRouteEmployee('')}
                  className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap ${
                    selectedRouteEmployee === '' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 shadow'
                  }`}
                >
                  Unassigned
                </button>
                {employees.map(emp => (
                  <button
                    key={emp.id}
                    onClick={() => setSelectedRouteEmployee(emp.id)}
                    className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap ${
                      selectedRouteEmployee === emp.id ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 shadow'
                    }`}
                  >
                    {emp.name}
                  </button>
                ))}
                {isAdminMode && (
                  <button
                    onClick={() => setShowEmployeeManager(true)}
                    className="px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap bg-gray-100 text-gray-600 flex items-center gap-1"
                  >
                    <Icons.Plus /> Add
                  </button>
                )}
              </div>
            </div>

            {/* DESKTOP: Original Header */}
            <div className="hidden md:block bg-white rounded-xl p-4 shadow-lg">
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
                    {(() => {
                      const [y, m, d] = routeDate.split('-').map(Number);
                      return new Date(y, m - 1, d).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
                    })()}
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
              
              {/* Employee Filter & Management */}
              <div className="mt-4 pt-4 border-t flex items-center justify-between flex-wrap gap-3">
                <div className="flex items-center gap-3">
                  <label className="text-sm font-medium text-gray-700">Filter by Employee:</label>
                  <select
                    value={selectedRouteEmployee}
                    onChange={(e) => setSelectedRouteEmployee(e.target.value)}
                    className="px-3 py-2 border rounded-lg text-sm"
                  >
                    <option value="all">All Employees</option>
                    <option value="">Unassigned</option>
                    {employees.map(emp => (
                      <option key={emp.id} value={emp.id}>{emp.name}</option>
                    ))}
                  </select>
                  {selectedRouteEmployee !== 'all' && (
                    <button
                      onClick={() => setSelectedRouteEmployee('all')}
                      className="text-sm text-blue-600 hover:underline"
                    >
                      Show All
                    </button>
                  )}
                </div>
                {isAdminMode && (
                  <button
                    onClick={() => setShowEmployeeManager(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200 transition-all"
                  >
                    <Icons.Users />
                    Manage Employees
                  </button>
                )}
              </div>

              {routeDate !== getLocalDateString() && (
                <div className="mt-3 text-center">
                  <button
                    onClick={() => setRouteDate(getLocalDateString())}
                    className="text-sm text-blue-600 hover:text-blue-800 underline"
                  >
                    Jump to Today
                  </button>
                </div>
              )}
            </div>

            {/* Admin-only: Customer Selection Grid */}
            {isAdminMode && (
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
                        </div>
                        <div className="text-green-600 font-bold">${customer.weeklyRate}</div>
                      </label>
                    );
                  })}
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
                    {routeCustomers.map((customer, idx) => {
                      const employee = customer.employeeId ? employees.find(e => e.id === customer.employeeId) : null;
                      const employeeColor = employee ? employeeColors[employees.indexOf(employee) % employeeColors.length] : null;
                      
                      return (
                        <div key={`${customer.id}-${customer.isOneTimeJob ? 'job' : 'recurring'}-${idx}`} className={`flex items-center gap-3 p-3 rounded-lg ${customer.recurringId ? 'bg-blue-50' : customer.isOneTimeJob ? 'bg-purple-50' : 'bg-gray-50'}`}>
                          <div className="flex flex-col gap-1">
                            <button onClick={() => moveInRoute(idx, -1)} disabled={idx === 0} className="text-gray-400 hover:text-gray-600 disabled:opacity-30">▲</button>
                            <button onClick={() => moveInRoute(idx, 1)} disabled={idx === routeCustomers.length - 1} className="text-gray-400 hover:text-gray-600 disabled:opacity-30">▼</button>
                          </div>
                          <div className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold" style={{ background: customer.isOneTimeJob ? '#7c3aed' : '#1e3a5f' }}>
                            {idx + 1}
                          </div>
                          <div className="flex-1">
                            <div className="font-medium flex items-center gap-2 flex-wrap">
                              {customer.name}
                              {customer.scheduledTime && (
                                <span className="text-xs bg-amber-100 text-amber-800 px-2 py-0.5 rounded font-bold">
                                  🕐 {customer.scheduledTime}
                                </span>
                              )}
                              {customer.recurringId && (
                                <span className="text-xs bg-blue-200 text-blue-800 px-2 py-0.5 rounded capitalize">{customer.frequency}</span>
                              )}
                              {customer.isOneTimeJob && (
                                <span className="text-xs bg-purple-200 text-purple-800 px-2 py-0.5 rounded">{customer.jobType}</span>
                              )}
                              {employee && (
                                <span 
                                  className="text-xs px-2 py-0.5 rounded"
                                  style={{ backgroundColor: employeeColor?.bg, color: employeeColor?.text }}
                                >
                                  {employee.name}
                                </span>
                              )}
                            </div>
                            <div className="text-sm text-gray-500">{customer.address}</div>
                            <div className="flex items-center gap-2 mt-1 flex-wrap">
                              {customer.gateCode && <span className="text-xs text-blue-600">Gate: {customer.gateCode}</span>}
                              {customer.dogName && <span className="text-xs text-amber-600">🐕 {customer.dogName}</span>}
                              {/* Quick Reassign Dropdown */}
                              {(customer.recurringId || customer.isOneTimeJob) && employees.length > 0 && (
                                <select
                                  value={customer.employeeId || ''}
                                  onChange={(e) => {
                                    const newEmployeeId = e.target.value ? parseInt(e.target.value) : null;
                                    if (customer.isOneTimeJob) {
                                      updateJob(customer.jobId, { employeeId: newEmployeeId });
                                    } else if (customer.recurringId) {
                                      updateRecurringService(customer.recurringId, { employeeId: newEmployeeId });
                                    }
                                  }}
                                  className="text-xs px-2 py-1 border rounded bg-white"
                                  title="Assign to employee"
                                >
                                  <option value="">Unassigned</option>
                                  {employees.map(emp => (
                                    <option key={emp.id} value={emp.id}>{emp.name}</option>
                                  ))}
                                </select>
                              )}
                            </div>
                          </div>
                          {isAdminMode && <div className="font-bold text-green-600">${customer.isOneTimeJob ? customer.jobPrice : customer.weeklyRate}</div>}
                          {customer.isOneTimeJob ? (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                console.log('JOB Complete clicked', customer);
                                const job = customer.jobData || 
                                            oneTimeJobs.find(j => j.id === customer.jobId) ||
                                            oneTimeJobs.find(j => String(j.customerId) === String(customer.id) && j.date === routeDate);
                                console.log('Found job:', job);
                                if (job) {
                                  setJobToComplete(job);
                                  setJobCompletionItems([]);
                                  setJobChemicals([]);
                                  setJobCompletionNotes('');
                                  setShowCompleteJobModal(true);
                                } else {
                                  alert('Job not found. oneTimeJobs count: ' + oneTimeJobs.length);
                                }
                              }}
                              className="px-3 py-1 bg-purple-600 text-white text-sm rounded-lg hover:bg-purple-700"
                            >
                              Complete Job
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                console.log('SERVICE Complete clicked', customer);
                                completeService(customer);
                              }}
                              className="px-3 py-1 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700"
                            >
                              Complete
                            </button>
                          )}
                          {!customer.recurringId && !customer.isOneTimeJob && (
                            <button onClick={() => toggleRouteCustomer(customer)} className="text-red-500 hover:text-red-700">
                              <Icons.X />
                            </button>
                          )}
                        </div>
                      );
                    })}
                    {isAdminMode && (
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
                    )}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-500 mb-2">No customers scheduled for {formatRouteDate(routeDate)}</p>
                    <p className="text-sm text-gray-400">Add recurring services or one-time jobs to populate routes automatically</p>
                  </div>
                )}
              </div>
            </div>
            )}
            {!isAdminMode && (
              /* Tech Mode: Simple Route List */
              <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="p-4 border-b flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-bold text-gray-800">Today's Stops</h2>
                    <p className="text-sm text-gray-500">{routeCustomers.length} customers</p>
                  </div>
                  {routeCustomers.length > 0 && (
                    <a
                      href={getGoogleMapsRouteUrl()}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg"
                    >
                      <Icons.Navigation />
                      Start Route
                    </a>
                  )}
                </div>
                
                {routeCustomers.length > 0 ? (
                  <div className="divide-y">
                    {routeCustomers.map((customer, idx) => (
                      <div key={`${customer.id}-${idx}`} className="p-4">
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0" style={{ background: customer.isOneTimeJob ? '#7c3aed' : '#1e3a5f' }}>
                            {idx + 1}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="font-bold text-gray-800">{customer.name}</div>
                            <div className="text-sm text-gray-500">{customer.address}</div>
                            <div className="flex flex-wrap gap-2 mt-2">
                              {customer.scheduledTime && (
                                <span className="text-xs bg-amber-100 text-amber-800 px-2 py-1 rounded-full font-bold">
                                  🕐 {customer.scheduledTime}
                                </span>
                              )}
                              {customer.gateCode && (
                                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                                  🔑 {customer.gateCode}
                                </span>
                              )}
                              {customer.dogName && (
                                <span className="text-xs bg-amber-100 text-amber-800 px-2 py-1 rounded-full">
                                  🐕 {customer.dogName}
                                </span>
                              )}
                              {customer.isOneTimeJob && (
                                <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded-full">
                                  🔧 {customer.jobType}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2 mt-3 ml-13">
                          <a
                            href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(customer.address)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-1 py-2 bg-blue-50 text-blue-600 rounded-lg text-center text-sm font-medium"
                          >
                            📍 Navigate
                          </a>
                          {customer.isOneTimeJob ? (
                            <button
                              onClick={() => {
                                const job = customer.jobData || oneTimeJobs.find(j => j.id === customer.jobId);
                                if (job) {
                                  setJobToComplete(job);
                                  setJobCompletionItems([]);
                                  setJobChemicals([]);
                                  setJobCompletionNotes('');
                                  setShowCompleteJobModal(true);
                                }
                              }}
                              className="flex-1 py-2 bg-purple-600 text-white rounded-lg text-center text-sm font-medium"
                            >
                              ✓ Complete Job
                            </button>
                          ) : (
                            <button
                              onClick={() => completeService(customer)}
                              className="flex-1 py-2 bg-green-600 text-white rounded-lg text-center text-sm font-medium"
                            >
                              ✓ Complete
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-8 text-center text-gray-500">
                    <p>No stops scheduled for today</p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* WATER TEST TAB */}
        {activeTab === 'watertest' && (
          <div className="space-y-4">
            {/* Main Water Test Card - Compact Orenda-Style */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              {/* Header with Customer & Pool Info */}
              <div className="bg-gradient-to-r from-cyan-600 to-blue-600 p-4 text-white">
                <h2 className="text-lg font-bold mb-3">💧 Water Test & Dosing Calculator</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  <div>
                    <label className="block text-xs text-cyan-100 mb-1">Customer</label>
                    <select
                      value={waterTestCustomer}
                      onChange={(e) => {
                        setWaterTestCustomer(e.target.value);
                        const customer = customers.find(c => c.id === parseInt(e.target.value));
                        if (customer?.poolGallons) setWaterTestPoolGallons(customer.poolGallons);
                      }}
                      className="w-full px-2 py-1.5 bg-white/20 border border-white/30 rounded text-white text-sm"
                    >
                      <option value="" className="text-gray-800">-- Select --</option>
                      {customers.map(c => (
                        <option key={c.id} value={c.id} className="text-gray-800">{c.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-cyan-100 mb-1">Pool Gallons</label>
                    <input
                      type="number"
                      value={waterTestPoolGallons}
                      onChange={(e) => setWaterTestPoolGallons(parseInt(e.target.value) || 15000)}
                      className="w-full px-2 py-1.5 bg-white/20 border border-white/30 rounded text-white text-center font-bold text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-cyan-100 mb-1">🌡️ Temp °F</label>
                    <input
                      type="number"
                      value={waterTestTemperature}
                      onChange={(e) => setWaterTestTemperature(parseInt(e.target.value) || 78)}
                      className="w-full px-2 py-1.5 bg-orange-400/30 border border-orange-300/50 rounded text-white text-center font-bold text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-cyan-100 mb-1">Chlorine Type</label>
                    <select
                      value={waterTestChemicalTypes.chlorine}
                      onChange={(e) => setWaterTestChemicalTypes({...waterTestChemicalTypes, chlorine: e.target.value})}
                      className="w-full px-2 py-1.5 bg-white/20 border border-white/30 rounded text-white text-xs"
                    >
                      <option value="liquid12" className="text-gray-800">Liquid 12.5%</option>
                      <option value="liquid10" className="text-gray-800">Liquid 10%</option>
                      <option value="calHypo68" className="text-gray-800">Cal-Hypo 68%</option>
                      <option value="calHypo73" className="text-gray-800">Cal-Hypo 73%</option>
                      <option value="dichlor" className="text-gray-800">Dichlor 56%</option>
                      <option value="trichlor" className="text-gray-800">Trichlor</option>
                    </select>
                  </div>
                </div>
                {/* Acid Type inline */}
                <div className="mt-2 flex items-center gap-3">
                  <label className="text-xs text-cyan-100">Acid:</label>
                  <select
                    value={waterTestChemicalTypes.acid}
                    onChange={(e) => setWaterTestChemicalTypes({...waterTestChemicalTypes, acid: e.target.value})}
                    className="px-2 py-1 bg-white/20 border border-white/30 rounded text-white text-xs"
                  >
                    <option value="muriatic" className="text-gray-800">Muriatic</option>
                    <option value="dryAcid" className="text-gray-800">Dry Acid</option>
                  </select>
                  <label className="text-xs text-cyan-100 ml-4">CYA:</label>
                  <select
                    value={waterTestChemicalTypes.cya}
                    onChange={(e) => setWaterTestChemicalTypes({...waterTestChemicalTypes, cya: e.target.value})}
                    className="px-2 py-1 bg-white/20 border border-white/30 rounded text-white text-xs"
                  >
                    <option value="granular" className="text-gray-800">Granular</option>
                    <option value="liquid" className="text-gray-800">Liquid</option>
                  </select>
                </div>
              </div>

              {/* Water Test Grid - Current vs Target */}
              <div className="p-4 bg-cyan-50">
                {/* Headers */}
                <div className="grid grid-cols-3 gap-1 mb-2 text-xs text-center font-bold">
                  <div></div>
                  <div className="text-blue-700 bg-blue-100 rounded py-1">CURRENT</div>
                  <div className="text-green-700 bg-green-100 rounded py-1">TARGET</div>
                </div>
                
                {/* Reading Rows */}
                <div className="space-y-1">
                  {[
                    { key: 'freeChlorine', targetKey: 'freeChlorine', label: 'Free Chlorine (FC)', unit: 'ppm', step: '0.1' },
                    { key: 'pH', targetKey: 'pH', label: 'pH', unit: '', step: '0.1' },
                    { key: 'alkalinity', targetKey: 'alkalinity', label: 'Total Alkalinity (TA)', unit: 'ppm' },
                    { key: 'cyanuricAcid', targetKey: 'cyanuricAcid', label: 'Cyanuric Acid (CYA)', unit: 'ppm' },
                    { key: 'calciumHardness', targetKey: 'calciumHardness', label: 'Calcium Hardness (CH)', unit: 'ppm' },
                    { key: 'salt', targetKey: 'salt', label: 'Salt', unit: 'ppm' },
                    { key: 'phosphates', targetKey: null, label: 'Phosphates', unit: 'ppb' },
                  ].map(({ key, targetKey, label, unit, step }) => (
                    <div key={key} className="grid grid-cols-3 gap-1 items-center">
                      <label className="text-xs text-gray-600 truncate pr-1">{label}</label>
                      <input
                        type="number"
                        step={step || '1'}
                        value={waterTestReadings[key]}
                        onChange={(e) => setWaterTestReadings({...waterTestReadings, [key]: e.target.value})}
                        className="px-2 py-1.5 border rounded text-center font-bold text-sm bg-blue-50 focus:bg-blue-100 focus:border-blue-500 focus:outline-none"
                        placeholder="-"
                      />
                      {targetKey ? (
                        <input
                          type="number"
                          step={step || '1'}
                          value={waterTestTargets[targetKey]}
                          onChange={(e) => setWaterTestTargets({...waterTestTargets, [targetKey]: parseFloat(e.target.value) || 0})}
                          className="px-2 py-1.5 border rounded text-center font-bold text-sm bg-green-50 focus:bg-green-100 focus:border-green-500 focus:outline-none"
                        />
                      ) : (
                        <div className="px-2 py-1.5 text-center text-xs text-gray-400">&lt; 500</div>
                      )}
                    </div>
                  ))}
                </div>

                {/* LSI Display - Current vs Target */}
                {(() => {
                  const calcLSI = (ph, temp, calcium, alk, cya, salt) => {
                    if (!ph || !alk) return null;
                    const tempTable = [{t:32,f:0.0},{t:37,f:0.1},{t:46,f:0.2},{t:53,f:0.3},{t:60,f:0.4},{t:66,f:0.5},{t:76,f:0.6},{t:84,f:0.7},{t:94,f:0.8},{t:105,f:0.9}];
                    let TF = 0.6;
                    for (let i = 0; i < tempTable.length - 1; i++) {
                      if (temp >= tempTable[i].t && temp <= tempTable[i+1].t) {
                        TF = tempTable[i].f + ((temp - tempTable[i].t) / (tempTable[i+1].t - tempTable[i].t)) * (tempTable[i+1].f - tempTable[i].f);
                        break;
                      }
                    }
                    const calcTable = [{c:25,f:1.0},{c:50,f:1.3},{c:75,f:1.5},{c:100,f:1.6},{c:150,f:1.8},{c:200,f:1.9},{c:300,f:2.1},{c:400,f:2.2},{c:800,f:2.5}];
                    let CF = 1.9;
                    for (let i = 0; i < calcTable.length - 1; i++) {
                      if (calcium >= calcTable[i].c && calcium <= calcTable[i+1].c) {
                        CF = calcTable[i].f + ((calcium - calcTable[i].c) / (calcTable[i+1].c - calcTable[i].c)) * (calcTable[i+1].f - calcTable[i].f);
                        break;
                      }
                    }
                    const cyaCorr = ph <= 7.2 ? 0.31 : ph <= 7.6 ? 0.33 : 0.35;
                    const carbAlk = Math.max(alk - ((cya || 0) * cyaCorr), 10);
                    const alkTable = [{a:25,f:1.4},{a:50,f:1.7},{a:75,f:1.9},{a:100,f:2.0},{a:150,f:2.2},{a:200,f:2.3},{a:300,f:2.5},{a:400,f:2.6}];
                    let AF = 2.0;
                    for (let i = 0; i < alkTable.length - 1; i++) {
                      if (carbAlk >= alkTable[i].a && carbAlk <= alkTable[i+1].a) {
                        AF = alkTable[i].f + ((carbAlk - alkTable[i].a) / (alkTable[i+1].a - alkTable[i].a)) * (alkTable[i+1].f - alkTable[i].f);
                        break;
                      }
                    }
                    const tds = 1000 + (salt || 0);
                    const TDSF = tds < 1000 ? 12.0 : tds < 2000 ? 12.1 : tds < 4000 ? 12.2 : 12.3;
                    return ph + TF + CF + AF - TDSF;
                  };
                  
                  const temp = waterTestTemperature || 78;
                  const currentLSI = calcLSI(
                    parseFloat(waterTestReadings.pH) || 0,
                    temp,
                    parseFloat(waterTestReadings.calciumHardness) || 250,
                    parseFloat(waterTestReadings.alkalinity) || 0,
                    parseFloat(waterTestReadings.cyanuricAcid) || 0,
                    parseFloat(waterTestReadings.salt) || 0
                  );
                  const targetLSI = calcLSI(
                    waterTestTargets.pH || 7.5,
                    temp,
                    waterTestTargets.calciumHardness || 300,
                    waterTestTargets.alkalinity || 100,
                    waterTestTargets.cyanuricAcid || 40,
                    waterTestTargets.salt || 0
                  );
                  
                  const getColor = (lsi) => {
                    if (lsi === null) return '#9ca3af';
                    if (lsi >= 0.31) return '#a855f7';
                    if (lsi >= 0) return '#22c55e';
                    if (lsi >= -0.30) return '#eab308';
                    return '#ef4444';
                  };
                  const getText = (lsi) => {
                    if (lsi === null) return '--';
                    if (lsi >= 0.31) return 'SCALING';
                    if (lsi >= 0) return 'BALANCED';
                    if (lsi >= -0.30) return 'OK';
                    return 'CORROSIVE';
                  };
                  
                  const showLSI = waterTestReadings.pH && waterTestReadings.alkalinity;
                  
                  return showLSI ? (
                    <div className="grid grid-cols-2 gap-3 mt-3 p-3 bg-white rounded-lg border">
                      <div className="text-center">
                        <div className="text-xs text-gray-500 mb-1">Current LSI</div>
                        <div className="text-2xl font-black" style={{color: getColor(currentLSI)}}>
                          {currentLSI !== null ? `${currentLSI >= 0 ? '+' : ''}${currentLSI.toFixed(2)}` : '--'}
                        </div>
                        <div className="text-xs font-bold" style={{color: getColor(currentLSI)}}>{getText(currentLSI)}</div>
                      </div>
                      <div className="text-center">
                        <div className="text-xs text-gray-500 mb-1">Target LSI</div>
                        <div className="text-2xl font-black" style={{color: getColor(targetLSI)}}>
                          {targetLSI !== null ? `${targetLSI >= 0 ? '+' : ''}${targetLSI.toFixed(2)}` : '--'}
                        </div>
                        <div className="text-xs font-bold" style={{color: getColor(targetLSI)}}>{getText(targetLSI)}</div>
                      </div>
                    </div>
                  ) : null;
                })()}

                {/* Real-Time Dosing Recommendations - Orenda Style with Multiple Options */}
                {(() => {
                  const gallons = waterTestPoolGallons || 15000;
                  const factor = gallons / 10000;
                  
                  // Helper functions for display
                  const formatFlOz = (oz) => {
                    if (oz >= 128) return `${(oz / 128).toFixed(2)} gal`;
                    if (oz >= 32) return `${(oz / 32).toFixed(1)} qt`;
                    return `${oz.toFixed(1)} fl oz`;
                  };
                  const formatOz = (oz) => {
                    if (oz >= 16) return `${(oz / 16).toFixed(2)} lbs`;
                    return `${oz.toFixed(1)} oz`;
                  };
                  
                  const dosingSections = [];
                  
                  // CHLORINE - Show multiple options
                  const fcCurr = parseFloat(waterTestReadings.freeChlorine) || 0;
                  const fcTarg = waterTestTargets.freeChlorine || 3;
                  if (fcCurr > 0 && fcTarg > fcCurr) {
                    const ppmNeeded = fcTarg - fcCurr;
                    // Rates: fl oz or oz per 1 ppm per 10,000 gal
                    const chlorineOptions = [
                      { name: 'Liquid Chlorine 12.5%', rate: 10.7, isLiquid: true, selected: waterTestChemicalTypes.chlorine === 'liquid12' },
                      { name: 'Liquid Chlorine 10%', rate: 12.8, isLiquid: true, selected: waterTestChemicalTypes.chlorine === 'liquid10' },
                      { name: 'Cal-Hypo 73%', rate: 2.0, isLiquid: false, selected: waterTestChemicalTypes.chlorine === 'calHypo73' },
                      { name: 'Cal-Hypo 68%', rate: 2.1, isLiquid: false, selected: waterTestChemicalTypes.chlorine === 'calHypo68' },
                      { name: 'Dichlor 56%', rate: 2.1, isLiquid: false, selected: waterTestChemicalTypes.chlorine === 'dichlor' },
                      { name: 'Trichlor 90%', rate: 1.3, isLiquid: false, selected: waterTestChemicalTypes.chlorine === 'trichlor' },
                    ];
                    dosingSections.push({
                      title: `Raise Chlorine: ${fcCurr} → ${fcTarg} ppm (+${ppmNeeded.toFixed(1)})`,
                      color: 'yellow',
                      options: chlorineOptions.map(opt => ({
                        ...opt,
                        amount: opt.isLiquid ? formatFlOz(ppmNeeded * opt.rate * factor) : formatOz(ppmNeeded * opt.rate * factor)
                      }))
                    });
                  }
                  
                  // pH DOWN - Show acid options
                  const phCurr = parseFloat(waterTestReadings.pH) || 0;
                  const phTarg = waterTestTargets.pH || 7.5;
                  if (phCurr > 0 && phCurr > phTarg + 0.05) {
                    const phDrop = phCurr - phTarg;
                    // Muriatic: ~25.6 fl oz per 10 ppm TA drop, or ~16 fl oz per 0.2 pH drop
                    // Dry Acid: ~2.1 lbs (33.6 oz) per 10 ppm TA drop
                    const acidOptions = [
                      { name: 'Muriatic Acid 31.45%', rate: 16, isLiquid: true, selected: waterTestChemicalTypes.acid === 'muriatic' },
                      { name: 'Dry Acid (Sodium Bisulfate)', rate: 12, isLiquid: false, selected: waterTestChemicalTypes.acid === 'dryAcid' },
                    ];
                    dosingSections.push({
                      title: `Lower pH: ${phCurr.toFixed(1)} → ${phTarg.toFixed(1)} (-${phDrop.toFixed(2)})`,
                      color: 'red',
                      options: acidOptions.map(opt => ({
                        ...opt,
                        amount: opt.isLiquid 
                          ? formatFlOz((phDrop / 0.2) * opt.rate * factor)
                          : formatOz((phDrop / 0.2) * opt.rate * factor)
                      }))
                    });
                  }
                  
                  // pH UP
                  if (phCurr > 0 && phTarg > phCurr + 0.05) {
                    const phRaise = phTarg - phCurr;
                    // Soda Ash: 6 oz per 0.2 pH per 10k gal
                    dosingSections.push({
                      title: `Raise pH: ${phCurr.toFixed(1)} → ${phTarg.toFixed(1)} (+${phRaise.toFixed(2)})`,
                      color: 'blue',
                      options: [
                        { name: 'Soda Ash', amount: formatOz((phRaise / 0.2) * 6 * factor), selected: true }
                      ]
                    });
                  }
                  
                  // ALKALINITY UP
                  const taCurr = parseFloat(waterTestReadings.alkalinity) || 0;
                  const taTarg = waterTestTargets.alkalinity || 100;
                  if (taCurr > 0 && taTarg > taCurr + 5) {
                    const taRaise = taTarg - taCurr;
                    // Sodium Bicarb: 1.4 lbs per 10 ppm per 10k gal
                    dosingSections.push({
                      title: `Raise Alkalinity: ${taCurr} → ${taTarg} ppm (+${taRaise})`,
                      color: 'blue',
                      options: [
                        { name: 'Sodium Bicarbonate', amount: `${((taRaise / 10) * 1.4 * factor).toFixed(2)} lbs`, selected: true }
                      ]
                    });
                  }
                  
                  // CYA / STABILIZER
                  const cyaCurr = parseFloat(waterTestReadings.cyanuricAcid) || 0;
                  const cyaTarg = waterTestTargets.cyanuricAcid || 40;
                  if (cyaTarg > cyaCurr + 5) {
                    const cyaRaise = cyaTarg - cyaCurr;
                    // Granular CYA: 13 oz per 10 ppm per 10k gal
                    // Liquid CYA: ~16 fl oz per 10 ppm per 10k gal
                    const cyaOptions = [
                      { name: 'Granular Stabilizer (CYA)', rate: 13, isLiquid: false, selected: waterTestChemicalTypes.cya === 'granular' },
                      { name: 'Liquid Stabilizer (CYA)', rate: 16, isLiquid: true, selected: waterTestChemicalTypes.cya === 'liquid' },
                    ];
                    dosingSections.push({
                      title: `Raise CYA: ${cyaCurr} → ${cyaTarg} ppm (+${cyaRaise})`,
                      color: 'purple',
                      options: cyaOptions.map(opt => ({
                        ...opt,
                        amount: opt.isLiquid 
                          ? formatFlOz((cyaRaise / 10) * opt.rate * factor)
                          : formatOz((cyaRaise / 10) * opt.rate * factor)
                      }))
                    });
                  }
                  
                  // CALCIUM HARDNESS
                  const chCurr = parseFloat(waterTestReadings.calciumHardness) || 0;
                  const chTarg = waterTestTargets.calciumHardness || 300;
                  if (chCurr > 0 && chTarg > chCurr + 10) {
                    const chRaise = chTarg - chCurr;
                    // Calcium Chloride: 1.2 lbs per 10 ppm per 10k gal
                    dosingSections.push({
                      title: `Raise Calcium: ${chCurr} → ${chTarg} ppm (+${chRaise})`,
                      color: 'cyan',
                      options: [
                        { name: 'Calcium Chloride', amount: `${((chRaise / 10) * 1.2 * factor).toFixed(2)} lbs`, selected: true }
                      ]
                    });
                  }
                  
                  // SALT
                  const saltCurr = parseFloat(waterTestReadings.salt) || 0;
                  const saltTarg = waterTestTargets.salt || 3200;
                  if (saltCurr > 0 && saltTarg > saltCurr + 100) {
                    const saltRaise = saltTarg - saltCurr;
                    // Pool Salt: 83 lbs per 1000 ppm per 10k gal
                    const lbsNeeded = (saltRaise / 1000) * 83 * factor;
                    const bags40 = Math.ceil(lbsNeeded / 40);
                    dosingSections.push({
                      title: `Raise Salt: ${saltCurr} → ${saltTarg} ppm (+${saltRaise})`,
                      color: 'blue',
                      options: [
                        { name: 'Pool Salt', amount: `${Math.round(lbsNeeded)} lbs (${bags40} × 40lb bags)`, selected: true }
                      ]
                    });
                  }
                  
                  // PHOSPHATES
                  const phosCurr = parseFloat(waterTestReadings.phosphates) || 0;
                  if (phosCurr > 500) {
                    dosingSections.push({
                      title: `Reduce Phosphates: ${phosCurr} ppb (High!)`,
                      color: 'green',
                      options: [
                        { name: 'Phosphate Remover', amount: 'Follow product label', selected: true }
                      ]
                    });
                  }
                  
                  if (dosingSections.length === 0) return null;
                  
                  const colorClasses = {
                    yellow: { bg: 'bg-yellow-50', border: 'border-yellow-400', header: 'bg-yellow-100 text-yellow-800', pill: 'bg-yellow-200' },
                    red: { bg: 'bg-red-50', border: 'border-red-400', header: 'bg-red-100 text-red-800', pill: 'bg-red-200' },
                    blue: { bg: 'bg-blue-50', border: 'border-blue-400', header: 'bg-blue-100 text-blue-800', pill: 'bg-blue-200' },
                    purple: { bg: 'bg-purple-50', border: 'border-purple-400', header: 'bg-purple-100 text-purple-800', pill: 'bg-purple-200' },
                    green: { bg: 'bg-green-50', border: 'border-green-400', header: 'bg-green-100 text-green-800', pill: 'bg-green-200' },
                    cyan: { bg: 'bg-cyan-50', border: 'border-cyan-400', header: 'bg-cyan-100 text-cyan-800', pill: 'bg-cyan-200' },
                  };
                  
                  return (
                    <div className="mt-3 space-y-2">
                      <div className="text-xs font-bold text-gray-700">📋 Chemical Doses ({gallons.toLocaleString()} gal):</div>
                      {dosingSections.map((section, idx) => {
                        const colors = colorClasses[section.color] || colorClasses.blue;
                        return (
                          <div key={idx} className={`${colors.bg} border ${colors.border} rounded-lg overflow-hidden`}>
                            <div className={`${colors.header} px-3 py-1.5 text-xs font-bold`}>
                              {section.title}
                            </div>
                            <div className="p-2 space-y-1">
                              {section.options.map((opt, optIdx) => (
                                <div 
                                  key={optIdx} 
                                  className={`flex justify-between items-center px-2 py-1.5 rounded text-sm ${opt.selected ? colors.pill + ' font-bold' : 'bg-white/50'}`}
                                >
                                  <span className={opt.selected ? '' : 'text-gray-500'}>{opt.name}</span>
                                  <span className="font-mono">{opt.amount}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  );
                })()}

                {/* Notes */}
                <div className="mt-3">
                  <label className="block text-xs text-gray-600 mb-1">Notes</label>
                  <textarea
                    value={waterTestNotes}
                    onChange={(e) => setWaterTestNotes(e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg text-sm"
                    rows="2"
                    placeholder="Pool condition, observations, recommendations..."
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="p-4 bg-gray-50 border-t grid grid-cols-2 md:grid-cols-4 gap-2">
                <button
                  onClick={() => {
                    setWaterTestReadings({ freeChlorine: '', pH: '', alkalinity: '', cyanuricAcid: '', calciumHardness: '', salt: '', phosphates: '' });
                    setChemicalsAdded([]);
                    setWaterTestNotes('');
                    setWaterTestResults(null);
                  }}
                  className="py-2.5 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 text-sm"
                >
                  Clear
                </button>
                <button
                  onClick={() => saveWaterTest(false)}
                  disabled={!waterTestCustomer}
                  className="py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-400 text-sm"
                >
                  💾 Save
                </button>
                <button
                  onClick={emailWaterTestResults}
                  disabled={!waterTestCustomer || isSendingEmail}
                  className="py-2.5 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 disabled:bg-gray-400 text-sm"
                >
                  {isSendingEmail ? '📧...' : '📧 Email'}
                </button>
                <button
                  onClick={() => {
                    saveWaterTest(true);
                    showEmailNotification('success', 'Water test saved and chemicals added to billing!');
                  }}
                  disabled={!waterTestCustomer}
                  className="py-2.5 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 disabled:bg-gray-400 text-sm"
                >
                  💰 Save & Bill
                </button>
              </div>
            </div>

            {/* Chemicals Added Section - Only show if there are chemicals */}
            {chemicalsAdded.length > 0 && (
              <div className="bg-white rounded-xl p-4 shadow-lg border-2 border-green-500">
                <h3 className="font-bold text-gray-700 mb-3">✓ Chemicals Added</h3>
                <div className="space-y-2">
                  {chemicalsAdded.map((chem, idx) => (
                    <div key={idx} className="flex items-center justify-between bg-green-50 p-3 rounded-lg">
                      <div>
                        <span className="font-medium">{chem.chemical}</span>
                        <span className="text-gray-500 ml-2">{chem.amount?.toFixed?.(1) || chem.amount} {chem.unit}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-500">$</span>
                        <input
                          type="number"
                          step="0.01"
                          value={chem.cost || ''}
                          onChange={(e) => {
                            const updated = [...chemicalsAdded];
                            updated[idx].cost = parseFloat(e.target.value) || 0;
                            setChemicalsAdded(updated);
                          }}
                          className="w-20 px-2 py-1 border rounded text-right"
                          placeholder="0.00"
                        />
                        <button
                          onClick={() => setChemicalsAdded(chemicalsAdded.filter((_, i) => i !== idx))}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Icons.X />
                        </button>
                      </div>
                    </div>
                  ))}
                  <div className="flex justify-between items-center pt-2 border-t">
                    <span className="font-bold">Total:</span>
                    <span className="text-xl font-bold text-green-600">
                      ${chemicalsAdded.reduce((sum, c) => sum + (c.cost || 0), 0).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Quick Tips - Collapsible */}
            <details className="bg-gray-50 rounded-xl">
              <summary className="p-3 cursor-pointer font-medium text-gray-700 text-sm">💡 Pro Tips & LSI Guide</summary>
              <div className="px-3 pb-3 text-sm text-gray-600 space-y-2">
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="bg-red-100 p-2 rounded"><strong>LSI &lt; -0.3:</strong> Corrosive</div>
                  <div className="bg-yellow-100 p-2 rounded"><strong>LSI -0.3 to 0:</strong> Acceptable</div>
                  <div className="bg-green-100 p-2 rounded"><strong>LSI 0 to +0.3:</strong> Balanced ✓</div>
                  <div className="bg-purple-100 p-2 rounded"><strong>LSI &gt; +0.3:</strong> Scaling</div>
                </div>
                <ul className="space-y-1 mt-2">
                  <li>• Adjust alkalinity before pH</li>
                  <li>• Add chemicals one at a time, 15-30 min apart</li>
                  <li>• Run pump when adding chemicals</li>
                  <li>• Re-test after 4-6 hours</li>
                </ul>
              </div>
            </details>
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
                          <option value="hot-tub">Hot Tub</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Pool Gallons</label>
                        <input
                          type="number"
                          value={newCustomer.poolGallons}
                          onChange={e => setNewCustomer({ ...newCustomer, poolGallons: parseInt(e.target.value) || 15000 })}
                          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="15000"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Weekly Rate ($)</label>
                        <input
                          type="number"
                          value={newCustomer.weeklyRate}
                          onChange={e => setNewCustomer({ ...newCustomer, weeklyRate: parseInt(e.target.value) || 0 })}
                          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      <div className="flex items-end">
                        <label className="flex items-center gap-3 cursor-pointer p-2 bg-blue-50 rounded-lg w-full">
                          <input
                            type="checkbox"
                            checked={newCustomer.isSaltPool}
                            onChange={e => setNewCustomer({ ...newCustomer, isSaltPool: e.target.checked })}
                            className="w-5 h-5 text-blue-600 rounded"
                          />
                          <div>
                            <span className="font-medium text-gray-700">🧂 Salt Pool</span>
                          </div>
                        </label>
                      </div>
                    </div>
                    {newCustomer.isSaltPool && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Target Salt Level (ppm)</label>
                        <input
                          type="number"
                          value={newCustomer.targetSalt}
                          onChange={e => setNewCustomer({ ...newCustomer, targetSalt: parseInt(e.target.value) || 3200 })}
                          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="3200"
                        />
                        <p className="text-xs text-gray-500 mt-1">Typical range: 2700-3400 ppm (check your salt cell manual)</p>
                      </div>
                    )}
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
                          <option value="hot-tub">Hot Tub</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Pool Gallons</label>
                        <input
                          type="number"
                          value={editingCustomer.poolGallons || 15000}
                          onChange={e => setEditingCustomer({ ...editingCustomer, poolGallons: parseInt(e.target.value) || 15000 })}
                          className="w-full px-4 py-2 border rounded-lg"
                          placeholder="15000"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Weekly Rate ($)</label>
                        <input
                          type="number"
                          value={editingCustomer.weeklyRate}
                          onChange={e => setEditingCustomer({ ...editingCustomer, weeklyRate: parseInt(e.target.value) || 0 })}
                          className="w-full px-4 py-2 border rounded-lg"
                        />
                      </div>
                      <div className="flex items-end">
                        <label className="flex items-center gap-3 cursor-pointer p-2 bg-blue-50 rounded-lg w-full">
                          <input
                            type="checkbox"
                            checked={editingCustomer.isSaltPool || false}
                            onChange={e => setEditingCustomer({ ...editingCustomer, isSaltPool: e.target.checked })}
                            className="w-5 h-5 text-blue-600 rounded"
                          />
                          <span className="font-medium text-gray-700">🧂 Salt Pool</span>
                        </label>
                      </div>
                    </div>
                    {editingCustomer.isSaltPool && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Target Salt Level (ppm)</label>
                        <input
                          type="number"
                          value={editingCustomer.targetSalt || 3200}
                          onChange={e => setEditingCustomer({ ...editingCustomer, targetSalt: parseInt(e.target.value) || 3200 })}
                          className="w-full px-4 py-2 border rounded-lg"
                          placeholder="3200"
                        />
                        <p className="text-xs text-gray-500 mt-1">Typical range: 2700-3400 ppm</p>
                      </div>
                    )}
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
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
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
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end mt-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                  <input
                    type="date"
                    id="recurringStart"
                    defaultValue={getLocalDateString()}
                    className="w-full px-4 py-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Scheduled Time <span className="text-gray-400 font-normal">(optional)</span>
                  </label>
                  <input
                    type="time"
                    id="recurringTime"
                    className="w-full px-4 py-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Assign To <span className="text-gray-400 font-normal">(optional)</span>
                  </label>
                  <select id="recurringEmployee" className="w-full px-4 py-2 border rounded-lg">
                    <option value="">Unassigned</option>
                    {employees.map(emp => (
                      <option key={emp.id} value={emp.id}>{emp.name}</option>
                    ))}
                  </select>
                </div>
              </div>
              <button
                onClick={() => {
                  const customerId = parseInt(document.getElementById('recurringCustomer').value);
                  const frequency = document.getElementById('recurringFrequency').value;
                  const dayOfWeek = document.getElementById('recurringDay').value;
                  const startDate = document.getElementById('recurringStart').value;
                  const scheduledTime = document.getElementById('recurringTime').value || null;
                  const employeeId = document.getElementById('recurringEmployee').value || null;
                  if (customerId) {
                    addRecurringService(customerId, frequency, dayOfWeek, startDate, scheduledTime, employeeId);
                    document.getElementById('recurringCustomer').value = '';
                    document.getElementById('recurringTime').value = '';
                    document.getElementById('recurringEmployee').value = '';
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
                    const employee = recurring.employeeId ? employees.find(e => e.id === recurring.employeeId) : null;
                    const employeeColor = employee ? employeeColors[employees.indexOf(employee) % employeeColors.length] : null;
                    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
                    return (
                      <div key={recurring.id} className="flex items-center justify-between p-4 bg-purple-50 rounded-lg border-l-4 border-purple-500">
                        <div className="flex-1">
                          <div className="font-bold text-gray-800 flex items-center gap-2 flex-wrap">
                            {recurring.customerName}
                            {recurring.scheduledTime && (
                              <span className="text-xs bg-amber-100 text-amber-800 px-2 py-0.5 rounded font-bold">
                                🕐 {recurring.scheduledTime}
                              </span>
                            )}
                            {employee && (
                              <span 
                                className="text-xs px-2 py-0.5 rounded"
                                style={{ backgroundColor: employeeColor?.bg, color: employeeColor?.text }}
                              >
                                {employee.name}
                              </span>
                            )}
                          </div>
                          <div className="text-sm text-gray-600">
                            <span className="font-medium text-purple-700 capitalize">{recurring.frequency}</span>
                            {' on '}{dayNames[recurring.dayOfWeek || 1]}
                            <span className="mx-2">•</span>
                            Started: {new Date(recurring.startDate).toLocaleDateString()}
                          </div>
                          {customer && (
                            <div className="text-sm text-green-600 font-medium">${customer.weeklyRate}/visit</div>
                          )}
                          {/* Quick edit controls */}
                          <div className="flex items-center gap-2 mt-2 flex-wrap">
                            <input
                              type="time"
                              value={recurring.scheduledTime || ''}
                              onChange={(e) => updateRecurringService(recurring.id, { scheduledTime: e.target.value || null })}
                              className="text-xs px-2 py-1 border rounded"
                              title="Set appointment time"
                            />
                            <select
                              value={recurring.employeeId || ''}
                              onChange={(e) => updateRecurringService(recurring.id, { employeeId: e.target.value ? parseInt(e.target.value) : null })}
                              className="text-xs px-2 py-1 border rounded bg-white"
                              title="Assign to employee"
                            >
                              <option value="">Unassigned</option>
                              {employees.map(emp => (
                                <option key={emp.id} value={emp.id}>{emp.name}</option>
                              ))}
                            </select>
                          </div>
                        </div>
                        <button
                          onClick={() => deleteRecurringService(recurring.id)}
                          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 ml-3"
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
                <div className="bg-white rounded-xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-bold">{editingQuoteId ? 'Edit Quote' : 'Create Quote'}</h3>
                    <button onClick={() => { 
                      setShowCreateQuote(false); 
                      setEditingQuoteId(null);
                      setCurrentQuote({ customerId: '', items: [], notes: '', validDays: 30 });
                    }} className="text-gray-500 hover:text-gray-700">
                      <Icons.X />
                    </button>
                  </div>

                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Customer</label>
                        <CustomerSelect
                          value={currentQuote.customerId}
                          onChange={val => setCurrentQuote({ ...currentQuote, customerId: val })}
                          placeholder="Search customer..."
                        />
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

                    {/* Saved Items Quick Add */}
                    {savedQuoteItems.length > 0 && (
                      <div className="bg-purple-50 p-4 rounded-lg">
                        <div className="flex justify-between items-center mb-2">
                          <h4 className="font-medium text-purple-800">📋 Saved Items (click to add to quote)</h4>
                          <div className="flex gap-2">
                            <button
                              onClick={() => setShowSavedItems(!showSavedItems)}
                              className="text-sm text-purple-600 hover:underline"
                            >
                              {showSavedItems ? 'Hide' : 'Show'} ({savedQuoteItems.length})
                            </button>
                          </div>
                        </div>
                        {showSavedItems && (
                          <div className="space-y-2 mt-2">
                            {savedQuoteItems.map((item, idx) => (
                              <div key={idx} className="flex items-center justify-between bg-white p-2 rounded-lg border border-purple-200">
                                <button
                                  onClick={() => {
                                    setCurrentQuote({
                                      ...currentQuote,
                                      items: [...currentQuote.items, { ...item, id: Date.now() }]
                                    });
                                  }}
                                  className="flex-1 text-left hover:text-purple-700"
                                  title="Click to add to quote"
                                >
                                  <span className="text-xs bg-purple-100 px-2 py-0.5 rounded mr-2">{item.type}</span>
                                  <span className="font-medium">{item.description}</span>
                                  {item.modelNumber && <span className="text-xs text-gray-500 ml-2">#{item.modelNumber}</span>}
                                  <span className="text-green-600 ml-2">${item.price}</span>
                                </button>
                                <button
                                  onClick={() => {
                                    if (confirm(`Remove "${item.description}" from saved items?`)) {
                                      saveSavedQuoteItems(savedQuoteItems.filter((_, i) => i !== idx));
                                    }
                                  }}
                                  className="text-red-500 hover:text-red-700 p-1 ml-2"
                                  title="Remove saved item"
                                >
                                  <Icons.X />
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Add Line Item */}
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-medium mb-3">Add New Line Item</h4>
                      <div className="grid grid-cols-6 gap-3">
                        <div>
                          <label className="block text-xs text-gray-500 mb-1">Type</label>
                          <select
                            value={newLineItem.type}
                            onChange={e => setNewLineItem({ ...newLineItem, type: e.target.value })}
                            className="w-full px-3 py-2 border rounded-lg"
                          >
                            <option value="labor">Labor</option>
                            <option value="part">Part/Equipment</option>
                            <option value="chemical">Chemical</option>
                            <option value="other">Other</option>
                          </select>
                        </div>
                        <div className="col-span-2">
                          <label className="block text-xs text-gray-500 mb-1">Description</label>
                          <input
                            type="text"
                            placeholder="e.g., Pool Pump Installation"
                            value={newLineItem.description}
                            onChange={e => setNewLineItem({ ...newLineItem, description: e.target.value })}
                            className="w-full px-3 py-2 border rounded-lg"
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-gray-500 mb-1">Model/Part #</label>
                          <input
                            type="text"
                            placeholder="e.g., SP2610X15"
                            value={newLineItem.modelNumber}
                            onChange={e => setNewLineItem({ ...newLineItem, modelNumber: e.target.value })}
                            className="w-full px-3 py-2 border rounded-lg"
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-gray-500 mb-1">Qty</label>
                          <input
                            type="number"
                            min="1"
                            value={newLineItem.quantity}
                            onChange={e => setNewLineItem({ ...newLineItem, quantity: parseInt(e.target.value) || 1 })}
                            className="w-full px-3 py-2 border rounded-lg"
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-gray-500 mb-1">Price ($)</label>
                          <input
                            type="number"
                            min="0"
                            step="0.01"
                            value={newLineItem.price}
                            onChange={e => setNewLineItem({ ...newLineItem, price: parseFloat(e.target.value) || 0 })}
                            className="w-full px-3 py-2 border rounded-lg"
                          />
                        </div>
                      </div>
                      <div className="flex gap-2 mt-3">
                        <button
                          onClick={() => addLineItem(currentQuote, setCurrentQuote)}
                          disabled={!newLineItem.description || newLineItem.price <= 0}
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300"
                        >
                          Add to Quote
                        </button>
                        <button
                          onClick={() => {
                            if (newLineItem.description && newLineItem.price > 0) {
                              const itemToSave = { ...newLineItem };
                              if (!savedQuoteItems.find(i => i.description === itemToSave.description && i.modelNumber === itemToSave.modelNumber)) {
                                saveSavedQuoteItems([...savedQuoteItems, itemToSave]);
                                showEmailNotification('success', 'Item saved for future quotes');
                              }
                            }
                          }}
                          disabled={!newLineItem.description || newLineItem.price <= 0}
                          className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:bg-gray-300"
                        >
                          💾 Save Item
                        </button>
                      </div>
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
                      {editingQuoteId ? '💾 Update Quote' : '📄 Generate Quote'}
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
                    {quotes.filter(q => q.status === 'pending').map(quote => {
                      const customer = customers.find(c => c.id === quote.customerId);
                      return (
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
                          {/* Action buttons row 1 - PDF, Email, Edit */}
                          <div className="flex gap-2 mt-3">
                            <button
                              onClick={() => downloadQuotePdf(quote)}
                              className="flex-1 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
                            >
                              📄 PDF
                            </button>
                            <button
                              onClick={() => {
                                if (customer?.email) {
                                  sendQuoteEmail(quote, customer);
                                } else {
                                  alert('Customer has no email address');
                                }
                              }}
                              disabled={!customer?.email || isSendingEmail}
                              className="flex-1 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm disabled:bg-gray-300"
                            >
                              {isSendingEmail ? '⏳' : '📧'} Email
                            </button>
                            <button
                              onClick={() => {
                                setCurrentQuote({
                                  ...quote,
                                  customerId: quote.customerId,
                                  validDays: Math.ceil((new Date(quote.validUntil) - new Date()) / (1000 * 60 * 60 * 24))
                                });
                                setEditingQuoteId(quote.id);
                                setShowCreateQuote(true);
                              }}
                              className="flex-1 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 text-sm"
                            >
                              ✏️ Edit
                            </button>
                          </div>
                          {/* Action buttons row 2 - Approve/Decline */}
                          <div className="flex gap-2 mt-2">
                            <button
                              onClick={() => convertQuoteToJob(quote)}
                              className="flex-1 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm"
                            >
                              ✓ Approve → Job
                            </button>
                            <button
                              onClick={() => convertQuoteToInvoice(quote)}
                              className="flex-1 py-2 text-white rounded-lg hover:opacity-90 text-sm"
                              style={{ backgroundColor: '#1e3a5f' }}
                            >
                              ✓ Approve → Invoice
                            </button>
                            <button
                              onClick={() => {
                                if (confirm('Delete this quote?')) {
                                  saveQuotes(quotes.filter(q => q.id !== quote.id));
                                }
                              }}
                              className="px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm"
                            >
                              🗑️
                            </button>
                          </div>
                        </div>
                      );
                    })}
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
                      <CustomerSelect
                        value={newJob.customerId}
                        onChange={val => setNewJob({ ...newJob, customerId: val })}
                        placeholder="Search customer..."
                      />
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
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Time <span className="text-gray-400 font-normal">(optional)</span>
                        </label>
                        <input
                          type="time"
                          value={newJob.scheduledTime || ''}
                          onChange={e => setNewJob({ ...newJob, scheduledTime: e.target.value || null })}
                          className="w-full px-4 py-2 border rounded-lg"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Price ($)</label>
                        <input
                          type="number"
                          value={newJob.price}
                          onChange={e => setNewJob({ ...newJob, price: parseInt(e.target.value) || 0 })}
                          className="w-full px-4 py-2 border rounded-lg"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Assign To <span className="text-gray-400 font-normal">(optional)</span>
                        </label>
                        <select
                          value={newJob.employeeId || ''}
                          onChange={e => setNewJob({ ...newJob, employeeId: e.target.value ? parseInt(e.target.value) : null })}
                          className="w-full px-4 py-2 border rounded-lg"
                        >
                          <option value="">Unassigned</option>
                          {employees.map(emp => (
                            <option key={emp.id} value={emp.id}>{emp.name}</option>
                          ))}
                        </select>
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
                        {job.jobType} • {(() => {
                          const [y, m, d] = job.date.split('-').map(Number);
                          return new Date(y, m - 1, d).toLocaleDateString();
                        })()}
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
                <button onClick={() => { setShowCompleteServiceModal(false); setServiceToComplete(null); setServiceChemicals([]); setServiceWaterTest({ chlorine: '', ph: '', alkalinity: '', cya: '', hardness: '', salt: '', phosphates: '', temp: '', notes: '' }); }} className="text-gray-500 hover:text-gray-700">
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

              {/* Water Test - Orenda Style: Current vs Target */}
              <div className="mb-4">
                <h4 className="font-bold text-gray-700 mb-2">💧 Water Test & Dosing Calculator</h4>
                <div className="bg-cyan-50 p-3 rounded-lg">
                  
                  {/* Chemical Type Selectors */}
                  <div className="grid grid-cols-2 gap-2 mb-3">
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">Chlorine Type</label>
                      <select value={serviceChlorineType} onChange={e => setServiceChlorineType(e.target.value)}
                        className="w-full px-2 py-1 border rounded text-xs">
                        <option value="liquid12">Liquid 12.5%</option>
                        <option value="liquid10">Liquid 10%</option>
                        <option value="calHypo68">Cal-Hypo 68%</option>
                        <option value="calHypo73">Cal-Hypo 73%</option>
                        <option value="dichlor">Dichlor 56%</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">Acid Type</label>
                      <select value={serviceAcidType} onChange={e => setServiceAcidType(e.target.value)}
                        className="w-full px-2 py-1 border rounded text-xs">
                        <option value="muriatic">Muriatic Acid</option>
                        <option value="dryAcid">Dry Acid</option>
                      </select>
                    </div>
                  </div>
                  
                  {/* Temperature */}
                  <div className="flex items-center gap-2 mb-2">
                    <label className="text-xs text-gray-600 w-16">🌡️ Temp</label>
                    <input type="number" placeholder="78" value={serviceWaterTest.temp}
                      onChange={e => setServiceWaterTest({ ...serviceWaterTest, temp: e.target.value })}
                      className="w-20 px-2 py-1 border rounded text-center font-bold bg-orange-50 text-sm" />
                    <span className="text-xs text-gray-500">°F</span>
                  </div>

                  {/* Headers */}
                  <div className="grid grid-cols-3 gap-1 mb-1 text-xs text-center">
                    <div></div>
                    <div className="font-bold text-blue-700">Current</div>
                    <div className="font-bold text-green-700">Target</div>
                  </div>
                  
                  {/* Reading Rows */}
                  <div className="space-y-1">
                    <div className="grid grid-cols-3 gap-1 items-center">
                      <label className="text-xs text-gray-600">FC (ppm)</label>
                      <input type="number" step="0.1" value={serviceWaterTest.chlorine}
                        onChange={e => setServiceWaterTest({ ...serviceWaterTest, chlorine: e.target.value })}
                        className="px-1 py-1 border rounded text-center font-bold text-sm bg-blue-50" />
                      <input type="number" step="0.1" value={serviceWaterTarget.chlorine}
                        onChange={e => setServiceWaterTarget({ ...serviceWaterTarget, chlorine: e.target.value })}
                        className="px-1 py-1 border rounded text-center font-bold text-sm bg-green-50" />
                    </div>
                    <div className="grid grid-cols-3 gap-1 items-center">
                      <label className="text-xs text-gray-600">pH</label>
                      <input type="number" step="0.1" value={serviceWaterTest.ph}
                        onChange={e => setServiceWaterTest({ ...serviceWaterTest, ph: e.target.value })}
                        className="px-1 py-1 border rounded text-center font-bold text-sm bg-blue-50" />
                      <input type="number" step="0.1" value={serviceWaterTarget.ph}
                        onChange={e => setServiceWaterTarget({ ...serviceWaterTarget, ph: e.target.value })}
                        className="px-1 py-1 border rounded text-center font-bold text-sm bg-green-50" />
                    </div>
                    <div className="grid grid-cols-3 gap-1 items-center">
                      <label className="text-xs text-gray-600">TA (ppm)</label>
                      <input type="number" value={serviceWaterTest.alkalinity}
                        onChange={e => setServiceWaterTest({ ...serviceWaterTest, alkalinity: e.target.value })}
                        className="px-1 py-1 border rounded text-center font-bold text-sm bg-blue-50" />
                      <input type="number" value={serviceWaterTarget.alkalinity}
                        onChange={e => setServiceWaterTarget({ ...serviceWaterTarget, alkalinity: e.target.value })}
                        className="px-1 py-1 border rounded text-center font-bold text-sm bg-green-50" />
                    </div>
                    <div className="grid grid-cols-3 gap-1 items-center">
                      <label className="text-xs text-gray-600">CYA (ppm)</label>
                      <input type="number" value={serviceWaterTest.cya}
                        onChange={e => setServiceWaterTest({ ...serviceWaterTest, cya: e.target.value })}
                        className="px-1 py-1 border rounded text-center font-bold text-sm bg-blue-50" />
                      <input type="number" value={serviceWaterTarget.cya}
                        onChange={e => setServiceWaterTarget({ ...serviceWaterTarget, cya: e.target.value })}
                        className="px-1 py-1 border rounded text-center font-bold text-sm bg-green-50" />
                    </div>
                    <div className="grid grid-cols-3 gap-1 items-center">
                      <label className="text-xs text-gray-600">Calcium</label>
                      <input type="number" value={serviceWaterTest.hardness}
                        onChange={e => setServiceWaterTest({ ...serviceWaterTest, hardness: e.target.value })}
                        className="px-1 py-1 border rounded text-center font-bold text-sm bg-blue-50" />
                      <input type="number" value={serviceWaterTarget.hardness}
                        onChange={e => setServiceWaterTarget({ ...serviceWaterTarget, hardness: e.target.value })}
                        className="px-1 py-1 border rounded text-center font-bold text-sm bg-green-50" />
                    </div>
                    {serviceToComplete?.isSaltPool && (
                      <div className="grid grid-cols-3 gap-1 items-center">
                        <label className="text-xs text-gray-600">🧂 Salt</label>
                        <input type="number" value={serviceWaterTest.salt}
                          onChange={e => setServiceWaterTest({ ...serviceWaterTest, salt: e.target.value })}
                          className="px-1 py-1 border rounded text-center font-bold text-sm bg-blue-50" />
                        <input type="number" value={serviceWaterTarget.salt}
                          onChange={e => setServiceWaterTarget({ ...serviceWaterTarget, salt: e.target.value })}
                          className="px-1 py-1 border rounded text-center font-bold text-sm bg-green-50" />
                      </div>
                    )}
                    <div className="grid grid-cols-3 gap-1 items-center">
                      <label className="text-xs text-gray-600">Phos (ppb)</label>
                      <input type="number" value={serviceWaterTest.phosphates}
                        onChange={e => setServiceWaterTest({ ...serviceWaterTest, phosphates: e.target.value })}
                        className="px-1 py-1 border rounded text-center font-bold text-sm bg-blue-50" />
                      <input type="number" value={serviceWaterTarget.phosphates}
                        onChange={e => setServiceWaterTarget({ ...serviceWaterTarget, phosphates: e.target.value })}
                        className="px-1 py-1 border rounded text-center font-bold text-sm bg-green-50" />
                    </div>
                  </div>
                  
                  {/* LSI Display */}
                  {(serviceWaterTest.ph || serviceWaterTest.alkalinity || serviceWaterTest.hardness) && (() => {
                    const calcLSI = (ph, temp, calcium, alk, cya, salt) => {
                      const tempTable = [{t:32,f:0},{t:37,f:0.1},{t:46,f:0.2},{t:53,f:0.3},{t:60,f:0.4},{t:66,f:0.5},{t:76,f:0.6},{t:84,f:0.7},{t:94,f:0.8},{t:105,f:0.9}];
                      let TF = 0.6;
                      for (let i = 0; i < tempTable.length - 1; i++) {
                        if (temp >= tempTable[i].t && temp <= tempTable[i+1].t) {
                          TF = tempTable[i].f + ((temp - tempTable[i].t) / (tempTable[i+1].t - tempTable[i].t)) * (tempTable[i+1].f - tempTable[i].f);
                          break;
                        }
                      }
                      const calcTable = [{c:25,f:1.0},{c:50,f:1.3},{c:75,f:1.5},{c:100,f:1.6},{c:150,f:1.8},{c:200,f:1.9},{c:250,f:2.0},{c:300,f:2.1},{c:400,f:2.2},{c:800,f:2.6}];
                      let CF = 2.0;
                      for (let i = 0; i < calcTable.length - 1; i++) {
                        if (calcium >= calcTable[i].c && calcium <= calcTable[i+1].c) {
                          CF = calcTable[i].f + ((calcium - calcTable[i].c) / (calcTable[i+1].c - calcTable[i].c)) * (calcTable[i+1].f - calcTable[i].f);
                          break;
                        }
                      }
                      const cyaCorr = ph <= 7.2 ? 0.31 : ph <= 7.6 ? 0.33 : 0.35;
                      const carbAlk = Math.max(alk - (cya * cyaCorr), 10);
                      const alkTable = [{a:25,f:1.4},{a:50,f:1.7},{a:75,f:1.9},{a:100,f:2.0},{a:150,f:2.2},{a:200,f:2.3},{a:300,f:2.5},{a:400,f:2.6}];
                      let AF = 2.0;
                      for (let i = 0; i < alkTable.length - 1; i++) {
                        if (carbAlk >= alkTable[i].a && carbAlk <= alkTable[i+1].a) {
                          AF = alkTable[i].f + ((carbAlk - alkTable[i].a) / (alkTable[i+1].a - alkTable[i].a)) * (alkTable[i+1].f - alkTable[i].f);
                          break;
                        }
                      }
                      const tds = 1000 + salt;
                      const TDSF = tds < 1000 ? 12.0 : tds < 2000 ? 12.1 : tds < 4000 ? 12.2 : 12.3;
                      return ph + TF + CF + AF - TDSF;
                    };
                    const temp = parseFloat(serviceWaterTest.temp) || 78;
                    const currentLSI = calcLSI(parseFloat(serviceWaterTest.ph)||7.4, temp, parseFloat(serviceWaterTest.hardness)||250, parseFloat(serviceWaterTest.alkalinity)||100, parseFloat(serviceWaterTest.cya)||0, parseFloat(serviceWaterTest.salt)||0);
                    const targetLSI = calcLSI(parseFloat(serviceWaterTarget.ph)||7.5, temp, parseFloat(serviceWaterTarget.hardness)||300, parseFloat(serviceWaterTarget.alkalinity)||100, parseFloat(serviceWaterTarget.cya)||40, parseFloat(serviceWaterTarget.salt)||0);
                    const getColor = (lsi) => lsi >= 0.31 ? '#a855f7' : lsi >= 0 ? '#22c55e' : lsi >= -0.30 ? '#eab308' : '#ef4444';
                    const getText = (lsi) => lsi >= 0.31 ? 'SCALING' : lsi >= 0 ? 'BALANCED' : lsi >= -0.30 ? 'OK' : 'CORROSIVE';
                    return (
                      <div className="grid grid-cols-2 gap-2 mt-3 p-2 bg-white rounded-lg">
                        <div className="text-center">
                          <div className="text-xs text-gray-500">Current LSI</div>
                          <div className="text-lg font-black" style={{color:getColor(currentLSI)}}>{currentLSI>=0?'+':''}{currentLSI.toFixed(2)}</div>
                          <div className="text-xs" style={{color:getColor(currentLSI)}}>{getText(currentLSI)}</div>
                        </div>
                        <div className="text-center">
                          <div className="text-xs text-gray-500">Target LSI</div>
                          <div className="text-lg font-black" style={{color:getColor(targetLSI)}}>{targetLSI>=0?'+':''}{targetLSI.toFixed(2)}</div>
                          <div className="text-xs" style={{color:getColor(targetLSI)}}>{getText(targetLSI)}</div>
                        </div>
                      </div>
                    );
                  })()}

                  {/* Dosing Recommendations */}
                  {(() => {
                    const recs = [];
                    const gallons = serviceToComplete?.poolGallons || 15000;
                    const factor = gallons / 10000;
                    
                    // Helper for formatting
                    const formatFlOz = (oz) => oz >= 128 ? `${(oz/128).toFixed(2)} gal` : oz >= 32 ? `${(oz/32).toFixed(1)} qt` : `${oz.toFixed(1)} fl oz`;
                    const formatOz = (oz) => oz >= 16 ? `${(oz/16).toFixed(2)} lbs` : `${oz.toFixed(1)} oz`;
                    
                    const fcCurr = parseFloat(serviceWaterTest.chlorine) || 0;
                    const fcTarg = parseFloat(serviceWaterTarget.chlorine) || 3;
                    if (fcTarg > fcCurr && fcCurr > 0) {
                      const ppm = fcTarg - fcCurr;
                      // Corrected rates: fl oz or oz per 1 ppm per 10k gal
                      const rates = {liquid12:{r:10.7,liq:true,n:'Liquid 12.5%'},liquid10:{r:12.8,liq:true,n:'Liquid 10%'},calHypo68:{r:2.1,liq:false,n:'Cal-Hypo 68%'},calHypo73:{r:2.0,liq:false,n:'Cal-Hypo 73%'},dichlor:{r:2.1,liq:false,n:'Dichlor'}};
                      const c = rates[serviceChlorineType] || rates.liquid12;
                      if (c.liq) { recs.push({chem:c.n,amount:formatFlOz(ppm*c.r*factor),color:'yellow'}); }
                      else { recs.push({chem:c.n,amount:formatOz(ppm*c.r*factor),color:'yellow'}); }
                    }
                    
                    const phCurr = parseFloat(serviceWaterTest.ph) || 0;
                    const phTarg = parseFloat(serviceWaterTarget.ph) || 7.5;
                    if (phCurr > 0 && phCurr > phTarg + 0.05) {
                      const drop = phCurr - phTarg;
                      // Muriatic: 16 fl oz per 0.2 pH drop per 10k gal
                      // Dry Acid: 12 oz per 0.2 pH drop per 10k gal
                      if (serviceAcidType === 'muriatic') { recs.push({chem:'Muriatic Acid',amount:formatFlOz((drop/0.2)*16*factor),color:'red'}); }
                      else { recs.push({chem:'Dry Acid',amount:formatOz((drop/0.2)*12*factor),color:'red'}); }
                    } else if (phCurr > 0 && phTarg > phCurr + 0.05) {
                      // Soda Ash: 6 oz per 0.2 pH raise per 10k gal
                      recs.push({chem:'Soda Ash',amount:formatOz(((phTarg-phCurr)/0.2)*6*factor),color:'blue'});
                    }
                    
                    const taCurr = parseFloat(serviceWaterTest.alkalinity) || 0;
                    const taTarg = parseFloat(serviceWaterTarget.alkalinity) || 100;
                    // Bicarb: 1.4 lbs (22.4 oz) per 10 ppm per 10k gal
                    if (taCurr > 0 && taTarg > taCurr + 5) { recs.push({chem:'Sodium Bicarbonate',amount:`${(((taTarg-taCurr)/10)*1.4*factor).toFixed(2)} lbs`,color:'blue'}); }
                    
                    const cyaCurr = parseFloat(serviceWaterTest.cya) || 0;
                    const cyaTarg = parseFloat(serviceWaterTarget.cya) || 40;
                    // CYA: 13 oz per 10 ppm per 10k gal
                    if (cyaTarg > cyaCurr + 5) { recs.push({chem:'Stabilizer (CYA)',amount:formatOz(((cyaTarg-cyaCurr)/10)*13*factor),color:'purple'}); }
                    
                    const chCurr = parseFloat(serviceWaterTest.hardness) || 0;
                    const chTarg = parseFloat(serviceWaterTarget.hardness) || 300;
                    // Calcium Chloride: 1.2 lbs (19.2 oz) per 10 ppm per 10k gal
                    if (chCurr > 0 && chTarg > chCurr + 10) { recs.push({chem:'Calcium Chloride',amount:`${(((chTarg-chCurr)/10)*1.2*factor).toFixed(2)} lbs`,color:'blue'}); }
                    
                    if (serviceToComplete?.isSaltPool) {
                      const saltCurr = parseFloat(serviceWaterTest.salt) || 0;
                      const saltTarg = parseFloat(serviceWaterTarget.salt) || 3200;
                      // Salt: 83 lbs per 1000 ppm per 10k gal
                      if (saltTarg > saltCurr + 100) { 
                        const lbs = Math.round(((saltTarg-saltCurr)/1000)*83*factor);
                        recs.push({chem:'Pool Salt',amount:`${lbs} lbs (${Math.ceil(lbs/40)} bags)`,color:'blue'}); 
                      }
                    }
                    
                    if ((parseFloat(serviceWaterTest.phosphates)||0) > 500) { recs.push({chem:'Phos Remover',amount:'Treat',color:'green'}); }
                    
                    if (recs.length === 0) return null;
                    return (
                      <div className="mt-3 p-2 bg-white rounded-lg">
                        <div className="text-xs font-bold text-gray-700 mb-2">📋 Dosing ({gallons.toLocaleString()} gal):</div>
                        <div className="space-y-1">
                          {recs.map((r,i) => (
                            <div key={i} className={`flex justify-between items-center px-2 py-1 rounded text-sm ${r.color==='yellow'?'bg-yellow-100':r.color==='red'?'bg-red-100':r.color==='blue'?'bg-blue-100':r.color==='purple'?'bg-purple-100':'bg-green-100'}`}>
                              <span className="font-medium">{r.chem}</span>
                              <span className="font-bold font-mono">{r.amount}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })()}
                  
                  <div className="mt-3">
                    <label className="block text-xs text-gray-600 mb-1">Service Notes</label>
                    <textarea placeholder="Pool condition, issues noticed, work performed..." value={serviceWaterTest.notes}
                      onChange={e => setServiceWaterTest({ ...serviceWaterTest, notes: e.target.value })}
                      className="w-full px-2 py-1 border rounded text-sm" rows="2" />
                  </div>
                </div>
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

              {/* Send Email Checkbox */}
              {serviceToComplete?.email && (
                <div className="mb-4 p-3 bg-green-50 rounded-lg">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={sendEmailOnComplete}
                      onChange={e => setSendEmailOnComplete(e.target.checked)}
                      className="w-5 h-5 text-green-600 rounded"
                    />
                    <div>
                      <span className="font-medium text-green-800">📧 Send service report email</span>
                      <div className="text-xs text-green-600">Will send to: {serviceToComplete.email}</div>
                    </div>
                  </label>
                </div>
              )}
              {serviceToComplete && !serviceToComplete.email && (
                <div className="mb-4 p-3 bg-amber-50 rounded-lg text-sm text-amber-700">
                  ⚠️ No email on file for this customer. Add their email in the Customers tab to enable service reports.
                </div>
              )}

              {/* Complete Button */}
              <div className="flex gap-3">
                <button
                  onClick={() => { setShowCompleteServiceModal(false); setServiceToComplete(null); setServiceChemicals([]); setServiceWaterTest({ chlorine: '', ph: '', alkalinity: '', cya: '', hardness: '', salt: '', phosphates: '', temp: '', notes: '' }); }}
                  className="flex-1 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={completeServiceWithChemicals}
                  disabled={isSendingEmail}
                  className="flex-1 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 disabled:bg-green-400"
                >
                  {isSendingEmail ? '⏳ Sending...' : '✓ Complete Service'}
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
                <h2 className="text-xl font-bold text-gray-800">Custom / Ad-Hoc Invoice</h2>
                <button
                  onClick={() => setShowCustomInvoice(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  <Icons.Plus />
                  Create Custom Invoice
                </button>
              </div>
              <p className="text-gray-600">Create one-off invoices for repairs, equipment, or special services not included in monthly billing.</p>
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
                      <CustomerSelect
                        value={customInvoice.customerId}
                        onChange={val => setCustomInvoice({ ...customInvoice, customerId: val })}
                        placeholder="Search customer..."
                      />
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
              <div className="flex justify-between items-center mb-4 flex-wrap gap-3">
                <h2 className="text-xl font-bold text-gray-800">Monthly Service Invoices</h2>
                <div className="flex gap-3 items-center flex-wrap">
                  {/* Search */}
                  <div>
                    <label className="text-xs text-gray-500 block">Search Customer</label>
                    <input
                      type="text"
                      placeholder="🔍 Customer name..."
                      value={billingSearch}
                      onChange={e => setBillingSearch(e.target.value)}
                      className="px-3 py-2 border rounded-lg text-sm w-40"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 block">Payment Terms</label>
                    <select
                      value={defaultPaymentTerms}
                      onChange={e => setDefaultPaymentTerms(e.target.value)}
                      className="px-3 py-2 border rounded-lg text-sm"
                    >
                      <option value="due_receipt">Due on Receipt</option>
                      <option value="net7">Net 7</option>
                      <option value="net15">Net 15</option>
                      <option value="net30">Net 30</option>
                      <option value="net45">Net 45</option>
                      <option value="net60">Net 60</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 block">Year</label>
                    <select
                      value={invoiceMonth.split('-')[0]}
                      onChange={e => setInvoiceMonth(`${e.target.value}-${invoiceMonth.split('-')[1]}`)}
                      className="px-3 py-2 border rounded-lg text-sm"
                    >
                      {[...Array(5)].map((_, i) => {
                        const year = new Date().getFullYear() - 2 + i;
                        return <option key={year} value={year}>{year}</option>;
                      })}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 block">Month</label>
                    <select
                      value={invoiceMonth.split('-')[1]}
                      onChange={e => setInvoiceMonth(`${invoiceMonth.split('-')[0]}-${e.target.value}`)}
                      className="px-3 py-2 border rounded-lg text-sm"
                    >
                      <option value="01">January</option>
                      <option value="02">February</option>
                      <option value="03">March</option>
                      <option value="04">April</option>
                      <option value="05">May</option>
                      <option value="06">June</option>
                      <option value="07">July</option>
                      <option value="08">August</option>
                      <option value="09">September</option>
                      <option value="10">October</option>
                      <option value="11">November</option>
                      <option value="12">December</option>
                    </select>
                  </div>
                </div>
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
                  {customers
                    .filter(customer => !billingSearch || customer.name.toLowerCase().includes(billingSearch.toLowerCase()))
                    .map(customer => {
                    const services = getMonthServices(customer.id, invoiceMonth);
                    const serviceTotal = services.reduce((sum, s) => sum + s.weeklyRate, 0);
                    const chemicalTotal = services.reduce((sum, s) => sum + (s.chemicalCost || 0), 0);
                    const total = services.reduce((sum, s) => sum + s.totalAmount, 0);
                    const invoiceKey = `${customer.id}-${invoiceMonth}`;
                    const isPaid = paidInvoices[invoiceKey]?.paid;
                    const isBilled = billedCustomers[invoiceKey];
                    const billedInfo = billedCustomers[invoiceKey];
                    const paymentInfo = paidInvoices[invoiceKey];
                    
                    // Check if overdue (billed more than 30 days ago and not paid)
                    let isOverdue = false;
                    let daysPastDue = 0;
                    if (isBilled && !isPaid && billedInfo?.billedDate) {
                      const billedDate = new Date(billedInfo.billedDate);
                      const termsDays = billedInfo.terms === 'due_receipt' ? 0 : billedInfo.terms === 'net15' ? 15 : 30;
                      const dueDate = new Date(billedDate);
                      dueDate.setDate(dueDate.getDate() + termsDays);
                      const today = new Date();
                      if (today > dueDate) {
                        isOverdue = true;
                        daysPastDue = Math.floor((today - dueDate) / (1000 * 60 * 60 * 24));
                      }
                    }
                    
                    // Determine row color based on status
                    let rowClass = 'hover:bg-gray-50';
                    if (isPaid) {
                      rowClass = 'bg-blue-50 hover:bg-blue-100';
                    } else if (isOverdue) {
                      rowClass = 'bg-red-50 hover:bg-red-100';
                    } else if (isBilled) {
                      rowClass = 'bg-green-50 hover:bg-green-100';
                    }
                    
                    return (
                      <tr key={customer.id} className={rowClass}>
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-2 flex-wrap">
                            <div className="font-medium text-gray-800">{customer.name}</div>
                            {isPaid && (
                              <span className="text-xs bg-blue-500 text-white px-2 py-0.5 rounded">
                                ✓ Paid {paymentInfo?.method === 'check' ? `(Check #${paymentInfo.checkNumber})` : 
                                        paymentInfo?.method === 'cash' ? '(Cash)' : 
                                        paymentInfo?.method === 'electronic' ? `(${paymentInfo.source || 'Card'})` : ''}
                              </span>
                            )}
                            {isOverdue && (
                              <span className="text-xs bg-red-500 text-white px-2 py-0.5 rounded">
                                ⚠️ Overdue ({daysPastDue} days)
                              </span>
                            )}
                            {!isPaid && !isOverdue && isBilled && <span className="text-xs bg-green-500 text-white px-2 py-0.5 rounded">✓ Billed</span>}
                          </div>
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
                              View
                            </button>
                            <button
                              onClick={() => {
                                setInvoiceTermsAction({ type: 'pdf', customer, services, serviceTotal, chemicalTotal, total });
                                setShowInvoiceTermsModal(true);
                              }}
                              disabled={services.length === 0}
                              className="px-2 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-300 text-xs"
                            >
                              PDF
                            </button>
                            <button
                              onClick={() => {
                                setInvoiceTermsAction({ type: 'email', customer, services, serviceTotal, chemicalTotal, total });
                                setShowInvoiceTermsModal(true);
                              }}
                              disabled={services.length === 0 || !customer.email || isSendingEmail}
                              className="px-2 py-1 bg-green-600 text-white rounded hover:bg-green-700 disabled:bg-gray-300 text-xs"
                              title={!customer.email ? 'Customer has no email' : 'Send invoice with payment link'}
                            >
                              {isSendingEmail ? '⏳' : '📧'} Email
                            </button>
                            {isOverdue && customer.email && (
                              <button
                                onClick={() => {
                                  setInvoiceTermsAction({ type: 'reminder', customer, services, serviceTotal, chemicalTotal, total, daysPastDue });
                                  setShowInvoiceTermsModal(true);
                                }}
                                disabled={isSendingEmail}
                                className="px-2 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-xs"
                              >
                                📧 Reminder
                              </button>
                            )}
                            {!isPaid && services.length > 0 && total > 0 && (
                              <button
                                onClick={() => {
                                  setPaymentToMark({ invoiceKey, customerId: customer.id, customerName: customer.name, amount: total });
                                  setPaymentMethod({ method: 'electronic', checkNumber: '', source: '' });
                                  setShowPaymentMethodModal(true);
                                }}
                                className="px-2 py-1 bg-purple-600 text-white rounded hover:bg-purple-700 text-xs"
                              >
                                Mark Paid
                              </button>
                            )}
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

            {/* Completed Jobs / Service Calls - Table format matching monthly invoices */}
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <div className="flex justify-between items-center mb-4 flex-wrap gap-3">
                <h3 className="text-xl font-bold text-gray-800">Completed Jobs / Service Calls</h3>
                <div className="flex gap-3 items-center flex-wrap">
                  {/* Search */}
                  <div>
                    <label className="text-xs text-gray-500 block">Search Customer</label>
                    <input
                      type="text"
                      placeholder="🔍 Customer name..."
                      value={jobsSearch}
                      onChange={e => setJobsSearch(e.target.value)}
                      className="px-3 py-2 border rounded-lg text-sm w-40"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 block">Filter Date</label>
                    <input
                      type="date"
                      value={jobsDateFilter}
                      onChange={e => setJobsDateFilter(e.target.value)}
                      className="px-3 py-2 border rounded-lg text-sm"
                    />
                  </div>
                  {jobsDateFilter && (
                    <button
                      onClick={() => setJobsDateFilter('')}
                      className="text-xs text-blue-600 hover:underline mt-4"
                    >
                      Clear Date
                    </button>
                  )}
                  <div className="text-sm text-gray-500 mt-4">
                    Showing: {new Date(invoiceMonth + '-01').toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                  </div>
                </div>
              </div>
              
              <table className="w-full">
                <thead className="bg-purple-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Customer</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Job Type</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Date</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Labor</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Parts/Chem</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Total</th>
                    <th className="px-4 py-3 text-right text-sm font-medium text-gray-500">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {getAllMonthJobServices(invoiceMonth)
                    .filter(s => !jobsSearch || s.customerName.toLowerCase().includes(jobsSearch.toLowerCase()))
                    .filter(s => !jobsDateFilter || s.date === jobsDateFilter)
                    .length > 0 ? (
                    getAllMonthJobServices(invoiceMonth)
                      .filter(s => !jobsSearch || s.customerName.toLowerCase().includes(jobsSearch.toLowerCase()))
                      .filter(s => !jobsDateFilter || s.date === jobsDateFilter)
                      .map(s => {
                      const customer = customers.find(c => c.id === s.customerId);
                      const jobInvoiceKey = `job-${s.id}`;
                      const isJobPaid = paidInvoices[jobInvoiceKey]?.paid;
                      const jobPaymentInfo = paidInvoices[jobInvoiceKey];
                      const isJobBilled = billedCustomers[jobInvoiceKey];
                      
                      let rowClass = 'hover:bg-gray-50';
                      if (isJobPaid) {
                        rowClass = 'bg-blue-50 hover:bg-blue-100';
                      } else if (isJobBilled) {
                        rowClass = 'bg-green-50 hover:bg-green-100';
                      }
                      
                      return (
                        <tr key={s.id} className={rowClass}>
                          <td className="px-4 py-4">
                            <div className="flex items-center gap-2 flex-wrap">
                              <div className="font-medium text-gray-800">{s.customerName}</div>
                              {isJobPaid && (
                                <span className="text-xs bg-blue-500 text-white px-2 py-0.5 rounded">
                                  ✓ Paid {jobPaymentInfo?.method === 'check' ? `(#${jobPaymentInfo.checkNumber})` : 
                                          jobPaymentInfo?.method === 'cash' ? '(Cash)' : 
                                          `(${jobPaymentInfo?.source || 'Card'})`}
                                </span>
                              )}
                              {!isJobPaid && isJobBilled && <span className="text-xs bg-green-500 text-white px-2 py-0.5 rounded">✓ Billed</span>}
                            </div>
                          </td>
                          <td className="px-4 py-4 text-gray-600 capitalize">{s.jobType || s.poolType}</td>
                          <td className="px-4 py-4 text-gray-600">{new Date(s.date).toLocaleDateString()}</td>
                          <td className="px-4 py-4 text-gray-600">${s.weeklyRate.toFixed(2)}</td>
                          <td className="px-4 py-4 text-teal-600">${((s.additionalItemsCost || 0) + (s.chemicalCost || 0)).toFixed(2)}</td>
                          <td className="px-4 py-4 font-bold text-green-600">${s.totalAmount.toFixed(2)}</td>
                          <td className="px-4 py-4 text-right">
                            <div className="flex gap-1 justify-end flex-wrap">
                              <button
                                onClick={() => downloadJobInvoice(s, defaultPaymentTerms)}
                                className="px-2 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-xs"
                              >
                                PDF
                              </button>
                              {customer?.email && (
                                <button
                                  onClick={async () => {
                                    let paymentLink = null;
                                    if (s.totalAmount > 0) {
                                      const invoiceNumber = `JOB-${s.id.toString().slice(-8)}`;
                                      const stripeResult = await createStripeCheckout(customer, s.totalAmount, `${s.jobType || 'Service Call'} - ${customer.name}`, invoiceNumber);
                                      if (stripeResult?.paymentUrl) {
                                        paymentLink = stripeResult.paymentUrl;
                                      }
                                    }
                                    await sendJobCompletionEmail(customer, {
                                      jobType: s.jobType || s.poolType,
                                      basePrice: s.weeklyRate,
                                      additionalItems: s.additionalItems || [],
                                      chemicalsUsed: s.chemicalsUsed || [],
                                      total: s.totalAmount,
                                      notes: s.techNotes || ''
                                    }, paymentLink);
                                    // Mark as billed
                                    const newBilledCustomers = { ...billedCustomers, [jobInvoiceKey]: { billed: true, billedDate: new Date().toISOString() } };
                                    saveBilledCustomers(newBilledCustomers);
                                  }}
                                  disabled={isSendingEmail}
                                  className="px-2 py-1 bg-green-600 text-white rounded hover:bg-green-700 text-xs"
                                >
                                  {isSendingEmail ? '⏳' : '📧'} Email
                                </button>
                              )}
                              {!isJobPaid && (
                                <button
                                  onClick={() => {
                                    setPaymentToMark({ 
                                      invoiceKey: jobInvoiceKey, 
                                      customerId: s.customerId, 
                                      customerName: s.customerName, 
                                      amount: s.totalAmount 
                                    });
                                    setPaymentMethod({ method: 'electronic', checkNumber: '', source: '' });
                                    setShowPaymentMethodModal(true);
                                  }}
                                  className="px-2 py-1 bg-purple-600 text-white rounded hover:bg-purple-700 text-xs"
                                >
                                  Mark Paid
                                </button>
                              )}
                              <button
                                onClick={() => openEditServiceModal(s)}
                                className="px-2 py-1 bg-gray-500 text-white rounded hover:bg-gray-600 text-xs"
                                title="Edit"
                              >
                                ✏️
                              </button>
                              <button
                                onClick={() => {
                                  if (confirm(`Delete this ${s.jobType || 'service'} invoice for ${s.customerName}?`)) {
                                    saveHistory(serviceHistory.filter(h => h.id !== s.id));
                                  }
                                }}
                                className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-xs"
                                title="Delete"
                              >
                                🗑️
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan="7" className="px-4 py-8 text-center text-gray-500">
                        {jobsSearch || jobsDateFilter ? 'No jobs match your search' : 'No completed jobs for this month'}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* HISTORY TAB */}
        {activeTab === 'history' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center flex-wrap gap-3">
              <h2 className="text-xl font-bold text-gray-800">Service History</h2>
              <div className="flex items-center gap-3 flex-wrap">
                {/* Search */}
                <div>
                  <label className="text-xs text-gray-500 block">Search Customer</label>
                  <input
                    type="text"
                    placeholder="🔍 Customer name..."
                    value={historySearch}
                    onChange={e => setHistorySearch(e.target.value)}
                    className="px-3 py-2 border rounded-lg text-sm w-40"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-500 block">Filter Date</label>
                  <input
                    type="date"
                    value={historyDateFilter}
                    onChange={e => setHistoryDateFilter(e.target.value)}
                    className="px-3 py-2 border rounded-lg text-sm"
                  />
                </div>
                {(historySearch || historyDateFilter) && (
                  <button
                    onClick={() => { setHistorySearch(''); setHistoryDateFilter(''); }}
                    className="text-xs text-blue-600 hover:underline mt-4"
                  >
                    Clear Filters
                  </button>
                )}
                <div className="text-lg font-bold text-green-600 mt-4">
                  Total: ${serviceHistory
                    .filter(s => !historySearch || s.customerName.toLowerCase().includes(historySearch.toLowerCase()))
                    .filter(s => !historyDateFilter || s.date === historyDateFilter)
                    .reduce((sum, s) => sum + s.totalAmount, 0).toFixed(2)}
                </div>
              </div>
            </div>

            {serviceHistory
              .filter(s => !historySearch || s.customerName.toLowerCase().includes(historySearch.toLowerCase()))
              .filter(s => !historyDateFilter || s.date === historyDateFilter)
              .length > 0 ? (
              <div className="space-y-3">
                {serviceHistory
                  .filter(s => !historySearch || s.customerName.toLowerCase().includes(historySearch.toLowerCase()))
                  .filter(s => !historyDateFilter || s.date === historyDateFilter)
                  .map(service => (
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
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  {historySearch || historyDateFilter ? 'No matching services' : 'No service history'}
                </h3>
                <p className="text-gray-500">
                  {historySearch || historyDateFilter ? 'Try adjusting your search filters.' : 'Complete services to see them here.'}
                </p>
              </div>
            )}
          </div>
        )}

        {/* SETTINGS TAB */}
        {activeTab === 'settings' && (
          <div className="space-y-6">
            
            {/* Admin PIN Settings */}
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <h2 className="text-xl font-bold text-gray-800 mb-4">🔐 Admin PIN Settings</h2>
              <p className="text-sm text-gray-500 mb-4">Manage access control for employees.</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Change Admin PIN</label>
                  <div className="flex gap-2">
                    <input
                      type="password"
                      inputMode="numeric"
                      maxLength="4"
                      placeholder="New 4-digit PIN"
                      id="newPinInput"
                      className="flex-1 px-4 py-2 border rounded-lg text-center tracking-widest"
                    />
                    <button
                      onClick={() => {
                        const newPin = document.getElementById('newPinInput').value;
                        if (newPin.length === 4 && /^\d+$/.test(newPin)) {
                          saveAdminPIN(newPin);
                          document.getElementById('newPinInput').value = '';
                          showEmailNotification('success', 'Admin PIN updated');
                        } else {
                          showEmailNotification('error', 'PIN must be 4 digits');
                        }
                      }}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                      Update PIN
                    </button>
                  </div>
                  <p className="text-xs text-gray-400 mt-1">Current PIN is set (hidden for security)</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Auto-Lock Timeout</label>
                  <select
                    value={adminTimeout}
                    onChange={(e) => saveAdminTimeout(parseInt(e.target.value))}
                    className="w-full px-4 py-2 border rounded-lg"
                  >
                    <option value="5">5 minutes</option>
                    <option value="15">15 minutes</option>
                    <option value="30">30 minutes</option>
                    <option value="60">1 hour</option>
                    <option value="480">8 hours (work day)</option>
                  </select>
                  <p className="text-xs text-gray-400 mt-1">App will lock to Tech Mode after this time of inactivity</p>
                </div>
              </div>
              
              <div className="mt-4 p-4 bg-amber-50 rounded-lg border border-amber-200">
                <h3 className="font-medium text-amber-800 mb-2">📱 What Employees See (Tech Mode):</h3>
                <ul className="text-sm text-amber-700 space-y-1">
                  <li>✓ Today's route with customer names & addresses</li>
                  <li>✓ Gate codes and dog warnings</li>
                  <li>✓ Appointment times</li>
                  <li>✓ Complete service buttons</li>
                  <li>✓ Chemical inventory</li>
                  <li>✗ Prices, revenue, billing info hidden</li>
                  <li>✗ Customer phone/email hidden</li>
                  <li>✗ Cannot add/edit customers or jobs</li>
                </ul>
              </div>
            </div>

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

            {/* Email Log */}
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-800">📬 Email History</h2>
                {emailLog.length > 0 && (
                  <button
                    onClick={() => {
                      if (window.confirm('Clear all email history?')) {
                        saveEmailLog([]);
                      }
                    }}
                    className="text-sm text-red-600 hover:text-red-800"
                  >
                    Clear History
                  </button>
                )}
              </div>
              
              {emailLog.length > 0 ? (
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {emailLog.slice(0, 50).map(log => (
                    <div key={log.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <span className={`text-lg ${log.status === 'sent' ? 'text-green-500' : 'text-red-500'}`}>
                          {log.status === 'sent' ? '✓' : '✗'}
                        </span>
                        <div>
                          <div className="font-medium text-gray-800">{log.customerName}</div>
                          <div className="text-sm text-gray-500">{log.subject}</div>
                          <div className="text-xs text-gray-400">{log.to}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-xs text-gray-500">
                          {new Date(log.sentDate).toLocaleDateString()}
                        </div>
                        <div className="text-xs text-gray-400">
                          {new Date(log.sentDate).toLocaleTimeString()}
                        </div>
                        <span className={`text-xs px-2 py-0.5 rounded ${
                          log.type === 'invoice' ? 'bg-blue-100 text-blue-700' :
                          log.type === 'weekly-update' ? 'bg-green-100 text-green-700' :
                          'bg-purple-100 text-purple-700'
                        }`}>
                          {log.type}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <div className="text-4xl mb-2">📭</div>
                  <p>No emails sent yet</p>
                  <p className="text-sm">Emails will appear here when you send invoices, quotes, or updates</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Invoice Terms Modal */}
      {showInvoiceTermsModal && invoiceTermsAction && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">
                {invoiceTermsAction.type === 'reminder' ? 'Send Payment Reminder' : 'Invoice Options'}
              </h3>
              <button onClick={() => setShowInvoiceTermsModal(false)} className="text-gray-500 hover:text-gray-700">
                <Icons.X />
              </button>
            </div>
            
            <div className={`mb-4 p-3 rounded-lg ${invoiceTermsAction.type === 'reminder' ? 'bg-red-50' : 'bg-gray-50'}`}>
              <div className="font-medium">{invoiceTermsAction.customer.name}</div>
              <div className="text-sm text-gray-500">{new Date(invoiceMonth + '-01').toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</div>
              <div className="text-lg font-bold text-green-600 mt-1">${invoiceTermsAction.total.toFixed(2)}</div>
              {invoiceTermsAction.type === 'reminder' && invoiceTermsAction.daysPastDue && (
                <div className="text-sm text-red-600 mt-1">⚠️ {invoiceTermsAction.daysPastDue} days past due</div>
              )}
            </div>
            
            {invoiceTermsAction.type !== 'reminder' && (
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Payment Terms</label>
                <select
                  value={selectedInvoiceTerms}
                  onChange={e => setSelectedInvoiceTerms(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg"
                >
                  <option value="due_receipt">Due on Receipt</option>
                  <option value="net7">Net 7</option>
                  <option value="net15">Net 15</option>
                  <option value="net30">Net 30</option>
                  <option value="net45">Net 45</option>
                  <option value="net60">Net 60</option>
                </select>
              </div>
            )}

            {invoiceTermsAction.type === 'reminder' && (
              <div className="mb-4 p-3 bg-amber-50 rounded-lg text-sm text-amber-800">
                <strong>Note:</strong> This will send a friendly payment reminder email with a new payment link attached.
              </div>
            )}
            
            <div className="flex gap-3">
              <button
                onClick={() => setShowInvoiceTermsModal(false)}
                className="flex-1 py-2 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  const { type, customer, services, serviceTotal, chemicalTotal, total, daysPastDue } = invoiceTermsAction;
                  const monthName = new Date(invoiceMonth + '-01').toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
                  
                  if (type === 'pdf') {
                    downloadInvoice(customer, invoiceMonth, selectedInvoiceTerms);
                  } else if (type === 'email') {
                    const serviceSummary = `${services.length} service${services.length !== 1 ? 's' : ''} @ $${customer.weeklyRate}/visit`;
                    
                    let paymentLink = null;
                    if (total > 0) {
                      const invoiceNumber = `INV-${Date.now().toString().slice(-8)}`;
                      const stripeResult = await createStripeCheckout(customer, total, `Pool Service - ${monthName}`, invoiceNumber);
                      if (stripeResult?.paymentUrl) {
                        paymentLink = stripeResult.paymentUrl;
                      }
                    }
                    
                    await sendInvoiceEmail(customer, {
                      month: monthName,
                      serviceSummary,
                      services,
                      subtotal: serviceTotal,
                      chemicalTotal,
                      total,
                      paymentTerms: selectedInvoiceTerms,
                      billingMonth: invoiceMonth
                    }, paymentLink);
                  } else if (type === 'reminder') {
                    const serviceSummary = `${services.length} service${services.length !== 1 ? 's' : ''} @ $${customer.weeklyRate}/visit`;
                    
                    // Create new payment link for reminder
                    let paymentLink = null;
                    if (total > 0) {
                      const invoiceNumber = `REM-${Date.now().toString().slice(-8)}`;
                      const stripeResult = await createStripeCheckout(customer, total, `Pool Service - ${monthName} (Overdue)`, invoiceNumber);
                      if (stripeResult?.paymentUrl) {
                        paymentLink = stripeResult.paymentUrl;
                      }
                    }
                    
                    await sendPaymentReminder(customer, {
                      month: monthName,
                      serviceSummary,
                      total,
                      daysPastDue
                    }, paymentLink);
                  }
                  
                  setShowInvoiceTermsModal(false);
                }}
                disabled={isSendingEmail}
                className={`flex-1 py-2 text-white rounded-lg disabled:opacity-50 ${
                  invoiceTermsAction.type === 'reminder' ? 'bg-red-600 hover:bg-red-700' : 'bg-blue-600 hover:bg-blue-700'
                }`}
              >
                {isSendingEmail ? '⏳ Sending...' : 
                  invoiceTermsAction.type === 'pdf' ? '📄 Generate PDF' : 
                  invoiceTermsAction.type === 'reminder' ? '📧 Send Reminder' : '📧 Send Invoice'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Employee Manager Modal */}
      {showEmployeeManager && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-indigo-700">👥 Manage Employees</h3>
              <button onClick={() => setShowEmployeeManager(false)} className="text-gray-500 hover:text-gray-700">
                <Icons.X />
              </button>
            </div>

            {/* Add New Employee */}
            <div className="bg-indigo-50 p-4 rounded-lg mb-4">
              <h4 className="font-medium text-indigo-800 mb-3">Add New Employee</h4>
              <div className="space-y-3">
                <input
                  type="text"
                  placeholder="Employee Name"
                  value={newEmployee.name}
                  onChange={(e) => setNewEmployee({ ...newEmployee, name: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg"
                />
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="tel"
                    placeholder="Phone (optional)"
                    value={newEmployee.phone}
                    onChange={(e) => setNewEmployee({ ...newEmployee, phone: e.target.value })}
                    className="px-3 py-2 border rounded-lg"
                  />
                  <input
                    type="email"
                    placeholder="Email (optional)"
                    value={newEmployee.email}
                    onChange={(e) => setNewEmployee({ ...newEmployee, email: e.target.value })}
                    className="px-3 py-2 border rounded-lg"
                  />
                </div>
                <button
                  onClick={() => {
                    if (newEmployee.name.trim()) {
                      const colorIndex = employees.length % employeeColors.length;
                      saveEmployees([...employees, { 
                        ...newEmployee, 
                        id: Date.now(),
                        colorIndex
                      }]);
                      setNewEmployee({ name: '', phone: '', email: '' });
                    }
                  }}
                  disabled={!newEmployee.name.trim()}
                  className="w-full py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:bg-gray-300"
                >
                  Add Employee
                </button>
              </div>
            </div>

            {/* Employee List */}
            <div className="space-y-2">
              <h4 className="font-medium text-gray-700">Current Employees ({employees.length})</h4>
              {employees.length > 0 ? (
                employees.map((emp, idx) => {
                  const color = employeeColors[idx % employeeColors.length];
                  const assignedRecurring = recurringServices.filter(r => r.employeeId === emp.id && r.active).length;
                  const assignedJobs = oneTimeJobs.filter(j => j.employeeId === emp.id).length;
                  
                  return (
                    <div key={emp.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold"
                          style={{ backgroundColor: color.bg }}
                        >
                          {emp.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="font-medium">{emp.name}</div>
                          <div className="text-xs text-gray-500">
                            {emp.phone && <span className="mr-2">{emp.phone}</span>}
                            {emp.email && <span>{emp.email}</span>}
                          </div>
                          <div className="text-xs text-indigo-600">
                            {assignedRecurring} recurring • {assignedJobs} jobs
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          if (confirm(`Remove ${emp.name}? Their assignments will become unassigned.`)) {
                            // Remove employee and clear their assignments
                            saveEmployees(employees.filter(e => e.id !== emp.id));
                            saveRecurring(recurringServices.map(r => 
                              r.employeeId === emp.id ? { ...r, employeeId: null } : r
                            ));
                            saveJobs(oneTimeJobs.map(j => 
                              j.employeeId === emp.id ? { ...j, employeeId: null } : j
                            ));
                          }
                        }}
                        className="text-red-500 hover:text-red-700 p-2"
                      >
                        <Icons.Trash />
                      </button>
                    </div>
                  );
                })
              ) : (
                <p className="text-gray-500 text-center py-4">No employees yet. Add your first employee above!</p>
              )}
            </div>

            <button
              onClick={() => setShowEmployeeManager(false)}
              className="w-full mt-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
            >
              Done
            </button>
          </div>
        </div>
      )}

      {/* Schedule Quote as Job Modal */}
      {showScheduleQuoteJob && quoteToSchedule && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-purple-700">📅 Schedule Job</h3>
              <button onClick={() => { setShowScheduleQuoteJob(false); setQuoteToSchedule(null); }} className="text-gray-500 hover:text-gray-700">
                <Icons.X />
              </button>
            </div>

            {/* Quote Info */}
            <div className="bg-purple-50 p-4 rounded-lg mb-4">
              <div className="font-bold text-lg">{quoteToSchedule.customerName}</div>
              <div className="text-sm text-gray-600">Quote #{quoteToSchedule.quoteNumber}</div>
              <div className="text-xl font-bold text-purple-700 mt-2">${quoteToSchedule.total.toFixed(2)}</div>
              <div className="text-xs text-gray-500 mt-2">
                {quoteToSchedule.items.map(i => i.description).join(', ')}
              </div>
            </div>

            {/* Date Picker */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Select Date for Job</label>
              <input
                type="date"
                value={quoteJobDate}
                onChange={(e) => setQuoteJobDate(e.target.value)}
                min={getLocalDateString()}
                className="w-full px-4 py-3 border-2 border-purple-200 rounded-lg text-lg focus:border-purple-500 focus:outline-none"
              />
              {quoteJobDate && (
                <div className="mt-2 text-center text-purple-700 font-medium">
                  {(() => {
                    const [y, m, d] = quoteJobDate.split('-').map(Number);
                    return new Date(y, m - 1, d).toLocaleDateString('en-US', { 
                      weekday: 'long', 
                      month: 'long', 
                      day: 'numeric',
                      year: 'numeric'
                    });
                  })()}
                </div>
              )}
            </div>

            {/* Quick Date Buttons */}
            <div className="mb-4">
              <label className="block text-xs text-gray-500 mb-2">Quick Select</label>
              <div className="grid grid-cols-4 gap-2">
                <button
                  onClick={() => setQuoteJobDate(getLocalDateString())}
                  className={`py-2 px-3 rounded-lg text-sm font-medium ${
                    quoteJobDate === getLocalDateString() 
                      ? 'bg-purple-600 text-white' 
                      : 'bg-gray-100 hover:bg-gray-200'
                  }`}
                >
                  Today
                </button>
                <button
                  onClick={() => {
                    const tomorrow = new Date();
                    tomorrow.setDate(tomorrow.getDate() + 1);
                    setQuoteJobDate(getLocalDateString(tomorrow));
                  }}
                  className={`py-2 px-3 rounded-lg text-sm font-medium ${
                    (() => {
                      const tomorrow = new Date();
                      tomorrow.setDate(tomorrow.getDate() + 1);
                      return quoteJobDate === getLocalDateString(tomorrow);
                    })() 
                      ? 'bg-purple-600 text-white' 
                      : 'bg-gray-100 hover:bg-gray-200'
                  }`}
                >
                  Tomorrow
                </button>
                <button
                  onClick={() => {
                    const nextWeek = new Date();
                    nextWeek.setDate(nextWeek.getDate() + 7);
                    setQuoteJobDate(getLocalDateString(nextWeek));
                  }}
                  className="py-2 px-3 rounded-lg text-sm font-medium bg-gray-100 hover:bg-gray-200"
                >
                  +1 Week
                </button>
                <button
                  onClick={() => {
                    const nextMonth = new Date();
                    nextMonth.setDate(nextMonth.getDate() + 30);
                    setQuoteJobDate(getLocalDateString(nextMonth));
                  }}
                  className="py-2 px-3 rounded-lg text-sm font-medium bg-gray-100 hover:bg-gray-200"
                >
                  +1 Month
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={() => { setShowScheduleQuoteJob(false); setQuoteToSchedule(null); }}
                className="flex-1 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={confirmQuoteToJob}
                disabled={!quoteJobDate}
                className="flex-1 py-3 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 disabled:bg-gray-300"
              >
                ✓ Schedule Job
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Global Complete Job Modal - shows on any tab */}
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
              <div className="text-sm text-gray-600 capitalize">{jobToComplete.jobType?.replace('-', ' ') || 'Service'}</div>
              {jobToComplete.notes && <div className="text-sm text-gray-500 mt-1">{jobToComplete.notes}</div>}
            </div>

            {/* Base Price */}
            <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg mb-4">
              <span className="font-medium">Job Price:</span>
              <span className="text-xl font-bold text-purple-700">${jobToComplete.price?.toFixed(2) || '0.00'}</span>
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
                  id="globalCustomJobItemName"
                />
                <input
                  type="number"
                  step="0.01"
                  placeholder="Price"
                  className="w-24 px-3 py-2 border rounded-lg text-sm"
                  id="globalCustomJobItemPrice"
                />
                <button
                  onClick={() => {
                    const name = document.getElementById('globalCustomJobItemName').value;
                    const price = parseFloat(document.getElementById('globalCustomJobItemPrice').value) || 0;
                    if (name && price > 0) {
                      addCustomItemToJob(name, price);
                      document.getElementById('globalCustomJobItemName').value = '';
                      document.getElementById('globalCustomJobItemPrice').value = '';
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
                        id={`global-job-chem-qty-${chem.id}`}
                      />
                      <button
                        onClick={() => {
                          const input = document.getElementById(`global-job-chem-qty-${chem.id}`);
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
                  <div className="text-sm">${jobToComplete.price?.toFixed(2) || '0.00'}</div>
                  <div className="text-sm">${jobCompletionItems.reduce((sum, i) => sum + (i.price * i.quantity), 0).toFixed(2)}</div>
                  <div className="text-sm">${jobChemicals.reduce((sum, c) => sum + (c.quantityUsed * c.costPerUnit), 0).toFixed(2)}</div>
                  <div className="font-bold text-xl text-green-700">
                    ${((jobToComplete.price || 0) + jobCompletionItems.reduce((sum, i) => sum + (i.price * i.quantity), 0) + jobChemicals.reduce((sum, c) => sum + (c.quantityUsed * c.costPerUnit), 0)).toFixed(2)}
                  </div>
                </div>
              </div>
            </div>

            {/* Technician Notes */}
            <div className="mb-4">
              <h4 className="font-bold text-gray-700 mb-2">📝 Technician Notes (sent to customer)</h4>
              <textarea
                value={jobCompletionNotes}
                onChange={e => setJobCompletionNotes(e.target.value)}
                placeholder="Any notes for the customer about the work performed, issues found, recommendations..."
                className="w-full px-3 py-2 border rounded-lg text-sm"
                rows="3"
              />
            </div>

            {/* Send Email Checkbox */}
            {(() => {
              const customer = customers.find(c => c.id === parseInt(jobToComplete.customerId));
              return customer?.email ? (
                <div className="mb-4 p-3 bg-green-50 rounded-lg">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={sendJobEmailOnComplete}
                      onChange={e => setSendJobEmailOnComplete(e.target.checked)}
                      className="w-5 h-5 text-green-600 rounded"
                    />
                    <div>
                      <span className="font-medium text-green-800">📧 Send job completion email</span>
                      <div className="text-xs text-green-600">Will send to: {customer.email}</div>
                    </div>
                  </label>
                </div>
              ) : (
                <div className="mb-4 p-3 bg-amber-50 rounded-lg text-sm text-amber-700">
                  ⚠️ No email on file for this customer. Add their email in the Customers tab to enable job completion emails.
                </div>
              );
            })()}

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={() => { setShowCompleteJobModal(false); setJobToComplete(null); setJobCompletionItems([]); setJobChemicals([]); setJobCompletionNotes(''); }}
                className="flex-1 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={completeJobWithItems}
                disabled={isSendingEmail}
                className="flex-1 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 disabled:bg-green-400"
              >
                {isSendingEmail ? '⏳ Sending...' : '✓ Complete Job'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Payment Method Modal */}
      {showPaymentMethodModal && paymentToMark && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">Mark Payment Received</h3>
              <button onClick={() => setShowPaymentMethodModal(false)} className="text-gray-500 hover:text-gray-700">
                <Icons.X />
              </button>
            </div>
            
            <div className="mb-4 p-3 bg-gray-50 rounded-lg">
              <div className="font-medium">{paymentToMark.customerName}</div>
              <div className="text-lg font-bold text-green-600">${paymentToMark.amount.toFixed(2)}</div>
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Payment Method</label>
              <div className="grid grid-cols-3 gap-2">
                {['cash', 'check', 'electronic'].map(method => (
                  <button
                    key={method}
                    onClick={() => setPaymentMethod({ ...paymentMethod, method })}
                    className={`py-2 px-3 rounded-lg border-2 capitalize ${
                      paymentMethod.method === method 
                        ? 'border-blue-500 bg-blue-50 text-blue-700' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    {method === 'electronic' ? '💳 Card' : method === 'check' ? '📝 Check' : '💵 Cash'}
                  </button>
                ))}
              </div>
            </div>
            
            {paymentMethod.method === 'check' && (
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Check Number</label>
                <input
                  type="text"
                  value={paymentMethod.checkNumber}
                  onChange={e => setPaymentMethod({ ...paymentMethod, checkNumber: e.target.value })}
                  placeholder="Enter check number"
                  className="w-full px-4 py-2 border rounded-lg"
                />
              </div>
            )}
            
            {paymentMethod.method === 'electronic' && (
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Payment Source</label>
                <input
                  type="text"
                  value={paymentMethod.source}
                  onChange={e => setPaymentMethod({ ...paymentMethod, source: e.target.value })}
                  placeholder="e.g., Stripe, Venmo, Zelle, Credit Card"
                  className="w-full px-4 py-2 border rounded-lg"
                />
              </div>
            )}
            
            <div className="flex gap-3">
              <button
                onClick={() => setShowPaymentMethodModal(false)}
                className="flex-1 py-2 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  const newPaidInvoices = {
                    ...paidInvoices,
                    [paymentToMark.invoiceKey]: {
                      paid: true,
                      method: paymentMethod.method,
                      checkNumber: paymentMethod.checkNumber,
                      source: paymentMethod.source,
                      paidDate: new Date().toISOString(),
                      amount: paymentToMark.amount
                    }
                  };
                  savePaidInvoices(newPaidInvoices);
                  setShowPaymentMethodModal(false);
                  showEmailNotification('success', `Payment marked as received from ${paymentToMark.customerName}`);
                }}
                className="flex-1 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                ✓ Confirm Payment
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Version Footer */}
      <div className="fixed bottom-2 right-2 text-xs text-gray-400 bg-white/80 px-2 py-1 rounded">
        v3.5.1
      </div>
    </div>
  );
}
