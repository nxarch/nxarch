import { getAvailablePort } from '@nguniversal/builders/src/ssr-dev-server/utils';
import { ExecutorContext } from '@nrwl/devkit';
import { BSOptions, NodeNgSsrExecutorOptions } from './schema';
import { serveTarget } from './serve';
import { getExecutorPromises, removeDir, startExecutors } from './utilities/utils';

const BS_DEFAULT_OPTIONS: BSOptions = {
  port: 4200,
  host: 'localhost',
  openBrowser: true,
  serverAutoSync: true,
};

export default async function runExecutor(options: NodeNgSsrExecutorOptions, context: ExecutorContext) {
  options = { ...BS_DEFAULT_OPTIONS, ...options };

  removeDir('dist');

  if (!options.disableBrowserSync) {
    process.env.PORT = (await getAvailablePort()).toString();
    serveTarget(options, context);
  }

  await new Promise(async (resolve, reject) => {
    const targetStrings = [options.browserTarget, options.ssrTarget, options.serveTarget];
    const executors = getExecutorPromises({ targetStrings, watch: true }, context);
    await startExecutors(executors);
    resolve(true);
  });
}
