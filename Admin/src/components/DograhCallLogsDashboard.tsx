import { useEffect, useState, useCallback, Fragment } from 'react';
import {
  Phone, CheckCircle, AlertCircle, DollarSign, Clock,
  ChevronLeft, ChevronRight, Trash2, X, Loader2,
  ExternalLink, Mic, FileText, Search, ChevronDown, ChevronUp,
  RefreshCw
} from 'lucide-react';

// ── Types ─────────────────────────────────────────────────────────────────────

interface CostInfo {
  total_cost?: number;
  currency?: string;
  [key: string]: unknown;
}

interface DograhCallLog {
  _id: string;
  workflow_run_id: number;
  workflow_run_name: string;
  workflow_name: string;
  call_time: string;
  status: 'completed' | 'failed' | 'unknown';
  initial_context: Record<string, unknown>;
  gathered_context: Record<string, unknown>;
  cost_info: CostInfo;
  annotations: Record<string, unknown>;
  recording_url: string | null;
  transcript_url: string | null;
  campaign_id: number | null;
  createdAt: string;
}

interface Stats {
  totalCalls: number;
  completedCalls: number;
  failedCalls: number;
  totalCost: string;
}

interface Pagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function formatDate(iso: string) {
  return new Date(iso).toLocaleString(undefined, {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function StatusBadge({ status }: { status: DograhCallLog['status'] }) {
  if (status === 'completed') {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-100">
        <CheckCircle size={10} /> Completed
      </span>
    );
  }
  if (status === 'failed') {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-wine-light text-wine border border-wine/10">
        <AlertCircle size={10} /> Failed
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-zinc-100 text-zinc-600 border border-zinc-200">
      <Clock size={10} /> Unknown
    </span>
  );
}

// ── Detail Drawer ─────────────────────────────────────────────────────────────

function DetailDrawer({ log, onClose }: { log: DograhCallLog; onClose: () => void }) {
  const [section, setSection] = useState<'context' | 'cost' | 'qa'>('context');

  const phone = (log.initial_context?.phone || log.initial_context?.phone_number || '—') as string;
  const customerName = (log.initial_context?.customer_name || log.initial_context?.name || '—') as string;
  const outcome = (log.gathered_context?.resolution || log.gathered_context?.outcome || log.gathered_context?.mapped_call_disposition || log.gathered_context?.call_disposition || '—') as string;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* backdrop */}
      <div className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity duration-300" onClick={onClose} />

      {/* panel */}
      <div className="relative w-full max-w-xl bg-white/95 backdrop-blur-md border-l border-border shadow-2xl flex flex-col h-full overflow-hidden animate-slide-in">
        {/* Header */}
        <div className="flex items-start justify-between px-6 py-5 border-b border-border bg-white shrink-0">
          <div>
            <h2 className="text-base font-bold text-black">{log.workflow_run_name || 'Call Detail'}</h2>
            <p className="text-[10px] font-mono uppercase tracking-widest text-zinc-400 mt-1">Run ID #{log.workflow_run_id} · {formatDate(log.call_time)}</p>
          </div>
          <button onClick={onClose} className="p-2 text-zinc-400 hover:text-wine hover:bg-wine-light rounded-xl transition-all duration-200 cursor-pointer">
            <X size={18} />
          </button>
        </div>

        {/* Quick info strip */}
        <div className="grid grid-cols-3 divide-x divide-border bg-linear-to-b from-white to-offwhite border-b border-border shrink-0">
          <div className="px-4 py-3 text-center">
            <p className="text-[9px] font-black uppercase tracking-widest text-zinc-400">Customer</p>
            <p className="text-sm font-bold text-zinc-800 mt-1 truncate">{customerName}</p>
          </div>
          <div className="px-4 py-3 text-center">
            <p className="text-[9px] font-black uppercase tracking-widest text-zinc-400">Phone</p>
            <p className="text-sm font-bold text-zinc-800 mt-1 font-mono">{phone}</p>
          </div>
          <div className="px-4 py-3 text-center">
            <p className="text-[9px] font-black uppercase tracking-widest text-zinc-400">Outcome</p>
            <p className="text-sm font-bold text-zinc-800 mt-1 truncate">{outcome}</p>
          </div>
        </div>

        {/* Recording & Transcript buttons */}
        {(log.recording_url || log.transcript_url) && (
          <div className="flex gap-2.5 px-6 py-4 border-b border-border shrink-0">
            {log.recording_url && (
              <a
                href={log.recording_url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-wine-light text-wine border border-wine/10 rounded-xl text-xs font-bold hover:bg-wine hover:text-white transition-all active:scale-95 duration-200"
              >
                <Mic size={13} /> Listen to Recording <ExternalLink size={11} />
              </a>
            )}
            {log.transcript_url && (
              <a
                href={log.transcript_url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-zinc-50 text-zinc-700 border border-zinc-200 rounded-xl text-xs font-bold hover:bg-zinc-100 hover:text-black transition-all active:scale-95 duration-200"
              >
                <FileText size={13} /> View Transcript <ExternalLink size={11} />
              </a>
            )}
          </div>
        )}

        {/* Tabs */}
        <div className="flex border-b border-border shrink-0 px-6 bg-white">
          {(['context', 'cost', 'qa'] as const).map(t => (
            <button
              key={t}
              onClick={() => setSection(t)}
              className={`py-3 px-4 text-xs font-black uppercase tracking-wider mr-2 border-b-2 transition-all cursor-pointer ${
                section === t ? 'border-wine text-wine' : 'border-transparent text-zinc-400 hover:text-zinc-700'
              }`}
            >
              {t === 'context' ? 'Call Context' : t === 'cost' ? 'Cost Breakdown' : 'QA Annotations'}
            </button>
          ))}
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5 bg-white">
          {section === 'context' && (
            <>
              <div>
                <h4 className="text-[9px] font-black uppercase tracking-widest text-zinc-400 mb-2">Initial Context (sent to agent)</h4>
                <pre className="bg-zinc-50/50 border border-border rounded-xl p-4 text-[11px] text-zinc-700 overflow-auto whitespace-pre-wrap font-mono leading-relaxed shadow-inner max-h-[300px]">
                  {JSON.stringify(log.initial_context, null, 2)}
                </pre>
              </div>
              <div>
                <h4 className="text-[9px] font-black uppercase tracking-widest text-zinc-400 mb-2">Gathered Context (collected by agent)</h4>
                <pre className="bg-wine-light/20 border border-wine/10 rounded-xl p-4 text-[11px] text-zinc-700 overflow-auto whitespace-pre-wrap font-mono leading-relaxed shadow-inner max-h-[300px]">
                  {JSON.stringify(log.gathered_context, null, 2)}
                </pre>
              </div>
            </>
          )}

          {section === 'cost' && (
            <div>
              <h4 className="text-[9px] font-black uppercase tracking-widest text-zinc-400 mb-3">Cost Breakdown</h4>
              {Object.keys(log.cost_info).length === 0 ? (
                <p className="text-xs font-semibold text-zinc-400 py-4">No cost data available for this run.</p>
              ) : (
                <div className="space-y-1 bg-zinc-50/50 border border-border rounded-xl p-4">
                  {Object.entries(log.cost_info)
                    .filter(([, v]) => typeof v !== 'object' || v === null)
                    .map(([k, v]) => (
                    <div key={k} className="flex justify-between items-center py-2.5 border-b border-border/40 last:border-0 text-xs font-semibold">
                      <span className="text-zinc-500 capitalize">{k.replace(/_/g, ' ')}</span>
                      <span className="text-zinc-900 font-bold font-mono">
                        {k.includes('cost') && typeof v === 'number' ? `₹${(v * 94.38).toFixed(4)}` : String(v)}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {section === 'qa' && (
            <div>
              <h4 className="text-[9px] font-black uppercase tracking-widest text-zinc-400 mb-2">QA Annotations</h4>
              {Object.keys(log.annotations).length === 0 ? (
                <p className="text-xs font-semibold text-zinc-400 py-4">No QA annotations for this run.</p>
              ) : (
                <pre className="bg-amber-50/30 border border-amber-200/50 rounded-xl p-4 text-[11px] text-zinc-700 overflow-auto whitespace-pre-wrap font-mono leading-relaxed shadow-inner max-h-[300px]">
                  {JSON.stringify(log.annotations, null, 2)}
                </pre>
              )}
            </div>
          )}
        </div>

        {/* Status footer */}
        <div className="px-6 py-4 border-t border-border bg-offwhite shrink-0 flex items-center justify-between">
          <StatusBadge status={log.status} />
          <p className="text-[10px] font-mono uppercase tracking-widest text-zinc-400">Workflow: {log.workflow_name || '—'}</p>
        </div>
      </div>
    </div>
  );
}

// ── Main Dashboard ────────────────────────────────────────────────────────────

export default function DograhCallLogsDashboard() {
  const API = import.meta.env.VITE_API_URL || '';

  const [logs, setLogs] = useState<DograhCallLog[]>([]);
  const [stats, setStats] = useState<Stats>({ totalCalls: 0, completedCalls: 0, failedCalls: 0, totalCost: '0' });
  const [pagination, setPagination] = useState<Pagination>({ total: 0, page: 1, limit: 15, totalPages: 1 });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Filters
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(15);

  // Detail drawer
  const [selectedLog, setSelectedLog] = useState<DograhCallLog | null>(null);

  // Delete state
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);

  // Toast
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);
  const showToast = (msg: string, type: 'success' | 'error') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  // Expanded rows for quick preview
  const [expandedRows, setExpandedRows] = useState<Set<number>>(new Set());
  const toggleRow = (id: number) => {
    setExpandedRows(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const fetchLogs = useCallback(async (page = 1, showRefreshing = false) => {
    if (showRefreshing) setRefreshing(true); else setLoading(true);
    try {
      const params = new URLSearchParams({
        page: String(page),
        limit: String(rowsPerPage),
      });
      if (statusFilter !== 'all') params.set('status', statusFilter);
      if (dateFrom) params.set('dateFrom', dateFrom);
      if (dateTo) params.set('dateTo', dateTo);
      if (search.trim()) params.set('search', search.trim());

      const res = await fetch(`${API}/api/dograh-call-logs?${params}`);
      const data = await res.json();
      if (data.success) {
        setLogs(data.data);
        setPagination(data.pagination);
        setStats(data.stats);
      }
    } catch (err) {
      console.error('Failed to fetch Dograh call logs', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [API, statusFilter, dateFrom, dateTo, search, rowsPerPage]);

  useEffect(() => { fetchLogs(1); }, [statusFilter, dateFrom, dateTo, rowsPerPage]);

  // Search with debounce
  useEffect(() => {
    const t = setTimeout(() => fetchLogs(1), 400);
    return () => clearTimeout(t);
  }, [search]);

  const handleDeleteLog = async (runId: number) => {
    setDeletingId(runId);
    try {
      const res = await fetch(`${API}/api/dograh-call-logs/${runId}`, { method: 'DELETE' });
      const data = await res.json();
      if (res.ok && data.success) {
        showToast('Log deleted.', 'success');
        fetchLogs(pagination.page, true);
      } else {
        showToast(data.error || 'Failed to delete.', 'error');
      }
    } catch {
      showToast('Network error.', 'error');
    } finally {
      setDeletingId(null);
      setConfirmDeleteId(null);
    }
  };

  // ── Stat Cards ──────────────────────────────────────────────────────────────
  const statCards = [
    {
      label: 'Total Calls',
      value: stats.totalCalls,
      icon: Phone,
      color: 'text-wine',
      bg: 'bg-wine-light',
    },
    {
      label: 'Completed Calls',
      value: stats.completedCalls,
      icon: CheckCircle,
      color: 'text-emerald-600',
      bg: 'bg-emerald-50',
    },
    {
      label: 'Failed / No Answer',
      value: stats.failedCalls,
      icon: AlertCircle,
      color: 'text-red-600',
      bg: 'bg-red-50',
    },
    {
      label: 'Total AI Cost (INR)',
      value: `₹${(Number(stats.totalCost) * 94.38).toFixed(2)}`,
      icon: DollarSign,
      color: 'text-wine',
      bg: 'bg-wine-light',
    },
  ];

  return (
    <div className="min-h-screen p-6 md:p-8 max-w-7xl mx-auto bg-transparent relative z-10">

      {/* Toast */}
      {toast && (
        <div
          className={`fixed top-5 right-5 z-50 flex items-center gap-3 px-5 py-3 rounded-xl shadow-lg text-sm font-medium transition-all
            ${toast.type === 'success' ? 'bg-green-50 border border-green-200 text-green-800' : 'bg-red-50 border border-red-200 text-red-800'}`}
        >
          {toast.type === 'success' ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
          {toast.msg}
        </div>
      )}

      {/* Detail Drawer */}
      {selectedLog && (
        <DetailDrawer log={selectedLog} onClose={() => setSelectedLog(null)} />
      )}

      {/* Header */}
      <div className="mb-10 pb-6 border-b border-border/60">
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <div className="flex items-center gap-1.5 text-wine font-black text-[9px] uppercase tracking-widest">
              <Phone size={11} />
              <span>Voice Agent Log Desk</span>
            </div>
            <h1 className="text-3xl font-serif font-black tracking-tight text-black mt-2">
              Voice Agent Logs
            </h1>
            <p className="text-xs text-zinc-500 mt-1.5 uppercase font-mono tracking-widest font-semibold">
              Monitor all AI voice agent run activities, parameters, and expenses.
            </p>
          </div>
          <button
            onClick={() => fetchLogs(pagination.page, true)}
            disabled={refreshing}
            className="inline-flex items-center gap-2 px-4 py-2.5 border border-border text-zinc-700 bg-white/70 backdrop-blur-md rounded-xl text-xs font-black uppercase tracking-wider hover:bg-white hover:text-black active:scale-95 transition-all shadow-sm disabled:opacity-60 cursor-pointer"
          >
            <RefreshCw size={12} className={refreshing ? 'animate-spin' : ''} />
            Refresh
          </button>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {statCards.map((stat) => (
          <div key={stat.label} className="bg-white/70 backdrop-blur-md rounded-2xl border border-border shadow-card p-6 flex flex-col justify-between min-h-[130px] transition-all hover:bg-white">
            <div className="flex items-center justify-between mb-4">
              <span className="text-[9px] font-black uppercase tracking-widest text-zinc-400">{stat.label}</span>
              <div className={`${stat.bg} w-9 h-9 rounded-xl flex items-center justify-center`}>
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
              </div>
            </div>
            <div>
              <h3 className="text-2xl sm:text-3xl font-serif font-bold text-black truncate" title={String(stat.value)}>{loading ? '—' : stat.value}</h3>
              <p className="text-zinc-500 font-bold text-[9px] uppercase tracking-wider mt-1.5">Aggregate Metric</p>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 items-center bg-white/70 backdrop-blur-md p-5 rounded-2xl border border-border shadow-card mb-8">
        {/* Search */}
        <div className="relative flex-1 min-w-[240px]">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
          <input
            type="text"
            placeholder="Search by name, phone..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-wine/10 focus:border-wine bg-white text-xs font-semibold text-zinc-700 placeholder-zinc-400"
          />
        </div>

        <div className="w-px h-8 bg-border/85 hidden lg:block" />

        {/* Date from */}
        <div className="flex items-center gap-2">
          <label className="text-[9px] text-zinc-400 font-black uppercase tracking-widest">From:</label>
          <input
            type="date" value={dateFrom}
            onChange={e => setDateFrom(e.target.value)}
            className="px-3 py-2 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-wine/10 focus:border-wine bg-white text-xs font-semibold text-zinc-700 cursor-pointer"
          />
        </div>
        <div className="flex items-center gap-2">
          <label className="text-[9px] text-zinc-400 font-black uppercase tracking-widest">To:</label>
          <input
            type="date" value={dateTo}
            onChange={e => setDateTo(e.target.value)}
            className="px-3 py-2 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-wine/10 focus:border-wine bg-white text-xs font-semibold text-zinc-700 cursor-pointer"
          />
        </div>

        <div className="w-px h-8 bg-border/85 hidden lg:block" />

        {/* Status filter */}
        <select
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
          className="px-3 py-2.5 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-wine/10 focus:border-wine bg-white text-xs font-semibold text-zinc-700 cursor-pointer appearance-none pr-8 relative"
          style={{ backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%236B7280' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e")`, backgroundPosition: 'right 0.5rem center', backgroundSize: '1em', backgroundRepeat: 'no-repeat' }}
        >
          <option value="all">All Statuses</option>
          <option value="completed">Completed</option>
          <option value="failed">Failed</option>
          <option value="unknown">Unknown</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-white/70 backdrop-blur-md rounded-2xl shadow-card border border-border overflow-hidden mb-8">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-zinc-50/80 border-b border-border text-zinc-400 font-black text-[9px] uppercase tracking-widest">
              <tr>
                <th className="px-4 py-3.5 w-10 text-center" />
                <th className="px-5 py-3.5">Run Name</th>
                <th className="px-5 py-3.5">Phone</th>
                <th className="px-5 py-3.5">Outcome</th>
                <th className="px-5 py-3.5">Status</th>
                <th className="px-5 py-3.5">Cost</th>
                <th className="px-5 py-3.5">Call Time</th>
                <th className="px-5 py-3.5 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40 bg-transparent">
              {loading ? (
                <tr>
                  <td colSpan={8} className="px-6 py-20 text-center text-zinc-400">
                    <div className="flex flex-col items-center gap-3">
                      <div className="h-6 w-6 border-2 border-wine border-t-transparent rounded-full animate-spin" />
                      <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400">Loading call logs...</span>
                    </div>
                  </td>
                </tr>
              ) : logs.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-20 text-center text-zinc-400">
                    <div className="flex flex-col items-center gap-2.5">
                      <div className="p-3 bg-zinc-50 border border-border rounded-xl text-zinc-400">
                        <Phone size={24} />
                      </div>
                      <p className="font-bold text-zinc-800 text-sm">No call logs found</p>
                      <p className="text-xs text-zinc-400 max-w-xs mx-auto">Voice-agent activity results will appear here after calls are executed.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                logs.map(log => {
                  const phone = (log.initial_context?.phone || log.initial_context?.phone_number || '—') as string;
                  const outcome = (log.gathered_context?.resolution || log.gathered_context?.outcome || log.gathered_context?.mapped_call_disposition || log.gathered_context?.call_disposition || '—') as string;
                  const cost = log.cost_info?.total_cost;
                  const isExpanded = expandedRows.has(log.workflow_run_id);

                  return (
                    <Fragment key={log._id}>
                      <tr
                        className="hover:bg-white/90 border-b border-border/40 transition-colors cursor-pointer"
                        onClick={() => setSelectedLog(log)}
                      >
                        {/* Expand toggle */}
                        <td className="px-4 py-4 text-center" onClick={e => { e.stopPropagation(); toggleRow(log.workflow_run_id); }}>
                          <button className="p-1 text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 rounded-lg transition-all cursor-pointer">
                            {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                          </button>
                        </td>
                        <td className="px-5 py-4 font-bold text-zinc-800">
                          <span className="block truncate max-w-[200px]">{log.workflow_run_name || `Run #${log.workflow_run_id}`}</span>
                          <span className="text-[10px] text-zinc-400 font-mono font-normal">#{log.workflow_run_id}</span>
                        </td>
                        <td className="px-5 py-4 font-mono text-xs text-zinc-600 font-medium">{phone}</td>
                        <td className="px-5 py-4 text-zinc-600 font-semibold truncate max-w-[180px]">{outcome}</td>
                        <td className="px-5 py-4"><StatusBadge status={log.status} /></td>
                        <td className="px-5 py-4 text-zinc-900 font-bold font-mono">
                          {cost !== undefined ? `₹${(Number(cost) * 94.38).toFixed(2)}` : '—'}
                        </td>
                        <td className="px-5 py-4 text-zinc-400 text-[11px] whitespace-nowrap font-mono">{formatDate(log.call_time)}</td>
                        <td className="px-5 py-4" onClick={e => e.stopPropagation()}>
                          <div className="flex items-center justify-center gap-1.5">
                            {log.recording_url && (
                              <a href={log.recording_url} target="_blank" rel="noreferrer"
                                className="p-2 text-wine hover:bg-wine-light border border-transparent hover:border-wine/10 rounded-xl transition-all"
                                title="Listen to recording">
                                <Mic size={14} />
                              </a>
                            )}
                            {log.transcript_url && (
                              <a href={log.transcript_url} target="_blank" rel="noreferrer"
                                className="p-2 text-zinc-600 hover:bg-zinc-100 border border-transparent hover:border-zinc-200 rounded-xl transition-all"
                                title="View transcript">
                                <FileText size={14} />
                              </a>
                            )}
                            {confirmDeleteId === log.workflow_run_id ? (
                              <div className="flex items-center gap-1.5" onClick={e => e.stopPropagation()}>
                                <button
                                  onClick={() => handleDeleteLog(log.workflow_run_id)}
                                  disabled={deletingId === log.workflow_run_id}
                                  className="px-2.5 py-1 bg-wine text-white text-[10px] font-black uppercase tracking-wider rounded-lg hover:bg-wine-hover active:scale-95 disabled:opacity-60 transition-all flex items-center gap-1 cursor-pointer"
                                >
                                  {deletingId === log.workflow_run_id ? <Loader2 size={10} className="animate-spin" /> : null}
                                  Yes
                                </button>
                                <button onClick={() => setConfirmDeleteId(null)}
                                  className="px-2.5 py-1 bg-zinc-100 text-zinc-600 text-[10px] font-black uppercase tracking-wider rounded-lg hover:bg-zinc-200 active:scale-95 transition-all cursor-pointer">
                                  No
                                </button>
                              </div>
                            ) : (
                              <button
                                onClick={() => setConfirmDeleteId(log.workflow_run_id)}
                                className="p-2 text-zinc-400 hover:text-wine hover:bg-wine-light rounded-xl transition-all cursor-pointer"
                                title="Delete log">
                                <Trash2 size={14} />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>

                      {/* Expanded quick-view row */}
                      {isExpanded && (
                        <tr className="bg-zinc-50/50 border-t border-border/40">
                          <td colSpan={8} className="px-6 py-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                              <div>
                                <p className="font-black text-[9px] uppercase tracking-widest text-zinc-400 mb-2">Gathered Context</p>
                                <pre className="bg-white border border-border rounded-xl p-3 text-zinc-700 font-mono text-[10px] leading-relaxed max-h-48 overflow-auto shadow-inner">
                                  {JSON.stringify(log.gathered_context, null, 2)}
                                </pre>
                              </div>
                              <div>
                                <p className="font-black text-[9px] uppercase tracking-widest text-zinc-400 mb-2">Initial Context</p>
                                <pre className="bg-white border border-border rounded-xl p-3 text-zinc-700 font-mono text-[10px] leading-relaxed max-h-48 overflow-auto shadow-inner">
                                  {JSON.stringify(log.initial_context, null, 2)}
                                </pre>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </Fragment>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {!loading && logs.length > 0 && (
          <div className="bg-white/80 border-t border-border px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center text-xs font-semibold uppercase tracking-wider text-zinc-400">
              Showing <span className="font-bold text-zinc-800 mx-1">{(pagination.page - 1) * pagination.limit + 1}</span> to
              <span className="font-bold text-zinc-800 mx-1">{Math.min(pagination.page * pagination.limit, pagination.total)}</span>
              of <span className="font-bold text-zinc-800 mx-1">{pagination.total}</span> entries
            </div>
            <div className="flex items-center gap-5">
              <div className="flex items-center gap-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-zinc-400">Rows:</label>
                <select
                  value={rowsPerPage}
                  onChange={e => setRowsPerPage(Number(e.target.value))}
                  className="border border-border rounded-lg text-xs font-semibold py-1.5 pl-3 pr-8 focus:outline-none focus:ring-1 focus:ring-wine focus:border-wine bg-white cursor-pointer"
                >
                  <option value={10}>10</option>
                  <option value={15}>15</option>
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                </select>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => fetchLogs(pagination.page - 1)}
                  disabled={pagination.page === 1}
                  className="p-1.5 rounded-lg border border-border bg-white text-zinc-500 hover:text-black hover:bg-zinc-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
                >
                  <ChevronLeft size={16} />
                </button>
                <span className="text-xs font-black uppercase tracking-wider text-zinc-700 px-1">Page {pagination.page} of {pagination.totalPages}</span>
                <button
                  onClick={() => fetchLogs(pagination.page + 1)}
                  disabled={pagination.page === pagination.totalPages}
                  className="p-1.5 rounded-lg border border-border bg-white text-zinc-500 hover:text-black hover:bg-zinc-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
