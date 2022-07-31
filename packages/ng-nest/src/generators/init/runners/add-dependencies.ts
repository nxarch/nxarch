import { addDependenciesToPackageJson, Tree } from '@nrwl/devkit';

export function addDependencies(tree: Tree) {
  return addDependenciesToPackageJson(
    tree,
    {
      '@babel/runtime': '^7.18.0',
      '@nestjs/common': '^9.0.0',
      '@nestjs/core': '^9.0.0',
      '@nestjs/platform-express': '^9.0.0',
      '@nxarch/nest-nguniversal': '^0.3.0',
      'reflect-metadata': '^0.1.13',
      'class-transformer': '^0.4.0',
      'class-validator': '^0.13.1',
    },
    {}
  );
}
