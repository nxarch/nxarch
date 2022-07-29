import { installPackagesTask, Tree } from '@nrwl/devkit';
import { addDependencies } from './runners/add-dependencies';
import { renameFiles } from './runners/rename-files';
import { runUniversalSchematic } from './runners/run-universal-schematic';
import { updateAppBrowserModule } from './runners/update-app-browser-module';
import { updateAppServerModule } from './runners/update-app-server-module';
import { updateAppSsrModule } from './runners/update-app-ssr-module';
import { updateBrowserMain } from './runners/update-browser-main';
import { updateNgConfig } from './runners/update-ng-config';
import { updateServerConfig } from './runners/update-server-config';
import { updateSsrMain } from './runners/update-ssr-main';
import { InitGeneratorSchema } from './schema';

export default async function (tree: Tree, options: InitGeneratorSchema) {
  await runUniversalSchematic(tree, options);
  await updateNgConfig(tree, options);
  await updateServerConfig(tree, options);
  await addDependencies(tree);

  return async () => {
    installPackagesTask(tree);

    await new Promise((resolve, reject) => {
      setTimeout(async () => {
        await updateAppServerModule(tree, options);
        await updateAppBrowserModule(tree, options);
        await updateAppSsrModule(tree, options);
        await updateBrowserMain(tree, options);
        await updateSsrMain(tree, options);
        renameFiles(tree, options);

        resolve(true);
      }, 100);
    });
  };
}
