import { readProjectConfiguration, Tree, updateProjectConfiguration } from '@nrwl/devkit';
import { InitGeneratorSchema } from '../schema';

export async function updateNgConfig(tree: Tree, options: InitGeneratorSchema) {
  const appSsrProjectConfig = readProjectConfiguration(tree, options.ssrApp);
  const { server, ...targets } = appSsrProjectConfig.targets;
  const ssrConfig = server;
  const buildConfig = targets.build;
  ssrConfig.options.tsConfig = ssrConfig.options.tsConfig.replace('tsconfig.server.json', 'tsconfig.ssr.json');
  ssrConfig.options.outputPath = `dist/apps/${options.ssrApp}/ssr`;
  buildConfig.options.outputPath = `dist/apps/${options.ssrApp}/browser`;

  updateProjectConfiguration(tree, options.ssrApp, {
    ...appSsrProjectConfig,
    targets: {
      ...targets,
      ssr: ssrConfig,
    },
  });
}
