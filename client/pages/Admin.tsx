import React, { useState, useEffect } from 'react';
import { Layout } from '@/components/Layout';
import { Save, AlertCircle } from 'lucide-react';

interface AdminConfig {
  mysqlHost: string;
  mysqlPort: string;
  mysqlUsername: string;
  mysqlDbName: string;
  mysqlPassword: string;
  balanceTable: string;
  balanceColumnName: string;
  earnedTodayTable: string;
  earnedTodayColumnName: string;
  accountsTodayTable: string;
  accountsTodayColumnName: string;
  actionsTodayTable: string;
  actionsTodayColumnName: string;
  actionsTotalTable: string;
  actionsTotalColumnName: string;
}

const DEFAULT_CONFIG: AdminConfig = {
  mysqlHost: 'localhost',
  mysqlPort: '3306',
  mysqlUsername: 'root',
  mysqlDbName: '',
  mysqlPassword: '',
  balanceTable: '',
  balanceColumnName: '',
  earnedTodayTable: '',
  earnedTodayColumnName: '',
  accountsTodayTable: '',
  accountsTodayColumnName: '',
  actionsTodayTable: '',
  actionsTodayColumnName: '',
  actionsTotalTable: '',
  actionsTotalColumnName: '',
};

export default function Admin() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [config, setConfig] = useState<AdminConfig>(DEFAULT_CONFIG);
  const [saved, setSaved] = useState(false);
  const [saveError, setSaveError] = useState('');

  // Check if already authenticated
  useEffect(() => {
    const auth = localStorage.getItem('adminAuth');
    if (auth === 'true') {
      setIsAuthenticated(true);
      loadConfig();
    }
  }, []);

  const loadConfig = async () => {
    try {
      const response = await fetch('/api/admin/config');
      if (response.ok) {
        const data = await response.json();
        setConfig({ ...DEFAULT_CONFIG, ...data });
      }
    } catch (err) {
      console.error('Erro ao carregar configuração:', err);
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');

    if (username === 'gabriel' && password === 'g7power@') {
      setIsAuthenticated(true);
      localStorage.setItem('adminAuth', 'true');
      loadConfig();
    } else {
      setLoginError('Usuário ou senha inválidos');
    }
  };

  const handleConfigChange = (field: keyof AdminConfig, value: string) => {
    setConfig(prev => ({ ...prev, [field]: value }));
  };

  const handleSaveConfig = async () => {
    setSaveError('');
    setSaved(false);

    try {
      const response = await fetch('/api/admin/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config),
      });

      if (response.ok) {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      } else {
        setSaveError('Erro ao salvar configuração');
      }
    } catch (err) {
      setSaveError('Erro ao salvar configuração');
      console.error(err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminAuth');
    setIsAuthenticated(false);
    setUsername('');
    setPassword('');
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-card rounded-2xl shadow-2xl p-8">
          <h1 className="text-3xl font-bold text-center mb-8 text-foreground">
            Admin Panel
          </h1>

          <form onSubmit={handleLogin} className="space-y-6">
            {loginError && (
              <div className="p-4 bg-destructive/10 border border-destructive rounded-lg text-destructive text-sm flex gap-2">
                <AlertCircle size={18} className="flex-shrink-0 mt-0.5" />
                {loginError}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Usuário
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="gabriel"
                className="w-full px-4 py-3 rounded-lg border border-border bg-input text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Senha
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 rounded-lg border border-border bg-input text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:opacity-90 transition-opacity"
            >
              Entrar
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <Layout isAdmin>
      <div className="p-8 max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold text-foreground mb-2">
              Configuração do Sistema
            </h2>
            <p className="text-muted-foreground">
              Configure a conexão com MySQL e os mapeamentos de tabelas
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="px-4 py-2 text-sm font-medium text-foreground bg-secondary hover:bg-accent rounded-lg transition-colors"
          >
            Logout
          </button>
        </div>

        {/* Success/Error Messages */}
        {saved && (
          <div className="mb-6 p-4 bg-green-500/10 border border-green-500 text-green-700 dark:text-green-400 rounded-lg">
            ✓ Configuração salva com sucesso!
          </div>
        )}
        {saveError && (
          <div className="mb-6 p-4 bg-destructive/10 border border-destructive text-destructive rounded-lg flex gap-2">
            <AlertCircle size={18} className="flex-shrink-0 mt-0.5" />
            {saveError}
          </div>
        )}

        {/* Configuration Form */}
        <div className="space-y-8">
          {/* MySQL Connection */}
          <div className="bg-card border border-border rounded-lg p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">
              Conexão MySQL
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Host
                </label>
                <input
                  type="text"
                  value={config.mysqlHost}
                  onChange={(e) => handleConfigChange('mysqlHost', e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-border bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Porta
                </label>
                <input
                  type="text"
                  value={config.mysqlPort}
                  onChange={(e) => handleConfigChange('mysqlPort', e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-border bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Usuário MySQL
                </label>
                <input
                  type="text"
                  value={config.mysqlUsername}
                  onChange={(e) => handleConfigChange('mysqlUsername', e.target.value)}
                  placeholder="root"
                  className="w-full px-4 py-2 rounded-lg border border-border bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Nome do Banco de Dados
                </label>
                <input
                  type="text"
                  value={config.mysqlDbName}
                  onChange={(e) => handleConfigChange('mysqlDbName', e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-border bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Senha
                </label>
                <input
                  type="password"
                  value={config.mysqlPassword}
                  onChange={(e) => handleConfigChange('mysqlPassword', e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-border bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>
          </div>

          {/* Table Mappings */}
          <div className="bg-card border border-border rounded-lg p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">
              Mapeamento de Tabelas
            </h3>
            <div className="space-y-4">
              {[
                { label: 'Saldo Total', table: 'balanceTable', column: 'balanceColumnName' },
                { label: 'Ganho Hoje', table: 'earnedTodayTable', column: 'earnedTodayColumnName' },
                { label: 'Contas Hoje', table: 'accountsTodayTable', column: 'accountsTodayColumnName' },
                { label: 'Ações Hoje', table: 'actionsTodayTable', column: 'actionsTodayColumnName' },
                { label: 'Ações Total', table: 'actionsTotalTable', column: 'actionsTotalColumnName' },
              ].map(({ label, table, column }) => (
                <div key={table} className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      {label} - Tabela
                    </label>
                    <input
                      type="text"
                      value={config[table as keyof AdminConfig] as string}
                      onChange={(e) => handleConfigChange(table as keyof AdminConfig, e.target.value)}
                      placeholder="Nome da tabela"
                      className="w-full px-4 py-2 rounded-lg border border-border bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      {label} - Coluna
                    </label>
                    <input
                      type="text"
                      value={config[column as keyof AdminConfig] as string}
                      onChange={(e) => handleConfigChange(column as keyof AdminConfig, e.target.value)}
                      placeholder="Nome da coluna"
                      className="w-full px-4 py-2 rounded-lg border border-border bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-end">
            <button
              onClick={handleSaveConfig}
              className="flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:opacity-90 transition-opacity"
            >
              <Save size={20} />
              Salvar Configuração
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
}
