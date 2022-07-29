import { readProjectConfiguration, Tree } from '@nrwl/devkit';
import fs from 'fs';
import { join } from 'path';
import { InitGeneratorSchema } from '../schema';

export function renameFiles(tree: Tree, options: InitGeneratorSchema) {
  const ssrConfig = readProjectConfiguration(tree, options.ssrApp);
  const ngProjectRoot = join(tree.root, ssrConfig.root);
  const ngAppRoot = join(tree.root, ssrConfig.sourceRoot, 'app');

  fs.rename(ngProjectRoot + '/tsconfig.server.json', ngProjectRoot + '/tsconfig.ssr.json', function (err) {});
  fs.rename(ngAppRoot + '/app.module.ts', ngAppRoot + '/app.browser.module.ts', function (err) {});
}
