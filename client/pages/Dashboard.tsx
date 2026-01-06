import React, { useState, useEffect } from 'react';
import { Layout } from '@/components/Layout';
import { TrendingUp, DollarSign, Zap, Activity } from 'lucide-react';

interface MetricCard {
  title: string;
  value: string;
  rawValue: number;
  icon: React.ReactNode;
  iconColor: string;
  accentColor: string;
  growth?: string;
  growthTrend?: 'up' | 'down';
}

export default function Dashboard() {
  const [metrics, setMetrics] = useState<MetricCard[]>([
    {
      title: 'Saldo Total',
      value: 'R$ 0,00',
      rawValue: 0,
      icon: <DollarSign size={24} />,
      iconColor: 'text-blue-400',
      accentColor: 'from-blue-500/20 to-blue-600/20 border-blue-400/30',
    },
    {
      title: 'Ganho Hoje',
      value: 'R$ 0,00',
      rawValue: 0,
      icon: <TrendingUp size={24} />,
      iconColor: 'text-emerald-400',
      accentColor: 'from-emerald-500/20 to-emerald-600/20 border-emerald-400/30',
      growth: '+5.2%',
      growthTrend: 'up',
    },
    {
      title: 'Ações Hoje',
      value: '0',
      rawValue: 0,
      icon: <Zap size={24} />,
      iconColor: 'text-purple-400',
      accentColor: 'from-purple-500/20 to-purple-600/20 border-purple-400/30',
      growth: '+12.5%',
      growthTrend: 'up',
    },
    {
      title: 'Ações Total',
      value: '0',
      rawValue: 0,
      icon: <Activity size={24} />,
      iconColor: 'text-indigo-400',
      accentColor: 'from-indigo-500/20 to-indigo-600/20 border-indigo-400/30',
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
          prev.map(metric => {
            let newValue = metric.value;
            let rawValue = 0;

            switch (metric.title) {
              case 'Saldo Total':
                newValue = data['Saldo Total'] || metric.value;
                break;
              case 'Ganho Hoje':
                newValue = data['Ganho Hoje'] || metric.value;
                break;
              case 'Ações Hoje':
                newValue = data['Ações Hoje'] || metric.value;
                rawValue = parseInt(String(data['Ações Hoje']).replace(/\D/g, '')) || 0;
                break;
              case 'Ações Total':
                newValue = data['Ações Total'] || metric.value;
                rawValue = parseInt(String(data['Ações Total']).replace(/\D/g, '')) || 0;
                break;
            }

            return { ...metric, value: newValue, rawValue };
          })
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
      <div className="p-8 max-w-7xl">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-white mb-3">Dashboard</h1>
          <p className="text-muted-foreground text-lg">
            Visão geral do seu desempenho e métricas
          </p>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {metrics.map((metric, index) => (
            <div
              key={index}
              className={`glass bg-gradient-to-br ${metric.accentColor} overflow-hidden group transition-smooth`}
            >
              {/* Card Content */}
              <div className="p-6 space-y-6">
                {/* Icon and Title */}
                <div className="flex items-start justify-between">
                  <div className={`p-3 rounded-lg bg-white/10 ${metric.iconColor}`}>
                    {metric.icon}
                  </div>
                  {metric.growth && (
                    <div className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-500/20 border border-emerald-400/30">
                      <TrendingUp size={14} className="text-emerald-400" />
                      <span className="text-xs font-semibold text-emerald-400">
                        {metric.growth}
                      </span>
                    </div>
                  )}
                </div>

                {/* Metric Title and Value */}
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-2">
                    {metric.title}
                  </p>
                  <p className="text-3xl font-bold text-white break-words">
                    {metric.value}
                  </p>
                </div>

                {/* Divider line */}
                <div className="h-px bg-gradient-to-r from-white/0 via-white/20 to-white/0" />

                {/* Status */}
                <div className="text-xs text-muted-foreground">
                  {loading ? 'Carregando...' : 'Atualizado'}
                </div>
              </div>

              {/* Gradient overlay on hover */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-10 bg-gradient-to-br from-white/20 transition-opacity" />
            </div>
          ))}
        </div>

        {/* Additional Info Section */}
        <div className="mt-12">
          <div className="glass-lg p-8">
            <h2 className="text-xl font-bold text-white mb-4">Informações</h2>
            <p className="text-muted-foreground">
              Suas métricas são atualizadas em tempo real. Os dados de ganho diário são calculados 
			  multiplicando o número de ações feitas hoje pelo valor de cada ação.
            </p>
            <p className="text-xs text-muted-foreground mt-4">
              Última atualização: {new Date().toLocaleString('pt-BR')}
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
}
