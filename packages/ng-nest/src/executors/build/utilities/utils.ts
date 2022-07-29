import { ExecutorContext, parseTargetString, runExecutor } from '@nrwl/devkit';
import * as browserSync from 'browser-sync';
import fs from 'fs';
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

export function removeDir(path: string) {
  if (fs.existsSync(path)) {
    fs.rmSync(path, { recursive: true });
  }
}

export function writeFile(path: string, content: string | number | Record<PropertyKey, unknown> | boolean) {
  try {
    content = JSON.stringify(content);
    return fs.writeFileSync(path, content);
  } catch (err) {
    // console.log(err);
  }
}

export function readFile(path: string) {
  try {
    return JSON.parse(fs.readFileSync(path, 'utf8'));
  } catch (err) {
    // console.log(err);
  }
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
