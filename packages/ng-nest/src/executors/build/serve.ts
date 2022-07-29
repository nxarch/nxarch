import { parseTargetString, readTargetOptions } from '@nrwl/devkit';
import browserSync from 'browser-sync';
import chokidar from 'chokidar';
import waitOn from 'wait-on';
import { initBrowserSync } from './init-browser-sync';
import { BSOptions, NodeNgSsrExecutorOptions } from './schema';

let uiTargetOptions: Record<PropertyKey, unknown>;
let ssrTargetOptions: Record<PropertyKey, unknown>;
let serveTargetOptions: Record<PropertyKey, unknown>;
let serverTargetOptions: Record<PropertyKey, unknown>;

export function serveTarget(options: NodeNgSsrExecutorOptions, context) {
  const watchPaths = [];
  const watchFiles = [];
  uiTargetOptions = getTargetOptions(options.browserTarget, context);
  ssrTargetOptions = getTargetOptions(options.ssrTarget, context);
  serveTargetOptions = getTargetOptions(options.serveTarget, context);
  serverTargetOptions = getTargetOptions(serveTargetOptions.buildTarget, context);

  watchPaths.push(uiTargetOptions.outputPath, ssrTargetOptions.outputPath, serverTargetOptions.outputPath);
  watchFiles.push(
    uiTargetOptions.outputPath + '/main.js',
    uiTargetOptions.outputPath + '/styles.css',
    ssrTargetOptions.outputPath + '/main.js',
    serverTargetOptions.outputPath + '/main.js'
  );

  waitOn({ resources: watchPaths }).then(() => startBrowserSync(watchPaths, watchFiles, options));
}

async function startBrowserSync(watchPaths: string[], watchFiles: string[], options: BSOptions) {
  const bsInstance = browserSync.create();

  if (!options.serverAutoSync) {
    process.env.BS_TRIGGER_FILE = serverTargetOptions.outputPath + '/.bs-sync-trigger';
    watchFiles = [
      uiTargetOptions.outputPath + '/main.js',
      uiTargetOptions.outputPath + '/styles.css',
      ssrTargetOptions.outputPath + '/main.js',
      process.env.BS_TRIGGER_FILE,
    ];
  }

  chokidar.watch(watchPaths).on('all', (event, path, stats) => {
    if (watchFiles.includes(path)) {
      console.log('--------');
      console.log(event);
      console.log(path);
      console.log('--------');
      bsInstance.reload();
    }
  });
  await initBrowserSync(bsInstance, +process.env.PORT, options);
}

function getTargetOptions(targetString, context) {
  const target = parseTargetString(targetString);
  return readTargetOptions(target, context);
}
