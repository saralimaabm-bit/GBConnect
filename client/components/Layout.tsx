import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Moon, Sun, Wallet, BarChart3, LogOut, Trophy, TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LayoutProps {
  children: React.ReactNode;
  isAdmin?: boolean;
}

interface BalanceData {
  currentBalance: string;
  earnedToday: string;
  lastUpdate: string;
}

export const Layout: React.FC<LayoutProps> = ({ children, isAdmin = false }) => {
  const [isDark, setIsDark] = useState(() => {
    if (typeof window === 'undefined') return false;
    return localStorage.getItem('theme') === 'dark' || 
           (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches);
  });
  const [activeTab, setActiveTab] = useState<string>(() => {
    const path = window.location.pathname;
    if (path === '/dashboard') return 'dashboard';
    if (path === '/balance') return 'balance';
    if (path === '/ranking') return 'ranking';
    return 'dashboard';
  });
  const [balance, setBalance] = useState<BalanceData | null>(null);
  const [balanceLoading, setBalanceLoading] = useState(true);

  useEffect(() => {
    const html = document.documentElement;
    if (isDark) {
      html.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      html.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);

  useEffect(() => {
    loadBalance();
    // Refresh balance every 10 minutes
    const interval = setInterval(loadBalance, 10 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const loadBalance = async () => {
    try {
      setBalanceLoading(true);
      const token = localStorage.getItem('userToken');
      if (!token) return;

      const response = await fetch(`/api/balance?token=${encodeURIComponent(token)}`);
      if (response.ok) {
        const data = await response.json();
        setBalance(data);
      }
    } catch (err) {
      console.error('Erro ao carregar saldo:', err);
    } finally {
      setBalanceLoading(false);
    }
  };

  const toggleTheme = () => {
    setIsDark(!isDark);
  };

  const handleLogout = () => {
    localStorage.removeItem('userToken');
    window.location.href = '/login';
  };

  if (isAdmin) {
    return (
      <div className="flex h-screen bg-background text-foreground">
        <div className="flex-1 flex flex-col">
          <header className="glass-sm border-b m-4 rounded-2xl px-6 py-4 flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gradient">GBConnect Admin</h1>
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg glass-sm hover:bg-white/20 transition-smooth"
              aria-label="Toggle theme"
            >
              {isDark ? <Sun size={20} /> : <Moon size={20} />}
            </button>
          </header>
          <div className="flex-1 overflow-auto">
            {children}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-transparent text-foreground">
      {/* Sidebar */}
      <div className="w-72 glass-lg border-r flex flex-col m-4 rounded-2xl">
        {/* Logo Section */}
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center shadow-lg">
              <Wallet size={24} className="text-white" />
            </div>
            <div>
              <h1 className="font-bold text-white text-lg">GBConnect</h1>
              <p className="text-xs text-purple-300">Dashboard</p>
            </div>
          </div>
        </div>

        {/* Balance Section */}
        <div className="p-6 border-b border-white/10 space-y-4">
          <div>
            <p className="text-xs font-medium text-purple-300 uppercase tracking-wider mb-2">Saldo Atual</p>
            {balanceLoading ? (
              <div className="h-8 w-32 bg-white/10 rounded animate-pulse" />
            ) : (
              <p className="text-3xl font-bold text-gradient">
                {balance?.currentBalance || 'R$ 0,00'}
              </p>
            )}
          </div>
          <div>
            <p className="text-xs font-medium text-emerald-300 uppercase tracking-wider mb-2">Ganho Hoje</p>
            {balanceLoading ? (
              <div className="h-7 w-28 bg-white/10 rounded animate-pulse" />
            ) : (
              <div className="flex items-center gap-2">
                <p className="text-2xl font-bold text-emerald-400">
                  {balance?.earnedToday || 'R$ 0,00'}
                </p>
                <TrendingUp size={18} className="text-emerald-400" />
              </div>
            )}
          </div>
          <p className="text-xs text-muted-foreground">
            Atualizado a cada 10 minutos
          </p>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          <Link
            to="/dashboard"
            onClick={() => setActiveTab('dashboard')}
            className={cn(
              'flex items-center gap-3 px-4 py-3 rounded-xl transition-smooth font-medium',
              activeTab === 'dashboard'
                ? 'glass bg-gradient-to-r from-purple-500/20 to-purple-600/20 border-purple-400/30 glow-subtle text-white'
                : 'text-sidebar-foreground hover:bg-white/10'
            )}
          >
            <BarChart3 size={18} strokeWidth={1.5} />
            <span>Dashboard</span>
          </Link>

          <Link
            to="/balance"
            onClick={() => setActiveTab('balance')}
            className={cn(
              'flex items-center gap-3 px-4 py-3 rounded-xl transition-smooth font-medium',
              activeTab === 'balance'
                ? 'glass bg-gradient-to-r from-purple-500/20 to-purple-600/20 border-purple-400/30 glow-subtle text-white'
                : 'text-sidebar-foreground hover:bg-white/10'
            )}
          >
            <Wallet size={18} strokeWidth={1.5} />
            <span>Saldo</span>
          </Link>

          <Link
            to="/ranking"
            onClick={() => setActiveTab('ranking')}
            className={cn(
              'flex items-center gap-3 px-4 py-3 rounded-xl transition-smooth font-medium',
              activeTab === 'ranking'
                ? 'glass bg-gradient-to-r from-purple-500/20 to-purple-600/20 border-purple-400/30 glow-subtle text-white'
                : 'text-sidebar-foreground hover:bg-white/10'
            )}
          >
            <Trophy size={18} strokeWidth={1.5} />
            <span>Ranking</span>
          </Link>
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-white/10">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sidebar-foreground hover:bg-white/10 transition-smooth font-medium"
          >
            <LogOut size={18} strokeWidth={1.5} />
            <span>Sair</span>
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        <header className="glass-sm border-b m-4 rounded-2xl px-6 py-4 flex justify-end items-center">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl glass-sm hover:bg-white/20 transition-smooth"
            aria-label="Toggle theme"
          >
            {isDark ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </header>
        <div className="flex-1 overflow-auto">
          {children}
        </div>
      </div>
    </div>
  );
};
