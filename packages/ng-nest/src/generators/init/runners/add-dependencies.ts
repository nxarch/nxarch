import { addDependenciesToPackageJson, Tree } from '@nrwl/devkit';

export function addDependencies(tree: Tree) {
  return addDependenciesToPackageJson(
    tree,
    {
      '@nestjs/common': '^8.0.0',
      '@nestjs/core': '^8.0.0',
      '@nestjs/platform-express': '^8.0.0',
      'reflect-metadata': '^0.1.13',
      'class-transformer': '^0.4.0',
      'class-validator': '^0.13.1',
      '@ynnck/ng-universal': '^6.0.0',
      '@nguniversal/express-engine': '^14.0.0',
    },
    {}
  );
}
