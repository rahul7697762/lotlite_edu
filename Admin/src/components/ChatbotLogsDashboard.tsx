import { useEffect, useState } from 'react';
import { MessageSquare, RefreshCw, Activity, Users, Search, FilterX } from 'lucide-react';

export default function ChatbotLogsDashboard() {
  const [chatLogs, setChatLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [leadStatus, setLeadStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const fetchChatLogs = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || ''}/api/chat/logs`);
      const data = await res.json();
      if (data.success) {
        setChatLogs(data.data);
      }
    } catch (err) {
      console.error('Failed to fetch chat logs', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChatLogs();
  }, []);

  const filteredLogs = chatLogs.filter(session => {
    const sessionDate = new Date(session.updatedAt || session.createdAt);

    if (dateFrom) {
      const from = new Date(dateFrom);
      from.setHours(0, 0, 0, 0);
      if (sessionDate < from) return false;
    }
    if (dateTo) {
      const to = new Date(dateTo);
      to.setHours(23, 59, 59, 999);
      if (sessionDate > to) return false;
    }

    if (leadStatus === 'converted' && !session.leadId) return false;
    if (leadStatus === 'none' && session.leadId) return false;

    if (searchQuery) {
      const lowerQuery = searchQuery.toLowerCase();
      const idMatch = session.sessionId?.toLowerCase().includes(lowerQuery);
      const messagesMatch = session.messages?.some((msg: any) => msg.text?.toLowerCase().includes(lowerQuery));
      if (!idMatch && !messagesMatch) return false;
    }

    return true;
  });

  const clearFilters = () => {
    setDateFrom('');
    setDateTo('');
    setLeadStatus('all');
    setSearchQuery('');
  };

  return (
    <div className="min-h-screen p-6 md:p-8 max-w-7xl mx-auto bg-transparent relative z-10">
      
      <div className="mb-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-6 border-b border-border/60">
        <div>
          <div className="flex items-center gap-2 text-wine font-black text-[9px] uppercase tracking-widest">
            <MessageSquare size={12} />
            <span>AI Conversational Analytics</span>
          </div>
          <h1 className="text-3xl font-serif font-black tracking-tight text-black mt-2">
            Chatbot Logs
          </h1>
          <p className="text-xs text-zinc-500 mt-1 uppercase font-mono tracking-widest font-semibold">
            Review all user conversations with the AI Assistant.
          </p>
        </div>
        <button
          onClick={fetchChatLogs}
          disabled={loading}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 border border-border text-zinc-700 bg-white hover:bg-zinc-50 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all cursor-pointer shadow-sm disabled:opacity-50"
        >
          <RefreshCw size={12} className={loading ? 'animate-spin' : ''} />
          Refresh Logs
        </button>
      </div>

      {/* Filter Controls */}
      <div className="mb-8 flex flex-wrap gap-4 items-center bg-white/70 backdrop-blur-md p-5 rounded-2xl border border-border shadow-card">
        <div className="flex-1 w-full sm:w-auto relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" size={14} />
          <input
            type="text"
            placeholder="Search by keyword or session ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-wine/10 focus:border-wine bg-white text-xs font-semibold text-zinc-700"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <label className="text-[10px] font-black uppercase tracking-wider text-zinc-400 whitespace-nowrap">From:</label>
          <input
            type="date"
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
            className="px-4 py-2 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-wine/10 focus:border-wine bg-white text-xs font-semibold text-zinc-700 w-full sm:w-auto cursor-pointer"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <label className="text-[10px] font-black uppercase tracking-wider text-zinc-400 whitespace-nowrap">To:</label>
          <input
            type="date"
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
            className="px-4 py-2 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-wine/10 focus:border-wine bg-white text-xs font-semibold text-zinc-700 w-full sm:w-auto cursor-pointer"
          />
        </div>

        <select
          value={leadStatus}
          onChange={(e) => setLeadStatus(e.target.value)}
          className="px-4 py-2.5 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-wine/10 focus:border-wine bg-white text-xs font-semibold text-zinc-700 w-full sm:w-auto cursor-pointer"
        >
          <option value="all">All Sessions</option>
          <option value="converted">Converted to Lead</option>
          <option value="none">No Lead Data</option>
        </select>

        {(dateFrom || dateTo || leadStatus !== 'all' || searchQuery) && (
          <button
            onClick={clearFilters}
            className="px-3 py-2 text-xs font-black uppercase tracking-wider text-red-600 hover:bg-red-50 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer w-full sm:w-auto"
            title="Clear Filters"
          >
            <FilterX size={14} /> Clear
          </button>
        )}
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-pulse flex flex-col items-center gap-3">
            <div className="h-8 w-8 border-2 border-wine border-t-transparent rounded-full animate-spin"></div>
            <span className="text-zinc-500 font-bold text-xs uppercase tracking-wider">Loading transcripts...</span>
          </div>
        </div>
      ) : chatLogs.length === 0 ? (
        <div className="text-center py-20 bg-white/70 border border-border rounded-2xl shadow-card">
          <MessageSquare size={32} className="text-wine/40 mx-auto mb-3" />
          <p className="text-zinc-500 text-xs font-bold uppercase tracking-wider">No chatbot logs found.</p>
        </div>
      ) : (
        <div className="grid gap-6">
          {filteredLogs.length === 0 ? (
            <div className="text-center py-20 bg-white/70 border border-border rounded-2xl shadow-card">
              <MessageSquare size={32} className="text-wine/40 mx-auto mb-3" />
              <p className="text-zinc-500 text-xs font-bold uppercase tracking-wider">No results match filters.</p>
            </div>
          ) : (
            filteredLogs.map((session, i) => (
              <div key={i} className="bg-white/70 backdrop-blur-md border border-border rounded-2xl p-6 shadow-card overflow-hidden flex flex-col gap-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/50 pb-4">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-wider text-zinc-400">Session ID: <span className="text-gray-900 font-mono font-bold">{session.sessionId}</span></p>
                    {session.leadId && (
                      <p className="text-[9px] uppercase font-black tracking-wider text-emerald-700 mt-2 bg-emerald-50 border border-emerald-200/50 inline-block px-2.5 py-1 rounded-lg">
                        Converted Lead: {session.leadId.fullName || "Unknown"}
                      </p>
                    )}
                  </div>
                  <p className="text-[10px] font-mono text-zinc-500 font-bold uppercase tracking-wider bg-zinc-50/50 px-3 py-1.5 rounded-lg border border-border self-start sm:self-auto">
                    {new Date(session.updatedAt || session.createdAt).toLocaleString()}
                  </p>
                </div>

                <div className="bg-zinc-50/30 border border-border/50 rounded-2xl p-5 space-y-4 max-h-[400px] overflow-y-auto">
                  {session.messages && session.messages.map((msg: any, j: number) => (
                    <div key={j} className={`flex gap-3 text-xs font-semibold leading-relaxed ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                      {msg.sender !== 'user' && (
                        <span className="w-8 h-8 rounded-full shrink-0 flex items-center justify-center bg-wine-light text-wine border border-wine/10">
                          <Activity size={14} />
                        </span>
                      )}
                      <div className={`p-3.5 rounded-2xl max-w-[85%] shadow-sm ${msg.sender === 'user' ? 'bg-wine text-white rounded-tr-none' : 'bg-white border border-border text-zinc-700 rounded-tl-none'}`}>
                        <span className="break-words whitespace-pre-wrap">{msg.text || (msg.isContactForm ? '[Callback Request Form Displayed]' : '')}</span>
                      </div>
                      {msg.sender === 'user' && (
                        <span className="w-8 h-8 rounded-full shrink-0 flex items-center justify-center bg-zinc-100 text-zinc-500 border border-border">
                          <Users size={14} />
                        </span>
                      )}
                    </div>
                  ))}
                  {(!session.messages || session.messages.length === 0) && (
                    <p className="text-xs text-zinc-400 italic text-center py-6">Session initialized but no messages recorded.</p>
                  )}
                </div>
              </div>
            )))}
        </div>
      )}
    </div>
  );
}
