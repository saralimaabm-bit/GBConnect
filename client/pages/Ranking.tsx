import React, { useState, useEffect } from 'react';
import { Layout } from '@/components/Layout';
import { Trophy, Medal } from 'lucide-react';

interface RankingUser {
  position: number;
  usuario: string;
  acoeshoje: string | number;
  ganhoHoje: string;
}

export default function Ranking() {
  const [ranking, setRanking] = useState<RankingUser[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRanking();
  }, []);

  const loadRanking = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/ranking');
      if (response.ok) {
        const data = await response.json();
        setRanking(data);
      } else {
        console.error('Erro ao buscar ranking:', response.statusText);
      }
    } catch (err) {
      console.error('Erro ao carregar ranking:', err);
    } finally {
      setLoading(false);
    }
  };

  const getMedalIcon = (position: number) => {
    switch (position) {
      case 1:
        return (
          <div className="flex items-center justify-center w-12 h-12 rounded-full bg-yellow-400 text-yellow-700 font-bold text-lg shadow-lg">
            🥇
          </div>
        );
      case 2:
        return (
          <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gray-300 text-gray-700 font-bold text-lg shadow-lg">
            🥈
          </div>
        );
      case 3:
        return (
          <div className="flex items-center justify-center w-12 h-12 rounded-full bg-orange-400 text-orange-700 font-bold text-lg shadow-lg">
            🥉
          </div>
        );
      default:
        return (
          <div className="flex items-center justify-center w-12 h-12 rounded-full bg-slate-300 text-slate-700 font-bold text-lg">
            {position}
          </div>
        );
    }
  };

  return (
    <Layout>
      <div className="p-8 max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Trophy size={40} className="text-yellow-500" />
            <div>
              <h1 className="text-4xl font-bold text-foreground">Ranking Top 5</h1>
              <p className="text-muted-foreground">
                Melhores usuários por ações realizadas hoje
              </p>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="text-center text-muted-foreground py-12">
            Carregando ranking...
          </div>
        ) : ranking.length === 0 ? (
          <div className="text-center text-muted-foreground py-12">
            Nenhum usuário encontrado
          </div>
        ) : (
          <div className="space-y-4">
            {ranking.map((user) => (
              <div
                key={user.position}
                className={`flex items-center gap-6 p-6 rounded-xl border transition-all ${
                  user.position <= 3
                    ? 'bg-gradient-to-r border-yellow-300 shadow-lg'
                    : 'bg-card border-border'
                } hover:shadow-lg`}
                style={
                  user.position <= 3
                    ? {
                        backgroundImage:
                          user.position === 1
                            ? 'linear-gradient(135deg, rgba(250, 204, 21, 0.1) 0%, rgba(250, 204, 21, 0.05) 100%)'
                            : user.position === 2
                              ? 'linear-gradient(135deg, rgba(209, 213, 219, 0.1) 0%, rgba(209, 213, 219, 0.05) 100%)'
                              : 'linear-gradient(135deg, rgba(251, 146, 60, 0.1) 0%, rgba(251, 146, 60, 0.05) 100%)',
                      }
                    : {}
                }
              >
                {/* Medal/Position */}
                <div className="flex-shrink-0">
                  {getMedalIcon(user.position)}
                </div>

                {/* User Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-bold text-foreground">
                      {user.usuario}
                    </h3>
                    {user.position <= 3 && (
                      <span className="text-sm font-semibold text-yellow-600 dark:text-yellow-400 px-3 py-1 rounded-full bg-yellow-100 dark:bg-yellow-900/30">
                        Top {user.position}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Usuário #{user.position}
                  </p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-6 flex-shrink-0">
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground mb-1">
                      Ações Hoje
                    </p>
                    <p className="text-2xl font-bold text-primary">
                      {user.acoeshoje}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground mb-1">
                      Ganho Hoje
                    </p>
                    <p className="text-2xl font-bold text-green-500">
                      R$ {user.ganhoHoje}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Podium Decoration */}
        {ranking.length > 0 && (
          <div className="mt-12 pt-8 border-t border-border">
            <div className="grid grid-cols-3 gap-4 max-w-md">
              {ranking.slice(0, 3).map((user, index) => (
                <div key={index} className="text-center">
                  <div className="text-4xl mb-2">
                    {index === 0
                      ? '🥇'
                      : index === 1
                        ? '🥈'
                        : '🥉'}
                  </div>
                  <p className="text-sm font-semibold text-foreground">
                    {user.usuario}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {user.acoeshoje} ações
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
