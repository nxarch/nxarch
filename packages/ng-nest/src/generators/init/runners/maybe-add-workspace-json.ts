import { Tree, workspaceRoot } from '@nx/devkit';
import fs from 'fs';
import { getProjects } from 'nx/src/generators/utils/project-configuration';
import { InitGeneratorSchema } from '../schema';

export function maybeAddWorkspaceJson(tree: Tree, options: InitGeneratorSchema): boolean {
  const serverConfig = getProjects(tree).get(options.serverApp);
  const ssrConfig = getProjects(tree).get(options.ssrApp);

  let content = JSON.stringify(require('../assets/workspace.json'));
  content = content.replace('__SERVER_PROJECT__', serverConfig.name);
  content = content.replace('__SERVER_PROJECT_PATH__', serverConfig.root);
  content = content.replace('__SSR_PROJECT__', ssrConfig.name);
  content = content.replace('__SSR_PROJECT_PATH__', ssrConfig.root);

  fs.appendFile(workspaceRoot + '/workspace.json', content, (event) => {});

  return true;
}
