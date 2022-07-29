export interface NodeNgSsrExecutorOptions extends BSOptions {
  browserTarget: string;
  ssrTarget: string;
  serveTarget: string;
}

export interface BSOptions {
  host?: string;
  ssl?: boolean;
  sslKey?: string;
  sslCert?: string;
  proxyConfig?: string;
  port?: number;
  openBrowser?: boolean;
  browsers?: string[];
  serverAutoSync?: boolean;
  disableBrowserSync?: boolean;
}
