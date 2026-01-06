// In-memory storage for admin config (shared across routes)
export interface AdminConfig {
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

let adminConfig: AdminConfig = {
  mysqlHost: '193.203.175.110',
  mysqlPort: '3306',
  mysqlUsername: 'u740618622_gbconnect',
  mysqlDbName: 'u740618622_gbconnect',
  mysqlPassword: 'LmaW!1a|Ql3',
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

export function getConfig(): AdminConfig {
  return { ...adminConfig };
}

export function updateConfig(newConfig: Partial<AdminConfig>): void {
  adminConfig = { ...adminConfig, ...newConfig };
}
