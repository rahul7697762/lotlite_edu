import { useState } from 'react';
import LeadDashboard from './components/LeadDashboard';
import OverviewDashboard from './components/OverviewDashboard';
import BlogGeneration from './components/BlogGeneration';
import WebsiteDataDashboard from './components/WebsiteDataDashboard';
import ChatbotLogsDashboard from './components/ChatbotLogsDashboard';
import DograhCallLogsDashboard from './components/DograhCallLogsDashboard';
import { LayoutDashboard, Users, LogOut, Menu, X, FileText, Globe, MessageSquare, Phone } from 'lucide-react';
import logo from './assets/Lotlite_Logo.png';

import Login from './components/Login';

type ViewState = 'overview' | 'leads' | 'blog' | 'website-data' | 'chatbot-logs' | 'dograh-call-logs';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('lotlite_admin_auth') === 'true';
  });
  const [activeView, setActiveView] = useState<ViewState>('overview');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogin = () => {
    setIsAuthenticated(true);
    localStorage.setItem('lotlite_admin_auth', 'true');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('lotlite_admin_auth');
    localStorage.removeItem('lotlite_admin_token');
  };

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
  const handleNavClick = (view: ViewState) => {
    setActiveView(view);
    setIsMobileMenuOpen(false);
  };

  const SidebarContent = () => (
    <>
      <div className="py-5 flex flex-col items-start px-6 border-b border-border/60 shrink-0 gap-2">
        <img src={logo} alt="Lotlite" className="h-12 object-contain" />
        <div className="flex flex-col mt-1">
          <span className="text-[9px] font-black text-wine uppercase tracking-widest leading-none">Cockpit Panel</span>
          <h1 className="text-[11px] font-black text-black tracking-widest uppercase mt-1">Lotlite Admin</h1>
        </div>
      </div>
      
      <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
        <button 
          onClick={() => handleNavClick('overview')}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group cursor-pointer ${
            activeView === 'overview' 
              ? 'bg-wine text-white shadow-md font-bold' 
              : 'text-zinc-500 hover:bg-wine-light hover:text-wine font-medium'
          }`}
        >
          <LayoutDashboard size={18} className={activeView === 'overview' ? 'text-white' : 'text-zinc-400 group-hover:text-wine'} />
          <span className="text-xs uppercase tracking-wider">Overview</span>
        </button>

        <button 
          onClick={() => handleNavClick('leads')}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group cursor-pointer ${
            activeView === 'leads' 
              ? 'bg-wine text-white shadow-md font-bold' 
              : 'text-zinc-500 hover:bg-wine-light hover:text-wine font-medium'
          }`}
        >
          <Users size={18} className={activeView === 'leads' ? 'text-white' : 'text-zinc-400 group-hover:text-wine'} />
          <span className="text-xs uppercase tracking-wider">Leads</span>
        </button>

        <button 
          onClick={() => handleNavClick('blog')}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group cursor-pointer ${
            activeView === 'blog' 
              ? 'bg-wine text-white shadow-md font-bold' 
              : 'text-zinc-500 hover:bg-wine-light hover:text-wine font-medium'
          }`}
        >
          <FileText size={18} className={activeView === 'blog' ? 'text-white' : 'text-zinc-400 group-hover:text-wine'} />
          <span className="text-xs uppercase tracking-wider">Blog Studio</span>
        </button>

        <button 
          onClick={() => handleNavClick('website-data')}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group cursor-pointer ${
            activeView === 'website-data' 
              ? 'bg-wine text-white shadow-md font-bold' 
              : 'text-zinc-500 hover:bg-wine-light hover:text-wine font-medium'
          }`}
        >
          <Globe size={18} className={activeView === 'website-data' ? 'text-white' : 'text-zinc-400 group-hover:text-wine'} />
          <span className="text-xs uppercase tracking-wider">Website Data</span>
        </button>

        <button 
          onClick={() => handleNavClick('chatbot-logs')}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group cursor-pointer ${
            activeView === 'chatbot-logs' 
              ? 'bg-wine text-white shadow-md font-bold' 
              : 'text-zinc-500 hover:bg-wine-light hover:text-wine font-medium'
          }`}
        >
          <MessageSquare size={18} className={activeView === 'chatbot-logs' ? 'text-white' : 'text-zinc-400 group-hover:text-wine'} />
          <span className="text-xs uppercase tracking-wider">Chatbot Logs</span>
        </button>

        <button 
          onClick={() => handleNavClick('dograh-call-logs')}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group cursor-pointer ${
            activeView === 'dograh-call-logs' 
              ? 'bg-wine text-white shadow-md font-bold' 
              : 'text-zinc-500 hover:bg-wine-light hover:text-wine font-medium'
          }`}
        >
          <Phone size={18} className={activeView === 'dograh-call-logs' ? 'text-white' : 'text-zinc-400 group-hover:text-wine'} />
          <span className="text-xs uppercase tracking-wider">Voice Agent Logs</span>
        </button>
      </nav>

      <div className="p-4 border-t border-border/60 shrink-0">
        <button 
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 w-full text-zinc-500 rounded-xl hover:bg-red-50 hover:text-red-600 transition-all duration-200 group cursor-pointer"
        >
          <LogOut size={18} className="text-zinc-400 group-hover:text-red-500" />
          <span className="text-xs uppercase tracking-wider font-semibold">Logout</span>
        </button>
      </div>
    </>
  );

  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="flex h-screen bg-white overflow-hidden relative selection:bg-wine/10 selection:text-black">
      {/* Background Ambience */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden" id="app-background-glows">
        <div className="wine-glow w-[800px] h-[800px] -top-[300px] -left-[300px]" />
        <div className="green-glow w-[600px] h-[600px] top-[40%] -right-[200px] opacity-10" />
        <div className="wine-glow w-[900px] h-[900px] -bottom-[400px] left-[10%] opacity-[0.1]" />
      </div>

      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-64 bg-white/70 backdrop-blur-md border-r border-border/60 flex-col shrink-0 relative z-10">
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/30 backdrop-blur-sm transition-opacity" 
            onClick={toggleMobileMenu}
          ></div>
          
          {/* Sliding panel */}
          <aside className="relative w-64 bg-white shadow-2xl h-full flex flex-col transform transition-transform duration-300 relative z-10">
            <button 
              onClick={toggleMobileMenu} 
              className="absolute top-5 right-4 p-2 text-zinc-400 hover:text-zinc-800 bg-zinc-50 rounded-lg hover:bg-zinc-100 transition-colors"
            >
              <X size={18} />
            </button>
            <SidebarContent />
          </aside>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto relative flex flex-col z-10 bg-transparent">
        {/* Mobile Top Bar */}
        <div className="md:hidden flex items-center justify-between bg-white/80 backdrop-blur-md border-b border-border/60 p-4 shrink-0">
          <div className="flex items-center gap-3">
            <img src={logo} alt="Lotlite" className="h-7 object-contain" />
          </div>
          <div className="flex items-center gap-3">
            <div className="flex flex-col items-end text-right mr-1">
              <span className="text-[8px] font-black text-wine uppercase tracking-widest leading-none">Cockpit Panel</span>
              <span className="text-[10px] font-black text-black tracking-widest uppercase mt-1 leading-none">Lotlite Admin</span>
            </div>
            <button 
              onClick={toggleMobileMenu}
              className="p-2 -mr-2 text-zinc-600 hover:bg-zinc-100 rounded-lg transition-colors cursor-pointer"
            >
              <Menu size={20} />
            </button>
          </div>
        </div>

        <div className="flex-1 relative overflow-auto">
          {activeView === 'overview' && <OverviewDashboard />}
          {activeView === 'leads' && <LeadDashboard />}
          {activeView === 'blog' && <BlogGeneration />}
          {activeView === 'website-data' && <WebsiteDataDashboard />}
          {activeView === 'chatbot-logs' && <ChatbotLogsDashboard />}
          {activeView === 'dograh-call-logs' && <DograhCallLogsDashboard />}
        </div>
      </main>
    </div>
  );
}

export default App;

