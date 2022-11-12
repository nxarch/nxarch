import { parseTargetString, readTargetOptions } from '@nrwl/devkit';
import browserSync from 'browser-sync';
import chokidar from 'chokidar';
import waitOn from 'wait-on';
import { initBrowserSync } from './init-browser-sync';
import { NodeNgSsrExecutorOptions } from './schema';

let browserTargetOptions: Record<PropertyKey, unknown>;
let ssrTargetOptions: Record<PropertyKey, unknown>;
let serveTargetOptions: Record<PropertyKey, unknown>;
let serverTargetOptions: Record<PropertyKey, unknown>;

export function serveTarget(options: NodeNgSsrExecutorOptions, context) {
  const watchPaths = [];
  const watchFiles = [];
  browserTargetOptions = getTargetOptions(options.browserTarget, context);
  ssrTargetOptions = getTargetOptions(options.ssrTarget, context);
  serveTargetOptions = getTargetOptions(options.serveTarget, context);
  serverTargetOptions = getTargetOptions(serveTargetOptions.buildTarget, context);

  watchPaths.push(browserTargetOptions.outputPath, ssrTargetOptions.outputPath, serverTargetOptions.outputPath);

  watchFiles.push(
    browserTargetOptions.outputPath + '/main.js',
    browserTargetOptions.outputPath + '/styles.css',
    ssrTargetOptions.outputPath + '/main.js'
  );

  if (!options.serverAutoSync) {
    process.env.NXARCH_SERVER_AUTO_SYNC = 'false';
  } else {
    process.env.NXARCH_SERVER_AUTO_SYNC = 'true';
    // triggerReload() is used instead of watching server main.js bundle to avoid early refresh before server is restarted
    // trigger reload is called in @nxarch/nest-nguniversal
    process.env.BS_TRIGGER_FILE = serverTargetOptions.outputPath + '/.bs-sync-trigger';
    watchFiles.push(process.env.BS_TRIGGER_FILE);
  }

  waitOn({ resources: watchPaths }).then(() => startBrowserSync(watchPaths, watchFiles, options));
}

async function startBrowserSync(watchPaths: string[], watchFiles: string[], options: NodeNgSsrExecutorOptions) {
  const bsInstance = browserSync.create();

  chokidar.watch(watchPaths).on('all', (event, path, stats) => {
    if (watchFiles.includes(path)) {
      // todo add debug flag
      // console.log('--------');
      // console.log(event);
      // console.log(path);
      // console.log('--------');
      bsInstance.reload();
    }
  });

  await initBrowserSync(bsInstance, +process.env[options.environmentKey], options);
}

function getTargetOptions(targetString, context) {
  const target = parseTargetString(targetString);
  return readTargetOptions(target, context);
}
