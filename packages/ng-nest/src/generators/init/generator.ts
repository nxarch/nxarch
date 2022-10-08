import { installPackagesTask, Tree, workspaceRoot } from '@nrwl/devkit';
import { removeDir } from '../../executors/build/utilities/node.utils';
import { addDependencies } from './runners/add-dependencies';
import { maybeAddWorkspaceJson } from './runners/maybe-add-workspace-json';
import { renameFiles } from './runners/rename-files';
import { runUniversalSchematic } from './runners/run-universal-schematic';
import { updateAppBrowserModule } from './runners/update-app-browser-module';
import { updateAppServerModule } from './runners/update-app-server-module';
import { updateAppSsrModule } from './runners/update-app-ssr-module';
import { updateBrowserMain } from './runners/update-browser-main';
import { updateNgConfig } from './runners/update-ng-config';
import { updatePackageJson } from './runners/update-package-json';
import { updateServerConfig } from './runners/update-server-config';
import { updateSsrMain } from './runners/update-ssr-main';
import { InitGeneratorSchema } from './schema';

export default async function (tree: Tree, options: InitGeneratorSchema) {
  const addedWorkspaceJson = maybeAddWorkspaceJson(tree, options);

  await runUniversalSchematic(tree, options);
  updateNgConfig(tree, options);
  updateServerConfig(tree, options);
  addDependencies(tree);
  updatePackageJson(tree, options);

  return async () => {
    installPackagesTask(tree);

    updateAppServerModule(tree, options);
    updateAppBrowserModule(tree, options);
    updateAppSsrModule(tree, options);
    updateBrowserMain(tree, options);
    updateSsrMain(tree, options);
    renameFiles(tree, options);

    if (addedWorkspaceJson) removeDir(workspaceRoot + '/workspace.json');
  };
}
