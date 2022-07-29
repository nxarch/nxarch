import * as browserSync from 'browser-sync';
import { logger } from 'nx/src/utils/logger';
import { workspaceRoot } from 'nx/src/utils/workspace-root';
import { BSOptions } from './schema';
import { getSslConfig } from './utilities/utils';

export async function initBrowserSync(
  browserSyncInstance: browserSync.BrowserSyncInstance,
  nodeServerPort: number,
  options: BSOptions
): Promise<browserSync.BrowserSyncInstance> {
  if (browserSyncInstance.active) return browserSyncInstance;

  const bsPort = options.port;
  logger.log('Server available on', `http://localhost:${bsPort}`);

  const bsOptions: browserSync.Options = {
    proxy: {
      target: `localhost:${nodeServerPort}`,
      proxyOptions: {
        xfwd: true,
      },
      ws: true,
      proxyRes: [
        (proxyRes) => {
          if ('headers' in proxyRes) {
            proxyRes.headers['cache-control'] = undefined;
          }
        },
      ],
      // proxyOptions is not in the typings
    } as browserSync.ProxyOptions & { proxyOptions: { xfwd: boolean } },
    cors: true,
    host: 'localhost',
    port: bsPort,
    ui: false,
    server: false,
    notify: false,
    ghostMode: false,
    logLevel: 'silent',
    open: options.openBrowser,
    browser: options.browsers,
    https: getSslConfig(workspaceRoot, options),
  };

  return new Promise((resolve, reject) => {
    browserSyncInstance.init(bsOptions, (error, bs) => {
      if (error) {
        reject(error);
      } else {
        resolve(bs);
      }
    });
  });
}
