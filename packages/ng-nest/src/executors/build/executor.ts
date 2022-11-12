import { getAvailablePort } from '@nguniversal/builders/src/ssr-dev-server/utils';
import { ExecutorContext } from '@nrwl/devkit';
import { NodeNgSsrExecutorOptions } from './schema';
import { serveTarget } from './serve';
import { removeDir } from './utilities/node.utils';
import { getExecutorPromises, startExecutors } from './utilities/utils';

export default async function runExecutor(options: NodeNgSsrExecutorOptions, context: ExecutorContext) {
  removeDir('dist');

  if (!options.disableBrowserSync) {
    process.env[options.environmentKey] = options.port.toString() || (await getAvailablePort()).toString();
    serveTarget(options, context);
  }

  await new Promise(async (resolve, reject) => {
    const targetStrings = [options.browserTarget, options.ssrTarget, options.serveTarget];
    const executors = getExecutorPromises({ targetStrings, watch: true }, context);
    await startExecutors(executors);
    resolve(true);
  });
}
