export interface NodeNgSsrExecutorOptions extends BSOptions {
  browserTarget: string;
  ssrTarget: string;
  serveTarget: string;
  port: number;
  environmentKey: string;
}

export interface BSOptions {
  host?: string;
  ssl?: boolean;
  sslKey?: string;
  sslCert?: string;
  proxyConfig?: string;
  browserSyncPort?: number;
  openBrowser?: boolean;
  browsers?: string[];
  serverAutoSync?: boolean;
  disableBrowserSync?: boolean;
}
