import { useState } from 'react';
import { Lock, Mail, ArrowRight } from 'lucide-react';
import logo from '../assets/Lotlite_Logo.png';

interface LoginProps {
  onLogin: () => void;
}

const Login = ({ onLogin }: LoginProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || ''}/api/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();
      
      if (data.success) {
        localStorage.setItem('lotlite_admin_token', data.token);
        onLogin();
      } else {
        setError(data.message || 'Invalid email or password');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('Server error. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-white relative overflow-hidden selection:bg-wine/10 selection:text-black">
      {/* Background Ambience */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden" id="login-background-glows">
        <div className="wine-glow w-[800px] h-[800px] -top-[200px] -left-[200px]" />
        <div className="green-glow w-[600px] h-[600px] bottom-[10%] -right-[100px] opacity-10" />
      </div>

      <div className="relative z-10 w-full max-w-md px-6">
        <div className="glass-card p-10 flex flex-col items-center">
          <div className="mb-8 flex flex-col items-center">
            <div className="w-16 h-16 bg-white rounded-2xl shadow-sm border border-border flex items-center justify-center mb-6">
              <img src={logo} alt="Lotlite Logo" className="w-10 object-contain" />
            </div>
            <h1 className="text-2xl font-black text-black tracking-tight text-center">
              Welcome Back
            </h1>
            <p className="text-sm text-zinc-500 mt-2 text-center font-medium">
              Enter your credentials to access the cockpit
            </p>
          </div>

          <form onSubmit={handleSubmit} className="w-full space-y-5">
            {error && (
              <div className="p-3 text-xs font-semibold text-red-600 bg-red-50 border border-red-100 rounded-xl text-center">
                {error}
              </div>
            )}

            <div className="space-y-4">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail size={18} className="text-zinc-400" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-11 pr-4 py-3.5 bg-input border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-wine/20 focus:border-wine transition-all"
                  placeholder="Email address"
                  required
                />
              </div>

              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock size={18} className="text-zinc-400" />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-11 pr-4 py-3.5 bg-input border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-wine/20 focus:border-wine transition-all"
                  placeholder="Password"
                  required
                />
              </div>
            </div>

            <div className="flex items-center mt-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 rounded border-border text-wine focus:ring-wine/20" />
                <span className="text-xs text-zinc-500 font-medium">Remember me</span>
              </label>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full mt-6 bg-wine text-white py-3.5 rounded-xl text-sm font-bold shadow-md hover:bg-wine-hover hover:shadow-lg transition-all flex items-center justify-center gap-2 group ${isLoading ? 'opacity-70 cursor-not-allowed' : 'cursor-pointer'}`}
            >
              {isLoading ? 'Signing In...' : 'Sign In'}
              {!isLoading && <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-border/60 w-full text-center">
            <p className="text-[10px] uppercase tracking-widest text-zinc-400 font-semibold">
              Lotlite Admin Cockpit
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
