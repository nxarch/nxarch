import { ExecutorContext, parseTargetString, runExecutor } from '@nx/devkit';
import * as browserSync from 'browser-sync';
import { resolve as pathResolve } from 'path';
import { BSOptions } from '../schema';

export type Executor = AsyncIterableIterator<{ success: boolean }>;

export function getExecutorPromises(
  options: { targetStrings: string[]; watch?: boolean },
  context: ExecutorContext
): Promise<Executor> {
  return Promise.race(
    options.targetStrings.map(async (targetString) => {
      const target = parseTargetString(targetString);
      return runExecutor(target, { watch: options.watch }, context);
    })
  );
}

export function getSslConfig(root: string, options: BSOptions): browserSync.HttpsOptions | undefined | boolean {
  const { ssl, sslCert, sslKey } = options;
  if (ssl && sslCert && sslKey) {
    return {
      key: pathResolve(root, sslKey),
      cert: pathResolve(root, sslCert),
    };
  }

  return ssl;
}

export async function startExecutors(executors: Promise<Executor>) {
  const results = await executors;

  for await (const result of results) {
    if (!result.success) throw new Error(`Target failed.`);
  }
}
