import React, { useState, useEffect } from 'react';
import { Layout } from '@/components/Layout';
import { Trophy, TrendingUp } from 'lucide-react';

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

  const getMedalColor = (position: number): string => {
    switch (position) {
      case 1:
        return 'from-yellow-500/30 to-yellow-600/20 border-yellow-400/30';
      case 2:
        return 'from-slate-400/30 to-slate-500/20 border-slate-400/30';
      case 3:
        return 'from-orange-500/30 to-orange-600/20 border-orange-400/30';
      default:
        return 'from-purple-500/20 to-purple-600/20 border-purple-400/30';
    }
  };

  const getMedalEmoji = (position: number): string => {
    switch (position) {
      case 1:
        return '🥇';
      case 2:
        return '🥈';
      case 3:
        return '🥉';
      default:
        return '';
    }
  };

  const getMedalIcon = (position: number) => {
    switch (position) {
      case 1:
        return (
          <div className="relative w-14 h-14 flex items-center justify-center">
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 opacity-30 blur-lg" />
            <div className="relative text-3xl">🥇</div>
          </div>
        );
      case 2:
        return (
          <div className="relative w-14 h-14 flex items-center justify-center">
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-slate-300 to-slate-500 opacity-30 blur-lg" />
            <div className="relative text-3xl">🥈</div>
          </div>
        );
      case 3:
        return (
          <div className="relative w-14 h-14 flex items-center justify-center">
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 opacity-30 blur-lg" />
            <div className="relative text-3xl">🥉</div>
          </div>
        );
      default:
        return (
          <div className="w-14 h-14 rounded-xl flex items-center justify-center glass bg-white/10 border border-white/20">
            <span className="text-lg font-bold text-white">{position}</span>
          </div>
        );
    }
  };

  return (
    <Layout>
      <div className="p-8 max-w-6xl">
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center gap-4 mb-4">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-500 to-yellow-600 opacity-20 blur-2xl rounded-full" />
              <Trophy size={48} className="relative text-yellow-400" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-white">Ranking Top 5</h1>
              <p className="text-muted-foreground mt-2">
                Melhores usuários por ações realizadas hoje
              </p>
            </div>
          </div>
        </div>

        {/* Ranking List */}
        {loading ? (
          <div className="text-center py-16">
            <div className="inline-block">
              <div className="w-12 h-12 border-2 border-white/20 border-t-purple-500 rounded-full animate-spin" />
            </div>
            <p className="text-muted-foreground mt-4">Carregando ranking...</p>
          </div>
        ) : ranking.length === 0 ? (
          <div className="glass-lg p-12 text-center">
            <Trophy size={48} className="text-muted-foreground mx-auto mb-4 opacity-50" />
            <p className="text-muted-foreground text-lg">Nenhum usuário encontrado</p>
          </div>
        ) : (
          <div className="space-y-4">
            {ranking.map((user, index) => (
              <div
                key={user.position}
                className={`glass bg-gradient-to-r ${getMedalColor(user.position)} group transition-smooth relative overflow-hidden`}
              >
                {/* Gradient accent on top */}
                {user.position <= 3 && (
                  <div
                    className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r"
                    style={{
                      backgroundImage:
                        user.position === 1
                          ? 'linear-gradient(90deg, #fbbf24, #f59e0b)'
                          : user.position === 2
                            ? 'linear-gradient(90deg, #cbd5e1, #94a3b8)'
                            : 'linear-gradient(90deg, #fb923c, #f97316)',
                    }}
                  />
                )}

                <div className="p-6 flex items-center gap-6">
                  {/* Medal Position */}
                  <div className="flex-shrink-0">
                    {getMedalIcon(user.position)}
                  </div>

                  {/* User Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-bold text-white truncate">
                        {user.usuario}
                      </h3>
                      {user.position <= 3 && (
                        <span
                          className="text-xs font-bold px-3 py-1 rounded-full flex-shrink-0"
                          style={{
                            backgroundColor:
                              user.position === 1
                                ? 'rgba(251, 191, 36, 0.15)'
                                : user.position === 2
                                  ? 'rgba(203, 213, 225, 0.15)'
                                  : 'rgba(251, 146, 60, 0.15)',
                            color:
                              user.position === 1
                                ? '#fbbf24'
                                : user.position === 2
                                  ? '#cbd5e1'
                                  : '#fb923c',
                            border: `1px solid ${
                              user.position === 1
                                ? 'rgba(251, 191, 36, 0.3)'
                                : user.position === 2
                                  ? 'rgba(203, 213, 225, 0.3)'
                                  : 'rgba(251, 146, 60, 0.3)'
                            }`,
                          }}
                        >
                          #{user.position}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Posição no ranking dos melhores desempenhos
                    </p>
                  </div>

                  {/* Stats */}
                  <div className="flex items-center gap-8 flex-shrink-0">
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground mb-2">
                        Ações Hoje
                      </p>
                      <div className="flex items-center gap-2">
                        <p className="text-2xl font-bold text-white">
                          {user.acoeshoje}
                        </p>
                        <TrendingUp size={18} className="text-emerald-400" />
                      </div>
                    </div>
                    <div className="h-12 w-px bg-gradient-to-b from-white/0 via-white/20 to-white/0" />
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground mb-2">
                        Ganho Hoje
                      </p>
                      <p className="text-2xl font-bold text-emerald-400">
                        {user.ganhoHoje}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Podium Section */}
        {!loading && ranking.length > 0 && (
          <div className="mt-16 pt-12 border-t border-white/10">
            <h2 className="text-2xl font-bold text-white mb-8">Pódio</h2>
            <div className="grid grid-cols-3 gap-4 md:gap-6 max-w-2xl mx-auto">
              {/* Second Place (Left) */}
              {ranking[1] && (
                <div className="glass bg-gradient-to-br from-slate-400/20 to-slate-500/20 border-slate-400/30 rounded-2xl p-6 text-center flex flex-col items-center justify-center">
                  <div className="text-4xl mb-3">🥈</div>
                  <p className="text-sm font-bold text-white mb-1 truncate">
                    {ranking[1].usuario}
                  </p>
                  <p className="text-xs text-muted-foreground mb-3">
                    {ranking[1].acoeshoje} ações
                  </p>
                  <p className="text-sm font-bold text-slate-300">
                    {ranking[1].ganhoHoje}
                  </p>
                </div>
              )}

              {/* First Place (Center) */}
              {ranking[0] && (
                <div className="glass bg-gradient-to-br from-yellow-400/20 to-yellow-600/20 border-yellow-400/40 rounded-2xl p-6 text-center flex flex-col items-center justify-center scale-105">
                  <div className="absolute -top-6 left-1/2 transform -translate-x-1/2">
                    <div className="text-5xl animate-bounce">🥇</div>
                  </div>
                  <p className="text-sm font-bold text-white mb-1 mt-4 truncate">
                    {ranking[0].usuario}
                  </p>
                  <p className="text-xs text-muted-foreground mb-3">
                    {ranking[0].acoeshoje} ações
                  </p>
                  <p className="text-sm font-bold text-yellow-300">
                    {ranking[0].ganhoHoje}
                  </p>
                </div>
              )}

              {/* Third Place (Right) */}
              {ranking[2] && (
                <div className="glass bg-gradient-to-br from-orange-400/20 to-orange-600/20 border-orange-400/30 rounded-2xl p-6 text-center flex flex-col items-center justify-center">
                  <div className="text-4xl mb-3">🥉</div>
                  <p className="text-sm font-bold text-white mb-1 truncate">
                    {ranking[2].usuario}
                  </p>
                  <p className="text-xs text-muted-foreground mb-3">
                    {ranking[2].acoeshoje} ações
                  </p>
                  <p className="text-sm font-bold text-orange-300">
                    {ranking[2].ganhoHoje}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
