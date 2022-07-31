import * as browserSync from 'browser-sync';
import chalk from 'chalk';
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
  logger.info(`
  ${chalk.inverse(chalk.bold(chalk.green(' NG-NEST ')))}
  ------------------------------------------------------
  🚀🚀🚀 Server available on ${options.ssl ? 'https' : 'http'}://localhost:${bsPort}
  Ready for live refresh
  ------------------------------------------------------
  `);

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
