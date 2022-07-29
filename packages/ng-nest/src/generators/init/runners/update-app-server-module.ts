import { Tree } from '@nrwl/devkit';
import { getProjects } from 'nx/src/generators/utils/project-configuration';
import { join } from 'path';
import { IndentationText, Project, SyntaxKind, ts } from 'ts-morph';
import { InitGeneratorSchema } from '../schema';

export async function updateAppServerModule(tree: Tree, options: InitGeneratorSchema) {
  const serverConfig = getProjects(tree).get(options.serverApp);
  const ssrConfig = getProjects(tree).get(options.ssrApp);

  const serverRootDir = join(tree.root, serverConfig.root);
  const project = new Project({
    tsConfigFilePath: join(serverRootDir, 'tsconfig.app.json'),
    manipulationSettings: {
      indentationText: IndentationText.TwoSpaces,
    },
  });

  const appModule = project.getSourceFile('app.module.ts');

  const ngModuleClass = appModule.getClass((c) => c.getText().includes('@Module'));
  const ngModuleDecorator = ngModuleClass.getDecorator('Module');
  const moduleArguments = ngModuleDecorator.getArguments()[0];
  const declarationsProp = moduleArguments
    .getDescendants()
    .find(
      (d) =>
        d.getKind() === SyntaxKind.PropertyAssignment &&
        (d.compilerNode as ts.PropertyAssignment).name.getText() === 'imports'
    );

  const ssrTarget = ssrConfig.targets['ssr'];
  const buildTarget = ssrConfig.targets['build'];

  const array = declarationsProp.getFirstChildByKindOrThrow(SyntaxKind.ArrayLiteralExpression);
  array.addElement(`
    AngularUniversalModule.forRoot({
      bootstrap: join(process.cwd(), '${ssrTarget.options.outputPath}/main.js'),
      viewsPath: join(process.cwd(), '${buildTarget.options.outputPath}'),
    }),
  `);

  appModule.addImportDeclaration({
    namedImports: ['AngularUniversalModule'],
    moduleSpecifier: '@ynnck/ng-universal',
  });

  appModule.addImportDeclaration({
    namedImports: ['join'],
    moduleSpecifier: 'path',
  });

  appModule.formatText();
  await appModule.save();
  await project.save();
}
