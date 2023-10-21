import { readProjectConfiguration, Tree, updateProjectConfiguration } from '@nx/devkit';
import { InitGeneratorSchema } from '../schema';

export function updateNgConfig(tree: Tree, options: InitGeneratorSchema) {
  const appSsrProjectConfig = readProjectConfiguration(tree, options.ssrApp);
  const { server: ssrConfig, ...targets } = appSsrProjectConfig.targets;
  ssrConfig.options.tsConfig = ssrConfig.options.tsConfig.replace('tsconfig.server.json', 'tsconfig.ssr.json');
  ssrConfig.options.outputPath = `dist/apps/${options.ssrApp}/ssr`;
  ssrConfig.options.outputHashing = 'none';
  ssrConfig.options.optimization = false;

  delete ssrConfig.configurations.development.optimization;

  const buildConfig = targets.build;
  buildConfig.options.outputPath = `dist/apps/${options.ssrApp}/browser`;

  updateProjectConfiguration(tree, options.ssrApp, {
    ...appSsrProjectConfig,
    targets: {
      ...targets,
      ssr: ssrConfig,
    },
  });
}
