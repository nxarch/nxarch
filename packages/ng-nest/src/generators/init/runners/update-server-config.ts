import { readProjectConfiguration, Tree, updateProjectConfiguration } from '@nrwl/devkit';
import { InitGeneratorSchema } from '../schema';

export async function updateServerConfig(tree: Tree, options: InitGeneratorSchema) {
  const appServerProjectConfig = readProjectConfiguration(tree, options.serverApp);

  const buildConfig = appServerProjectConfig.targets['build'];

  buildConfig.options.externalDependencies = [
    ...(buildConfig.options.externalDependencies || []),
    '@nestjs/microservices',
    '@nestjs/microservices/microservices-module',
    '@nestjs/websockets',
    '@nestjs/websockets/socket-module',
    'cache-manager',
  ];
  buildConfig.options.optimization = false;
  buildConfig.options.sourceMap = true;

  appServerProjectConfig.targets['serve-ssr'] = {
    executor: '@nxarch/ng-nest:build',
    options: {
      uiTarget: `${options.ssrApp}:build`,
      ssrTarget: `${options.ssrApp}:ssr`,
      serveTarget: `${options.serverApp}:serve`,
    },
    configurations: {
      production: {},
    },
  };

  updateProjectConfiguration(tree, options.serverApp, appServerProjectConfig);
}
