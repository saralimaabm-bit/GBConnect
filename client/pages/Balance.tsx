import React, { useState, useEffect } from 'react';
import { Layout } from '@/components/Layout';
import { DollarSign, RefreshCw, Clock } from 'lucide-react';

interface BalanceData {
  currentBalance: string;
  earnedToday: string;
  lastUpdate: string;
}

export default function Balance() {
  const [balance, setBalance] = useState<BalanceData>({
    currentBalance: 'R$ 0,00',
    earnedToday: 'R$ 0,00',
    lastUpdate: 'Nunca',
  });
  const [loading, setLoading] = useState(false);
  const [autoUpdateCountdown, setAutoUpdateCountdown] = useState(600); // 10 minutes in seconds

  const loadBalance = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('userToken');
      if (!token) {
        console.error('Token não encontrado');
        return;
      }

      const response = await fetch(`/api/balance?token=${encodeURIComponent(token)}`);
      if (response.ok) {
        const data = await response.json();
        setBalance({
          currentBalance: data.currentBalance || 'R$ 0,00',
          earnedToday: data.earnedToday || 'R$ 0,00',
          lastUpdate: new Date().toLocaleString('pt-BR'),
        });
        setAutoUpdateCountdown(600); // Reset countdown
      } else {
        console.error('Erro ao buscar saldo:', response.statusText);
      }
    } catch (err) {
      console.error('Erro ao carregar saldo:', err);
    } finally {
      setLoading(false);
    }
  };

  // Auto-update every 10 minutes
  useEffect(() => {
    loadBalance();
    const interval = setInterval(loadBalance, 600000); // 10 minutes
    return () => clearInterval(interval);
  }, []);

  // Countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      setAutoUpdateCountdown(prev => prev > 0 ? prev - 1 : 600);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatCountdown = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <Layout>
      <div className="p-8 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Saldo</h1>
          <p className="text-muted-foreground">
            Acompanhe seu saldo e ganhos em tempo real
          </p>
        </div>

        {/* Main Balance Card */}
        <div className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground rounded-2xl p-8 mb-8 shadow-xl">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 bg-primary-foreground/20 rounded-lg">
              <DollarSign size={32} />
            </div>
            <div>
              <p className="text-primary-foreground/80 text-sm font-medium">Saldo Atual</p>
              <h2 className="text-5xl font-bold">{balance.currentBalance}</h2>
            </div>
          </div>
        </div>

        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Earned Today */}
          <div className="bg-card border border-border rounded-xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-green-500/10 rounded-lg">
                <TrendingUpIcon size={24} className="text-green-500" />
              </div>
              <h3 className="text-lg font-semibold text-foreground">Ganho Hoje</h3>
            </div>
            <p className="text-4xl font-bold text-green-500 mb-2">
              {balance.earnedToday}
            </p>
            <p className="text-sm text-muted-foreground">
              Ganhos do dia atual
            </p>
          </div>

          {/* Last Update */}
          <div className="bg-card border border-border rounded-xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-blue-500/10 rounded-lg">
                <Clock size={24} className="text-blue-500" />
              </div>
              <h3 className="text-lg font-semibold text-foreground">Última Atualização</h3>
            </div>
            <p className="text-lg font-mono text-blue-500 mb-2">
              {balance.lastUpdate}
            </p>
            <p className="text-sm text-muted-foreground">
              Próxima atualização em {formatCountdown(autoUpdateCountdown)}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4">
          <button
            onClick={loadBalance}
            disabled={loading}
            className="flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:opacity-90 disabled:opacity-50 transition-opacity"
          >
            <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
            {loading ? 'Atualizando...' : 'Atualizar Agora'}
          </button>
        </div>
      </div>
    </Layout>
  );
}

function TrendingUpIcon(props: any) {
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
      <polyline points="23 6 13.5 15.5 8.5 10.5 1 17"></polyline>
      <polyline points="17 6 23 6 23 12"></polyline>
    </svg>
  );
}
