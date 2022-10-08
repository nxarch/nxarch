import { readProjectConfiguration, Tree, updateProjectConfiguration } from '@nrwl/devkit';
import { InitGeneratorSchema } from '../schema';

export function updateServerConfig(tree: Tree, options: InitGeneratorSchema) {
  const appServerProjectConfig = readProjectConfiguration(tree, options.serverApp);

  const buildConfig = appServerProjectConfig.targets['build'];

  buildConfig.options.externalDependencies = [
    ...(buildConfig.options.externalDependencies || []),
    '@nestjs/common',
    '@nestjs/core',
    'express',
    '@nestjs/microservices',
    '@nestjs/microservices/microservices-module',
    '@nestjs/websockets',
    '@nestjs/websockets/socket-module',
    'cache-manager',
  ];
  buildConfig.options.optimization = false;

  buildConfig.configurations.development = {
    sourceMap: true,
  };

  delete buildConfig.configurations.production.optimization;

  appServerProjectConfig.targets['serve-ssr'] = {
    executor: '@nxarch/ng-nest:build',
    options: {
      browserTarget: `${options.ssrApp}:build:development`,
      ssrTarget: `${options.ssrApp}:ssr:development`,
      serveTarget: `${options.serverApp}:serve:development`,
    },
  };

  appServerProjectConfig.targets['serve'] = {
    ...appServerProjectConfig.targets['serve'],
    configurations: {
      development: {},
      ...appServerProjectConfig.targets['serve'].configurations,
    },
  };

  updateProjectConfiguration(tree, options.serverApp, appServerProjectConfig);
}
