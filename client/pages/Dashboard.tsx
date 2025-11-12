import React, { useState, useEffect } from 'react';
import { Layout } from '@/components/Layout';
import { TrendingUp, Users, Zap, DollarSign, Clock, XCircle } from 'lucide-react';

interface MetricCard {
  title: string;
  value: string;
  icon: React.ReactNode;
  color: string;
  lastUpdate?: string;
}

export default function Dashboard() {
  const [metrics, setMetrics] = useState<MetricCard[]>([
    {
      title: 'Saldo Total',
      value: 'R$ 0,00',
      icon: <DollarSign size={32} />,
      color: 'from-blue-500 to-cyan-500',
    },
    {
      title: 'Ganho Hoje',
      value: 'R$ 0,00',
      icon: <TrendingUp size={32} />,
      color: 'from-green-500 to-emerald-500',
    },
    {
      title: 'Contas Hoje',
      value: '0',
      icon: <Users size={32} />,
      color: 'from-purple-500 to-pink-500',
    },
    {
      title: 'Ações Hoje',
      value: '0',
      icon: <Zap size={32} />,
      color: 'from-orange-500 to-red-500',
    },
    {
      title: 'Ações Total',
      value: '0',
      icon: <Clock size={32} />,
      color: 'from-indigo-500 to-blue-500',
    },
    {
      title: 'Contas Desativadas',
      value: '0',
      icon: <XCircle size={32} />,
      color: 'from-red-500 to-rose-500',
    },
  ]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMetrics();
  }, []);

  const loadMetrics = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('userToken');
      if (!token) {
        console.error('Token não encontrado');
        return;
      }

      const response = await fetch(`/api/dashboard/metrics?token=${encodeURIComponent(token)}`);
      if (response.ok) {
        const data = await response.json();
        setMetrics(prev =>
          prev.map(metric => ({
            ...metric,
            value: data[metric.title] || metric.value,
            lastUpdate: new Date().toLocaleString('pt-BR'),
          }))
        );
      } else {
        console.error('Erro ao buscar métricas:', response.statusText);
      }
    } catch (err) {
      console.error('Erro ao carregar métricas:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Dashboard</h1>
          <p className="text-muted-foreground">
            Visão geral do seu desempenho e métricas
          </p>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
          {metrics.map((metric, index) => (
            <div
              key={index}
              className={`bg-gradient-to-br ${metric.color} rounded-xl p-6 text-white shadow-lg hover:shadow-xl transition-shadow`}
            >
              <div className="flex justify-between items-start mb-4">
                <div className="opacity-80">{metric.icon}</div>
              </div>
              <p className="text-white/80 text-sm font-medium mb-1">{metric.title}</p>
              <p className="text-3xl font-bold">{metric.value}</p>
              {metric.lastUpdate && (
                <p className="text-xs text-white/60 mt-2">
                  Atualizado às {metric.lastUpdate}
                </p>
              )}
            </div>
          ))}
        </div>

        {/* Loading State */}
        {loading && (
          <div className="mt-8 text-center text-muted-foreground">
            Carregando métricas...
          </div>
        )}
      </div>
    </Layout>
  );
}
