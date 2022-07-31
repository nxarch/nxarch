import { Tree, updateJson } from '@nrwl/devkit';
import { InitGeneratorSchema } from '../schema';

export async function updatePackageJson(tree: Tree, options: InitGeneratorSchema) {
  updateJson(tree, 'package.json', (pkgJson) => {
    console.log(pkgJson);
    pkgJson.scripts = pkgJson.scripts ?? {};
    pkgJson.scripts['dev:server'] = `nx ${options.serverApp}:serve-ssr:development`;

    return pkgJson;
  });
}
