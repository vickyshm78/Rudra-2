import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { 
  Users, Search, Filter, Calendar, Clock, 
  Phone, Mail, MessageSquare, Car, User,
  Edit, Trash2, CheckCircle, X, AlertTriangle,
  Plus, ArrowRight, ArrowLeft, Download, Upload,
  FileText, RefreshCw
} from 'lucide-react';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  vehicle_id: string;
  vehicle_title: string;
  status: 'new' | 'contacted' | 'qualified' | 'negotiation' | 'won' | 'lost';
  source: string;
  created_at: string;
  last_contact: string | null;
  assigned_to: string | null;
  notes: string;
  follow_up_date: string | null;
  tags: string[];
}

interface LeadManagementSystemProps {
  dealerId?: string;
}

const LeadManagementSystem: React.FC<LeadManagementSystemProps> = ({ dealerId }) => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [filteredLeads, setFilteredLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sourceFilter, setSourceFilter] = useState('all');
  const [assigneeFilter, setAssigneeFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [showLeadModal, setShowLeadModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [importFile, setImportFile] = useState<File | null>(null);
  const [importProgress, setImportProgress] = useState(0);
  const [team, setTeam] = useState<{id: string, name: string, role: string, avatar: string}[]>([]);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState<Partial<Lead>>({
    name: '',
    email: '',
    phone: '',
    status: 'new',
    source: '',
    notes: '',
    follow_up_date: null,
    tags: []
  });

  useEffect(() => {
    fetchLeads();
    fetchTeam();
  }, [dealerId]);

  useEffect(() => {
    applyFilters();
  }, [leads, searchTerm, statusFilter, sourceFilter, assigneeFilter, dateFilter]);

  const fetchLeads = async () => {
    try {
      setLoading(true);
      
      let query = supabase
        .from('leads')
        .select('*');
      
      if (dealerId) {
        query = query.eq('dealer_id', dealerId);
      }
      
      const { data, error: fetchError } = await query
        .order('created_at', { ascending: false });
      
      if (fetchError) throw fetchError;
      
      setLeads(data || []);
      applyFilters();
    } catch (err) {
      setError('Failed to load leads');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchTeam = async () => {
    try {
      // In a real app, this would fetch from the database
      // Mock data for now
      setTeam([
        { id: 'user1', name: 'John Smith', role: 'Sales Manager', avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg' },
        { id: 'user2', name: 'Emma Johnson', role: 'Sales Associate', avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg' },
        { id: 'user3', name: 'Michael Brown', role: 'Sales Associate', avatar: 'https://images.pexels.com/photos/2379005/pexels-photo-2379005.jpeg' }
      ]);
    } catch (err) {
      console.error('Error fetching team:', err);
    }
  };

  const applyFilters = () => {
    let filtered = [...leads];
    
    // Search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(lead => 
        lead.name.toLowerCase().includes(term) ||
        lead.email.toLowerCase().includes(term) ||
        lead.phone.toLowerCase().includes(term) ||
        lead.vehicle_title.toLowerCase().includes(term)
      );
    }
    
    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(lead => lead.status === statusFilter);
    }
    
    // Source filter
    if (sourceFilter !== 'all') {
      filtered = filtered.filter(lead => lead.source === sourceFilter);
    }
    
    // Assignee filter
    if (assigneeFilter !== 'all') {
      filtered = filtered.filter(lead => lead.assigned_to === assigneeFilter);
    }
    
    // Date filter
    if (dateFilter !== 'all') {
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      
      if (dateFilter === 'today') {
        filtered = filtered.filter(lead => {
          const leadDate = new Date(lead.created_at);
          return leadDate >= today;
        });
      } else if (dateFilter === 'yesterday') {
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);
        
        filtered = filtered.filter(lead => {
          const leadDate = new Date(lead.created_at);
          return leadDate >= yesterday && leadDate < today;
        });
      } else if (dateFilter === 'week') {
        const weekAgo = new Date(today);
        weekAgo.setDate(weekAgo.getDate() - 7);
        
        filtered = filtered.filter(lead => {
          const leadDate = new Date(lead.created_at);
          return leadDate >= weekAgo;
        });
      } else if (dateFilter === 'month') {
        const monthAgo = new Date(today);
        monthAgo.setMonth(monthAgo.getMonth() - 1);
        
        filtered = filtered.filter(lead => {
          const leadDate = new Date(lead.created_at);
          return leadDate >= monthAgo;
        });
      }
    }
    
    setFilteredLeads(filtered);
    
    // Calculate pagination
    const pageSize = 10;
    setTotalPages(Math.ceil(filtered.length / pageSize));
    setCurrentPage(1); // Reset to first page when filters change
  };

  const getPagedLeads = () => {
    const pageSize = 10;
    const startIndex = (currentPage - 1) * pageSize;
    return filteredLeads.slice(startIndex, startIndex + pageSize);
  };

  const handleEditLead = (lead: Lead) => {
    setSelectedLead(lead);
    setFormData({
      name: lead.name,
      email: lead.email,
      phone: lead.phone,
      status: lead.status,
      source: lead.source,
      notes: lead.notes,
      follow_up_date: lead.follow_up_date,
      tags: lead.tags || []
    });
    setEditMode(true);
    setShowLeadModal(true);
  };

  const handleNewLead = () => {
    setSelectedLead(null);
    setFormData({
      name: '',
      email: '',
      phone: '',
      status: 'new',
      source: '',
      notes: '',
      follow_up_date: null,
      tags: []
    });
    setEditMode(false);
    setShowLeadModal(true);
  };

  const handleDeleteLead = (lead: Lead) => {
    setSelectedLead(lead);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!selectedLead) return;
    
    try {
      const { error } = await supabase
        .from('leads')
        .delete()
        .eq('id', selectedLead.id);
      
      if (error) throw error;
      
      setShowDeleteModal(false);
      setSelectedLead(null);
      fetchLeads();
    } catch (err) {
      setError('Failed to delete lead');
    }
  };

  const handleSaveLead = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editMode && selectedLead) {
        // Update existing lead
        const { error } = await supabase
          .from('leads')
          .update(formData)
          .eq('id', selectedLead.id);
        
        if (error) throw error;
      } else {
        // Create new lead
        const { error } = await supabase
          .from('leads')
          .insert({
            ...formData,
            dealer_id: dealerId,
            created_at: new Date().toISOString()
          });
        
        if (error) throw error;
      }
      
      setShowLeadModal(false);
      fetchLeads();
    } catch (err) {
      setError('Failed to save lead');
    }
  };

  const handleImportLeads = async () => {
    if (!importFile) return;
    
    try {
      setImportProgress(0);
      
      // Simulate upload progress
      const interval = setInterval(() => {
        setImportProgress(prev => {
          if (prev >= 95) {
            clearInterval(interval);
            return 95;
          }
          return prev + 5;
        });
      }, 200);
      
      // In a real app, this would parse the CSV/Excel and upload to Supabase
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      clearInterval(interval);
      setImportProgress(100);
      
      setTimeout(() => {
        setShowImportModal(false);
        setImportFile(null);
        setImportProgress(0);
        fetchLeads();
      }, 500);
      
    } catch (err) {
      setError('Failed to import leads');
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImportFile(file);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'contacted':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
      case 'qualified':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400';
      case 'negotiation':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400';
      case 'won':
        return 'bg-teal-100 text-teal-800 dark:bg-teal-900/30 dark:text-teal-400';
      case 'lost':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  const getTeamMember = (id: string | null) => {
    if (!id) return null;
    return team.find(member => member.id === id);
  };

  const getSourceIcon = (source: string) => {
    switch (source.toLowerCase()) {
      case 'website':
        return <Globe className="h-4 w-4" />;
      case 'phone':
        return <Phone className="h-4 w-4" />;
      case 'walk-in':
        return <User className="h-4 w-4" />;
      case 'referral':
        return <Users className="h-4 w-4" />;
      case 'social':
        return <MessageSquare className="h-4 w-4" />;
      default:
        return <Info className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold dark:text-white flex items-center">
          <Users className="h-6 w-6 mr-2 text-blue-600 dark:text-blue-400" />
          Lead Management System
        </h2>
        
        <div className="flex gap-2">
          <button
            onClick={() => setShowImportModal(true)}
            className="flex items-center px-3 py-1.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 text-sm"
          >
            <Upload className="h-4 w-4 mr-1" />
            Import
          </button>
          
          <button
            onClick={() => {}}
            className="flex items-center px-3 py-1.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 text-sm"
          >
            <Download className="h-4 w-4 mr-1" />
            Export
          </button>
          
          <button
            onClick={handleNewLead}
            className="flex items-center px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
          >
            <Plus className="h-4 w-4 mr-1" />
            Add Lead
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-4 rounded-lg">
          {error}
        </div>
      )}

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search leads..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
            />
          </div>
          
          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
            >
              <option value="all">All Statuses</option>
              <option value="new">New</option>
              <option value="contacted">Contacted</option>
              <option value="qualified">Qualified</option>
              <option value="negotiation">Negotiation</option>
              <option value="won">Won</option>
              <option value="lost">Lost</option>
            </select>
          </div>
          
          <div>
            <select
              value={sourceFilter}
              onChange={(e) => setSourceFilter(e.target.value)}
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
            >
              <option value="all">All Sources</option>
              <option value="website">Website</option>
              <option value="phone">Phone</option>
              <option value="walk-in">Walk-in</option>
              <option value="referral">Referral</option>
              <option value="social">Social Media</option>
            </select>
          </div>
          
          <div>
            <select
              value={assigneeFilter}
              onChange={(e) => setAssigneeFilter(e.target.value)}
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
            >
              <option value="all">All Assignees</option>
              <option value="unassigned">Unassigned</option>
              {team.map(member => (
                <option key={member.id} value={member.id}>{member.name}</option>
              ))}
            </select>
          </div>
          
          <div>
            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
            >
              <option value="all">All Time</option>
              <option value="today">Today</option>
              <option value="yesterday">Yesterday</option>
              <option value="week">Last 7 Days</option>
              <option value="month">Last 30 Days</option>
            </select>
          </div>
        </div>
      </div>

      {/* Leads Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : filteredLeads.length === 0 ? (
          <div className="text-center py-12">
            <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No Leads Found
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              No leads match your current filters.
            </p>
            <button
              onClick={() => {
                setSearchTerm('');
                setStatusFilter('all');
                setSourceFilter('all');
                setAssigneeFilter('all');
                setDateFilter('all');
              }}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 dark:bg-gray-700 text-left">
                    <th className="px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Lead</th>
                    <th className="px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Vehicle</th>
                    <th className="px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Status</th>
                    <th className="px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Source</th>
                    <th className="px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Assigned To</th>
                    <th className="px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Created</th>
                    <th className="px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Follow-up</th>
                    <th className="px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {getPagedLeads().map((lead) => {
                    const assignee = getTeamMember(lead.assigned_to);
                    
                    return (
                      <tr key={lead.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            <div className="bg-blue-100 dark:bg-blue-900 p-2 rounded-full text-blue-600 dark:text-blue-400 mr-3">
                              <User className="h-5 w-5" />
                            </div>
                            <div>
                              <div className="font-medium dark:text-white">{lead.name}</div>
                              <div className="text-sm text-gray-500 dark:text-gray-400 flex flex-col">
                                <span className="flex items-center">
                                  <Mail className="h-3 w-3 mr-1" />
                                  {lead.email}
                                </span>
                                <span className="flex items-center">
                                  <Phone className="h-3 w-3 mr-1" />
                                  {lead.phone}
                                </span>
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 dark:text-white">
                          <div className="flex items-center">
                            <Car className="h-4 w-4 mr-2 text-gray-400" />
                            {lead.vehicle_title}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(lead.status)}`}>
                            {lead.status.charAt(0).toUpperCase() + lead.status.slice(1)}
                          </span>
                        </td>
                        <td className="px-6 py-4 dark:text-white">
                          <div className="flex items-center">
                            {getSourceIcon(lead.source)}
                            <span className="ml-1">{lead.source}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          {assignee ? (
                            <div className="flex items-center">
                              <img 
                                src={assignee.avatar} 
                                alt={assignee.name}
                                className="w-6 h-6 rounded-full mr-2"
                              />
                              <span className="dark:text-white">{assignee.name}</span>
                            </div>
                          ) : (
                            <span className="text-gray-500 dark:text-gray-400">Unassigned</span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                          {new Date(lead.created_at).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 text-sm">
                          {lead.follow_up_date ? (
                            <span className={`flex items-center ${
                              new Date(lead.follow_up_date) < new Date() 
                                ? 'text-red-600 dark:text-red-400' 
                                : 'text-gray-600 dark:text-gray-400'
                            }`}>
                              <Calendar className="h-4 w-4 mr-1" />
                              {new Date(lead.follow_up_date).toLocaleDateString()}
                            </span>
                          ) : (
                            <span className="text-gray-500 dark:text-gray-400">Not scheduled</span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleEditLead(lead)}
                              className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                            >
                              <Edit className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteLead(lead)}
                              className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            
            {/* Pagination */}
            {totalPages > 1 && (
              <div className="px-6 py-4 flex justify-between items-center border-t dark:border-gray-700">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className={`flex items-center px-3 py-1 rounded ${
                    currentPage === 1
                      ? 'text-gray-400 cursor-not-allowed'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  <ArrowLeft className="h-4 w-4 mr-1" />
                  Previous
                </button>
                
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Page {currentPage} of {totalPages}
                </span>
                
                <button
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className={`flex items-center px-3 py-1 rounded ${
                    currentPage === totalPages
                      ? 'text-gray-400 cursor-not-allowed'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  Next
                  <ArrowRight className="h-4 w-4 ml-1" />
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Lead Modal */}
      {showLeadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold dark:text-white">
                {editMode ? 'Edit Lead' : 'Add New Lead'}
              </h3>
              <button
                onClick={() => setShowLeadModal(false)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSaveLead} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    value={formData.name || ''}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Email *
                  </label>
                  <input
                    type="email"
                    value={formData.email || ''}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Phone *
                  </label>
                  <input
                    type="tel"
                    value={formData.phone || ''}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Status
                  </label>
                  <select
                    value={formData.status || 'new'}
                    onChange={(e) => setFormData({...formData, status: e.target.value as any})}
                    className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                  >
                    <option value="new">New</option>
                    <option value="contacted">Contacted</option>
                    <option value="qualified">Qualified</option>
                    <option value="negotiation">Negotiation</option>
                    <option value="won">Won</option>
                    <option value="lost">Lost</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Source
                  </label>
                  <select
                    value={formData.source || ''}
                    onChange={(e) => setFormData({...formData, source: e.target.value})}
                    className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                  >
                    <option value="">Select Source</option>
                    <option value="website">Website</option>
                    <option value="phone">Phone</option>
                    <option value="walk-in">Walk-in</option>
                    <option value="referral">Referral</option>
                    <option value="social">Social Media</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Assign To
                  </label>
                  <select
                    value={selectedLead?.assigned_to || ''}
                    onChange={(e) => setSelectedLead(prev => prev ? {...prev, assigned_to: e.target.value} : null)}
                    className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                  >
                    <option value="">Unassigned</option>
                    {team.map(member => (
                      <option key={member.id} value={member.id}>{member.name}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Follow-up Date
                  </label>
                  <input
                    type="date"
                    value={formData.follow_up_date || ''}
                    onChange={(e) => setFormData({...formData, follow_up_date: e.target.value})}
                    className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Notes
                </label>
                <textarea
                  value={formData.notes || ''}
                  onChange={(e) => setFormData({...formData, notes: e.target.value})}
                  rows={4}
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                ></textarea>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Tags
                </label>
                <input
                  type="text"
                  placeholder="Enter tags separated by commas"
                  value={(formData.tags || []).join(', ')}
                  onChange={(e) => setFormData({
                    ...formData, 
                    tags: e.target.value.split(',').map(tag => tag.trim()).filter(Boolean)
                  })}
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                />
              </div>
              
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowLeadModal(false)}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  {editMode ? 'Update Lead' : 'Add Lead'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center mb-4">
              <AlertTriangle className="h-6 w-6 text-red-600 mr-2" />
              <h3 className="text-lg font-semibold dark:text-white">Delete Lead</h3>
            </div>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Are you sure you want to delete this lead? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Import Modal */}
      {showImportModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold dark:text-white">Import Leads</h3>
              <button
                onClick={() => setShowImportModal(false)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="mb-6">
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Upload your leads data in CSV or Excel format. Make sure your file follows our template structure.
              </p>
              
              <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center">
                {!importFile ? (
                  <>
                    <Upload className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                      Drag and drop your file here, or click to browse
                    </p>
                    <input
                      type="file"
                      id="file-upload"
                      className="hidden"
                      accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                      onChange={handleFileUpload}
                    />
                    <label
                      htmlFor="file-upload"
                      className="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer"
                    >
                      Select File
                    </label>
                  </>
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <FileText className="h-6 w-6 text-blue-600 dark:text-blue-400 mr-2" />
                      <span className="font-medium dark:text-white">{importFile.name}</span>
                    </div>
                    
                    {importProgress > 0 && (
                      <div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-1">
                          <div 
                            className="bg-blue-600 h-2 rounded-full" 
                            style={{ width: `${importProgress}%` }}
                          ></div>
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {importProgress < 100 ? `Importing: ${importProgress}%` : 'Import complete!'}
                        </div>
                      </div>
                    )}
                    
                    <button
                      onClick={() => setImportFile(null)}
                      className="text-sm text-red-600 dark:text-red-400"
                    >
                      Remove file
                    </button>
                  </div>
                )}
              </div>
              
              <div className="mt-4">
                <a 
                  href="#" 
                  className="text-sm text-blue-600 dark:text-blue-400 flex items-center"
                >
                  <Download className="h-4 w-4 mr-1" />
                  Download template file
                </a>
              </div>
            </div>
            
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowImportModal(false)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                Cancel
              </button>
              <button
                onClick={handleImportLeads}
                disabled={!importFile || importProgress > 0}
                className={`px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 ${
                  !importFile || importProgress > 0 ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {importProgress > 0 && importProgress < 100 ? (
                  <span className="flex items-center">
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Importing...
                  </span>
                ) : importProgress === 100 ? (
                  <span className="flex items-center">
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Completed
                  </span>
                ) : (
                  'Import'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Missing component
const Globe = (props: any) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <circle cx="12" cy="12" r="10" />
      <line x1="2" y1="12" x2="22" y2="12" />
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
  );
};

// Missing function
const Info = (props: any) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="16" x2="12" y2="12" />
      <line x1="12" y1="8" x2="12.01" y2="8" />
    </svg>
  );
};

export default LeadManagementSystem;