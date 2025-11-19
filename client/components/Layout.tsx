import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Moon, Sun, Wallet, BarChart3, LogOut, Trophy } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LayoutProps {
  children: React.ReactNode;
  isAdmin?: boolean;
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
          <header className="bg-card border-b border-border px-6 py-4 flex justify-between items-center">
            <h1 className="text-2xl font-bold text-primary">GBConnect Admin</h1>
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-secondary hover:bg-accent transition-colors"
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
    <div className="flex h-screen bg-background text-foreground">
      {/* Sidebar */}
      <div className="w-64 bg-sidebar border-r border-sidebar-border flex flex-col">
        <div className="p-6 border-b border-sidebar-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-sidebar-primary rounded-lg flex items-center justify-center">
              <Wallet size={24} className="text-sidebar-primary-foreground" />
            </div>
            <div>
              <h1 className="font-bold text-sidebar-primary-foreground">GBConnect</h1>
              <p className="text-xs text-sidebar-accent-foreground">Dashboard</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          <Link
            to="/dashboard"
            onClick={() => setActiveTab('dashboard')}
            className={cn(
              'flex items-center gap-3 px-4 py-3 rounded-lg transition-colors',
              activeTab === 'dashboard'
                ? 'bg-sidebar-primary text-sidebar-primary-foreground'
                : 'text-sidebar-foreground hover:bg-sidebar-accent'
            )}
          >
            <BarChart3 size={20} />
            <span className="font-medium">Dashboard</span>
          </Link>

          <Link
            to="/balance"
            onClick={() => setActiveTab('balance')}
            className={cn(
              'flex items-center gap-3 px-4 py-3 rounded-lg transition-colors',
              activeTab === 'balance'
                ? 'bg-sidebar-primary text-sidebar-primary-foreground'
                : 'text-sidebar-foreground hover:bg-sidebar-accent'
            )}
          >
            <Wallet size={20} />
            <span className="font-medium">Saldo</span>
          </Link>

          <Link
            to="/ranking"
            onClick={() => setActiveTab('ranking')}
            className={cn(
              'flex items-center gap-3 px-4 py-3 rounded-lg transition-colors',
              activeTab === 'ranking'
                ? 'bg-sidebar-primary text-sidebar-primary-foreground'
                : 'text-sidebar-foreground hover:bg-sidebar-accent'
            )}
          >
            <Trophy size={20} />
            <span className="font-medium">Ranking</span>
          </Link>
        </nav>

        <div className="p-4 border-t border-sidebar-border">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sidebar-foreground hover:bg-sidebar-accent transition-colors"
          >
            <LogOut size={20} />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        <header className="bg-card border-b border-border px-6 py-4 flex justify-end items-center">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg bg-secondary hover:bg-accent transition-colors"
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
