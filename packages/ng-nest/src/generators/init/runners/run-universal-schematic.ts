import { Tree } from '@nx/devkit';
import { wrapAngularDevkitSchematic } from 'nx/src/adapter/ngcli-adapter';

import { InitGeneratorSchema } from '../schema';

export async function runUniversalSchematic(tree: Tree, options: InitGeneratorSchema) {
  const universalSchematic = wrapAngularDevkitSchematic('@schematics/angular', 'universal');

  await universalSchematic(tree, {
    project: options.ssrApp,
    main: 'main.ssr.ts',
    rootModuleFileName: 'app.ssr.module.ts',
    rootModuleClassName: 'AppSsrModule',
    appId: options.appId,
  });
}
