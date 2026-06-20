import { useEffect, useState } from 'react';
import { Users, MousePointerClick, TrendingUp, CheckCircle, AlertCircle } from 'lucide-react';

interface Lead {
  _id: string;
  fullName: string;
  source: string;
  callyzerStatus: string;
  createdAt: string;
}

export default function OverviewDashboard() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeads = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL || ''}/api/leads`);
        const data = await res.json();
        if (data.success) {
          setLeads(data.data);
        }
      } catch (err) {
        console.error('Failed to fetch leads', err);
      } finally {
        setLoading(false);
      }
    };
    fetchLeads();
  }, []);

  // Compute Real Metrics
  const totalLeads = leads.length;
  const sentLeads = leads.filter(l => l.callyzerStatus === 'sent').length;
  const failedLeads = leads.filter(l => l.callyzerStatus === 'failed').length;
  const successRate = totalLeads > 0 ? Math.round((sentLeads / totalLeads) * 100) : 0;

  // Compute Top Source
  const sources = leads.reduce((acc, lead) => {
    acc[lead.source] = (acc[lead.source] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  const sortedSources = Object.entries(sources).sort((a, b) => b[1] - a[1]);
  const topSource = sortedSources.length > 0 ? sortedSources[0][0] : 'N/A';

  const stats = [
    {
      label: 'Total Leads Captured',
      value: totalLeads.toString(),
      icon: Users,
      color: 'text-wine',
      bg: 'bg-wine-light'
    },
    {
      label: 'Callyzer Success Rate',
      value: `${successRate}%`,
      icon: TrendingUp,
      color: 'text-emerald-600',
      bg: 'bg-emerald-50'
    },
    {
      label: 'Top Lead Source',
      value: topSource,
      icon: MousePointerClick,
      color: 'text-wine',
      bg: 'bg-wine-light'
    },
    {
      label: 'Failed API Syncs',
      value: failedLeads.toString(),
      icon: AlertCircle,
      color: 'text-red-600',
      bg: 'bg-red-50'
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen p-8 max-w-7xl mx-auto flex justify-center items-center bg-transparent">
        <div className="animate-spin h-8 w-8 border-4 border-wine border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 md:p-8 max-w-7xl mx-auto bg-transparent relative z-10">
      <div className="mb-10 pb-6 border-b border-border/60">
        <div className="flex items-center gap-2 text-wine font-black text-[9px] uppercase tracking-widest">
          <span>Operational Dashboard Cockpit</span>
        </div>
        <h1 className="text-3xl font-serif font-black tracking-tight text-black mt-2">
          System Overview
        </h1>
        <p className="text-xs text-zinc-500 mt-1 uppercase font-mono tracking-widest font-semibold">
          Real-time metrics based on database leads.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white/70 backdrop-blur-md rounded-2xl border border-border shadow-card p-6 flex flex-col justify-between min-h-[130px] transition-all hover:bg-white">
            <div className="flex items-center justify-between mb-4">
              <span className="text-[9px] font-black uppercase tracking-widest text-zinc-400">{stat.label}</span>
              <div className={`${stat.bg} w-9 h-9 rounded-xl flex items-center justify-center`}>
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
              </div>
            </div>
            <div>
              <h3 className="text-3xl font-serif font-bold text-black truncate" title={stat.value}>{stat.value}</h3>
              <p className="text-zinc-500 font-bold text-[9px] uppercase tracking-wider mt-1.5">Aggregate Metric</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Source Breakdown Table */}
        <div className="bg-white/70 backdrop-blur-md rounded-2xl border border-border shadow-card p-6">
          <h3 className="text-xs font-black uppercase tracking-wider text-black mb-6 flex items-center gap-2">
            <MousePointerClick className="w-4 h-4 text-wine"/> Leads by Source
          </h3>
          <div className="space-y-4">
            <div className="flex justify-between text-[10px] font-black text-zinc-400 uppercase tracking-widest pb-3 border-b border-border/80">
              <span>Source Name</span>
              <span className="text-right">Total Leads</span>
            </div>
            {sortedSources.length === 0 && (
              <p className="text-xs text-zinc-400 text-center py-6 font-semibold">No source data available.</p>
            )}
            {sortedSources.map(([sourceName, count], i) => (
              <div key={i} className="flex justify-between items-center py-2.5 border-b border-border/40 text-xs font-semibold">
                <span className="text-zinc-700 truncate pr-4">{sourceName}</span>
                <span className="text-wine font-bold bg-wine-light border border-wine/10 px-2 py-0.5 rounded-lg font-mono">{count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Sync Status Table */}
        <div className="bg-white/70 backdrop-blur-md rounded-2xl border border-border shadow-card p-6">
          <h3 className="text-xs font-black uppercase tracking-wider text-black mb-6 flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-wine"/> API Sync Status
          </h3>
          <div className="space-y-4">
            <div className="flex justify-between text-[10px] font-black text-zinc-400 uppercase tracking-widest pb-3 border-b border-border/80">
              <span>Status</span>
              <span className="text-right">Count</span>
            </div>
            <div className="flex justify-between items-center py-2.5 border-b border-border/40 text-xs font-semibold">
              <span className="text-emerald-600 flex items-center gap-1.5"><CheckCircle className="w-4 h-4"/> Sent to Callyzer</span>
              <span className="text-zinc-700 font-bold bg-zinc-50 border border-border px-2 py-0.5 rounded-lg font-mono">{sentLeads}</span>
            </div>
            <div className="flex justify-between items-center py-2.5 border-b border-border/40 text-xs font-semibold">
              <span className="text-red-600 flex items-center gap-1.5"><AlertCircle className="w-4 h-4"/> Failed to Sync</span>
              <span className="text-zinc-700 font-bold bg-zinc-50 border border-border px-2 py-0.5 rounded-lg font-mono">{failedLeads}</span>
            </div>
            <div className="flex justify-between items-center py-2.5 border-b border-border/40 text-xs font-semibold">
              <span className="text-amber-600 flex items-center gap-1.5"><Users className="w-4 h-4"/> Pending / Unknown</span>
              <span className="text-zinc-700 font-bold bg-zinc-50 border border-border px-2 py-0.5 rounded-lg font-mono">{totalLeads - sentLeads - failedLeads}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

