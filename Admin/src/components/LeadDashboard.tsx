import { useEffect, useState } from 'react';
import {
  Users, AlertCircle, CheckCircle, Clock,
  ChevronLeft, ChevronRight, Plus, Trash2, X, Loader2
} from 'lucide-react';

interface Lead {
  _id: string;
  fullName: string;
  email?: string;
  phone: string;
  programCategory?: string;
  programSpecialization?: string;
  source: string;
  callyzerStatus: 'pending' | 'sent' | 'failed';
  createdAt: string;
}

interface AddLeadForm {
  fullName: string;
  email: string;
  phone: string;
  programCategory: string;
  programSpecialization: string;
  source: string;
}

const EMPTY_FORM: AddLeadForm = {
  fullName: '',
  email: '',
  phone: '',
  programCategory: '',
  programSpecialization: '',
  source: 'Admin Panel',
};

export default function LeadDashboard() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);

  // Filter States
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sourceFilter, setSourceFilter] = useState('all');

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Add Lead Modal
  const [showAddModal, setShowAddModal] = useState(false);
  const [form, setForm] = useState<AddLeadForm>(EMPTY_FORM);
  const [addLoading, setAddLoading] = useState(false);
  const [addError, setAddError] = useState('');

  // Delete state
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  // Toast
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);

  const showToast = (msg: string, type: 'success' | 'error') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const API = import.meta.env.VITE_API_URL || '';

  const fetchLeads = async () => {
    try {
      const res = await fetch(`${API}/api/leads`);
      const data = await res.json();
      if (data.success) setLeads(data.data);
    } catch (err) {
      console.error('Failed to fetch leads', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchLeads(); }, []);

  // Extract unique sources for the filter dropdown
  const uniqueSources = Array.from(new Set(leads.map(l => l.source))).filter(Boolean);

  // Reset to first page when any filter changes
  useEffect(() => { setCurrentPage(1); }, [dateFrom, dateTo, statusFilter, sourceFilter, rowsPerPage]);

  const filteredLeads = leads.filter(lead => {
    const leadDate = new Date(lead.createdAt);
    let matchesDate = true;
    if (dateFrom) {
      const from = new Date(dateFrom); from.setHours(0, 0, 0, 0);
      if (leadDate < from) matchesDate = false;
    }
    if (dateTo) {
      const to = new Date(dateTo); to.setHours(23, 59, 59, 999);
      if (leadDate > to) matchesDate = false;
    }
    const matchesStatus = statusFilter === 'all' || lead.callyzerStatus === statusFilter;
    const matchesSource = sourceFilter === 'all' || lead.source === sourceFilter;
    return matchesDate && matchesStatus && matchesSource;
  });

  const totalPages = Math.ceil(filteredLeads.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const paginatedLeads = filteredLeads.slice(startIndex, startIndex + rowsPerPage);

  // --- Add Lead ---
  const handleAddLead = async (e: React.FormEvent) => {
    e.preventDefault();
    setAddError('');
    if (!form.fullName.trim() || !form.phone.trim()) {
      setAddError('Full name and phone are required.');
      return;
    }
    setAddLoading(true);
    try {
      const res = await fetch(`${API}/api/leads`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        showToast('Lead added successfully!', 'success');
        setShowAddModal(false);
        setForm(EMPTY_FORM);
        await fetchLeads();
      } else {
        setAddError(data.error || 'Failed to add lead.');
      }
    } catch {
      setAddError('Network error. Please try again.');
    } finally {
      setAddLoading(false);
    }
  };

  // --- Delete Lead ---
  const handleDeleteLead = async (id: string) => {
    setDeletingId(id);
    try {
      const res = await fetch(`${API}/api/leads/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (res.ok && data.success) {
        setLeads(prev => prev.filter(l => l._id !== id));
        showToast('Lead deleted.', 'success');
      } else {
        showToast(data.error || 'Failed to delete lead.', 'error');
      }
    } catch {
      showToast('Network error. Please try again.', 'error');
    } finally {
      setDeletingId(null);
      setConfirmDeleteId(null);
    }
  };

  return (
    <div className="min-h-screen p-6 md:p-8 max-w-7xl mx-auto bg-transparent relative z-10">

      {/* Toast */}
      {toast && (
        <div
          className={`fixed top-6 right-6 z-50 flex items-center gap-3 px-6 py-4 rounded-2xl shadow-2xl text-xs font-bold uppercase tracking-wider transition-all duration-300 border backdrop-blur-md
            ${toast.type === 'success' ? 'bg-emerald-50/90 border-emerald-200 text-emerald-800' : 'bg-red-50/90 border-red-200 text-red-800'}`}
        >
          {toast.type === 'success' ? <CheckCircle size={14} /> : <AlertCircle size={14} />}
          {toast.msg}
        </div>
      )}

      {/* Header */}
      <div className="mb-10 flex flex-col gap-6">
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <div className="flex items-center gap-2 text-wine font-black text-[9px] uppercase tracking-widest">
              <Users size={12} />
              <span>Lead Tracking Cockpit</span>
            </div>
            <h1 className="text-3xl font-serif font-black tracking-tight text-black mt-2">
              Leads Registry
            </h1>
            <p className="text-xs text-zinc-500 mt-1 uppercase font-mono tracking-widest font-semibold">
              Manage and monitor captured leads from all channels.
            </p>
          </div>
          <button
            onClick={() => { setShowAddModal(true); setAddError(''); setForm(EMPTY_FORM); }}
            className="inline-flex items-center gap-1.5 px-5 py-3 bg-wine hover:bg-black text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all cursor-pointer shadow-md hover:shadow-lg active:scale-95"
            id="add-lead-btn"
          >
            <Plus size={14} /> Add Lead
          </button>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-4 items-center bg-white/70 backdrop-blur-md p-5 rounded-2xl border border-border shadow-card">
          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            <label className="text-[10px] font-black uppercase tracking-wider text-zinc-400 whitespace-nowrap">From:</label>
            <input
              type="date" value={dateFrom}
              onChange={e => setDateFrom(e.target.value)}
              className="px-4 py-2 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-wine/10 focus:border-wine bg-white text-xs font-semibold text-zinc-700 w-full sm:w-auto transition-all cursor-pointer"
            />
          </div>
          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            <label className="text-[10px] font-black uppercase tracking-wider text-zinc-400 whitespace-nowrap">To:</label>
            <input
              type="date" value={dateTo}
              onChange={e => setDateTo(e.target.value)}
              className="px-4 py-2 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-wine/10 focus:border-wine bg-white text-xs font-semibold text-zinc-700 w-full sm:w-auto transition-all cursor-pointer"
            />
          </div>
          <div className="w-px h-8 bg-border hidden sm:block mx-2"></div>
          <select
            value={sourceFilter} onChange={e => setSourceFilter(e.target.value)}
            className="px-4 py-2.5 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-wine/10 focus:border-wine bg-white text-xs font-semibold text-zinc-700 w-full sm:w-auto cursor-pointer"
          >
            <option value="all">All Sources</option>
            {uniqueSources.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          <select
            value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
            className="px-4 py-2.5 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-wine/10 focus:border-wine bg-white text-xs font-semibold text-zinc-700 w-full sm:w-auto cursor-pointer"
          >
            <option value="all">All Statuses</option>
            <option value="sent">Sent</option>
            <option value="pending">Pending</option>
            <option value="failed">Failed</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white/70 backdrop-blur-md rounded-2xl border border-border shadow-card overflow-hidden flex flex-col">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse">
            <thead className="bg-zinc-50/50 border-b border-border/80 text-[10px] font-black text-zinc-400 uppercase tracking-widest">
              <tr>
                <th className="px-6 py-4">Name</th>
                <th className="px-6 py-4">Phone</th>
                <th className="px-6 py-4">Source</th>
                <th className="px-6 py-4">Program</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Date</th>
                <th className="px-6 py-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40">
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-16 text-center text-zinc-500">
                    <div className="animate-pulse flex flex-col items-center gap-3">
                      <div className="h-6 w-6 border-2 border-wine border-t-transparent rounded-full animate-spin"></div>
                      <span className="text-xs uppercase font-bold tracking-wider">Loading leads...</span>
                    </div>
                  </td>
                </tr>
              ) : filteredLeads.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-16 text-center text-zinc-400 font-semibold text-xs py-8">
                    No leads found matching your search.
                  </td>
                </tr>
              ) : (
                paginatedLeads.map(lead => (
                  <tr key={lead._id} className="hover:bg-white/80 transition-colors">
                    <td className="px-6 py-4 font-bold text-gray-900 text-sm">{lead.fullName}</td>
                    <td className="px-6 py-4 text-zinc-600 font-mono text-xs">{lead.phone}</td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-lg text-[9px] font-black uppercase tracking-wider bg-wine-light text-wine border border-wine/10">
                        {lead.source}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-zinc-700 text-xs font-semibold truncate max-w-[150px]">{lead.programCategory || '-'}</td>
                    <td className="px-6 py-4">
                      {lead.callyzerStatus === 'sent' && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200/50">
                          <CheckCircle size={10} /> Sent
                        </span>
                      )}
                      {lead.callyzerStatus === 'failed' && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-red-50 text-red-700 border border-red-200/50">
                          <AlertCircle size={10} /> Failed
                        </span>
                      )}
                      {lead.callyzerStatus === 'pending' && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-50 text-amber-700 border border-amber-200/50">
                          <Clock size={10} /> Pending
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right text-zinc-500 font-semibold text-xs whitespace-nowrap">
                      {new Date(lead.createdAt).toLocaleString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </td>
                    <td className="px-6 py-4 text-center">
                      {confirmDeleteId === lead._id ? (
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => handleDeleteLead(lead._id)}
                            disabled={deletingId === lead._id}
                            className="px-2.5 py-1 bg-red-600 text-white text-[10px] font-bold uppercase tracking-wider rounded-md hover:bg-red-700 disabled:opacity-60 flex items-center gap-1 cursor-pointer"
                          >
                            {deletingId === lead._id ? <Loader2 size={10} className="animate-spin" /> : null}
                            Yes
                          </button>
                          <button
                            onClick={() => setConfirmDeleteId(null)}
                            className="px-2.5 py-1 bg-zinc-100 text-zinc-700 text-[10px] font-bold uppercase tracking-wider rounded-md hover:bg-zinc-200 cursor-pointer"
                          >
                            No
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setConfirmDeleteId(lead._id)}
                          className="p-2 text-zinc-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                          title="Delete lead"
                        >
                          <Trash2 size={15} />
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        {!loading && filteredLeads.length > 0 && (
          <div className="bg-white/70 border-t border-border/80 px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-semibold text-zinc-500">
            <div className="flex items-center">
              Showing <span className="font-bold text-gray-900 mx-1">{startIndex + 1}</span> to
              <span className="font-bold text-gray-900 mx-1">{Math.min(startIndex + rowsPerPage, filteredLeads.length)}</span>
              of <span className="font-bold text-gray-900 mx-1">{filteredLeads.length}</span> results
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <label htmlFor="rowsPerPage" className="text-zinc-400 text-[10px] font-bold uppercase tracking-wider">Rows:</label>
                <select
                  id="rowsPerPage" value={rowsPerPage}
                  onChange={e => setRowsPerPage(Number(e.target.value))}
                  className="border border-border rounded-lg text-xs py-1.5 px-3 focus:outline-none focus:ring-2 focus:ring-wine/10 focus:border-wine bg-white cursor-pointer"
                >
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                  <option value={50}>50</option>
                  <option value={100}>100</option>
                </select>
              </div>
              <div className="flex items-center gap-1.5">
                <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}
                  className="p-2 rounded-lg text-zinc-400 hover:bg-wine-light hover:text-wine transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer">
                  <ChevronLeft size={16} />
                </button>
                <div className="text-zinc-600">Page {currentPage} of {totalPages}</div>
                <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}
                  className="p-2 rounded-lg text-zinc-400 hover:bg-wine-light hover:text-wine transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer">
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ── Add Lead Modal ── */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-sm">
          <div className="bg-white border border-border rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-fade-in relative z-20">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-border/50">
              <div>
                <h2 className="text-sm font-black text-black uppercase tracking-wider">Add New Lead</h2>
                <p className="text-[11px] text-zinc-400 mt-0.5">Fill in the details below to create a lead.</p>
              </div>
              <button onClick={() => setShowAddModal(false)}
                className="p-2 text-zinc-400 hover:text-zinc-800 bg-zinc-50 rounded-lg hover:bg-zinc-100 transition-colors cursor-pointer">
                <X size={16} />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleAddLead} className="px-6 py-5 space-y-4">
              {addError && (
                <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs font-semibold">
                  <AlertCircle size={14} className="shrink-0" /> {addError}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-[9px] font-black text-zinc-400 uppercase tracking-widest mb-1.5">Full Name <span className="text-red-500">*</span></label>
                  <input
                    id="lead-fullName"
                    type="text" placeholder="e.g. Rahul Sharma"
                    value={form.fullName}
                    onChange={e => setForm(f => ({ ...f, fullName: e.target.value }))}
                    required
                    className="w-full px-4 py-2.5 border border-border rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-wine/10 focus:border-wine bg-zinc-50/50"
                  />
                </div>

                <div>
                  <label className="block text-[9px] font-black text-zinc-400 uppercase tracking-widest mb-1.5">Phone <span className="text-red-500">*</span></label>
                  <input
                    id="lead-phone"
                    type="tel" placeholder="e.g. 9876543210"
                    value={form.phone}
                    onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                    required
                    className="w-full px-4 py-2.5 border border-border rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-wine/10 focus:border-wine bg-zinc-50/50"
                  />
                </div>

                <div>
                  <label className="block text-[9px] font-black text-zinc-400 uppercase tracking-widest mb-1.5">Email</label>
                  <input
                    id="lead-email"
                    type="email" placeholder="e.g. rahul@email.com"
                    value={form.email}
                    onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                    className="w-full px-4 py-2.5 border border-border rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-wine/10 focus:border-wine bg-zinc-50/50"
                  />
                </div>

                <div>
                  <label className="block text-[9px] font-black text-zinc-400 uppercase tracking-widest mb-1.5">Program Category</label>
                  <input
                    id="lead-programCategory"
                    type="text" placeholder="e.g. MBA"
                    value={form.programCategory}
                    onChange={e => setForm(f => ({ ...f, programCategory: e.target.value }))}
                    className="w-full px-4 py-2.5 border border-border rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-wine/10 focus:border-wine bg-zinc-50/50"
                  />
                </div>

                <div>
                  <label className="block text-[9px] font-black text-zinc-400 uppercase tracking-widest mb-1.5">Specialization</label>
                  <input
                    id="lead-programSpecialization"
                    type="text" placeholder="e.g. Finance"
                    value={form.programSpecialization}
                    onChange={e => setForm(f => ({ ...f, programSpecialization: e.target.value }))}
                    className="w-full px-4 py-2.5 border border-border rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-wine/10 focus:border-wine bg-zinc-50/50"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-[9px] font-black text-zinc-400 uppercase tracking-widest mb-1.5">Source</label>
                  <input
                    id="lead-source"
                    type="text" placeholder="e.g. Admin Panel"
                    value={form.source}
                    onChange={e => setForm(f => ({ ...f, source: e.target.value }))}
                    className="w-full px-4 py-2.5 border border-border rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-wine/10 focus:border-wine bg-zinc-50/50"
                  />
                </div>
              </div>

              {/* Modal Footer */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-border/50">
                <button type="button" onClick={() => setShowAddModal(false)}
                  className="px-4 py-2.5 text-xs font-black uppercase tracking-wider text-zinc-500 bg-zinc-100 hover:bg-zinc-200 rounded-xl transition-colors cursor-pointer">
                  Cancel
                </button>
                <button type="submit" disabled={addLoading}
                  id="submit-add-lead-btn"
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-wine hover:bg-black text-white text-xs font-black uppercase tracking-widest rounded-xl transition-all cursor-pointer">
                  {addLoading && <Loader2 size={12} className="animate-spin" />}
                  {addLoading ? 'Adding...' : 'Add Lead'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
