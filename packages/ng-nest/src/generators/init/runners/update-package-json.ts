import { Tree, updateJson } from '@nx/devkit';
import { InitGeneratorSchema } from '../schema';

export function updatePackageJson(tree: Tree, options: InitGeneratorSchema) {
  updateJson(tree, 'package.json', (pkgJson) => {
    pkgJson.scripts = pkgJson.scripts ?? {};
    pkgJson.scripts['dev:server'] = `nx serve-ssr ${options.serverApp}`;

    return pkgJson;
  });
}
