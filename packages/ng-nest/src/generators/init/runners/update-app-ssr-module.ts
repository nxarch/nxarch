import { Tree } from '@nrwl/devkit';
import { getProjects } from 'nx/src/generators/utils/project-configuration';
import { join } from 'path';
import { IndentationText, Project, SyntaxKind, ts } from 'ts-morph';
import { InitGeneratorSchema } from '../schema';

export async function updateAppSsrModule(tree: Tree, options: InitGeneratorSchema) {
  const ssrConfig = getProjects(tree).get(options.ssrApp);

  const browserRootDir = join(tree.root, ssrConfig.root);
  const project = new Project({
    tsConfigFilePath: join(browserRootDir, 'tsconfig.server.json'),
    manipulationSettings: {
      indentationText: IndentationText.TwoSpaces,
    },
  });

  const appSsrModule = project.getSourceFile('app.ssr.module.ts');

  const faultyImport = appSsrModule.getImportDeclaration('./app.module');
  faultyImport.remove();

  const ngModuleClass = appSsrModule.getClass((c) => c.getText().includes('@NgModule'));
  const ngModuleDecorator = ngModuleClass.getDecorator('NgModule');
  const moduleArguments = ngModuleDecorator.getArguments()[0];
  const declarationsProp = moduleArguments
    .getDescendants()
    .find(
      (d) =>
        d.getKind() === SyntaxKind.PropertyAssignment &&
        (d.compilerNode as ts.PropertyAssignment).name.getText() === 'imports'
    );

  const array = declarationsProp.getFirstChildByKindOrThrow(SyntaxKind.ArrayLiteralExpression);
  let index;
  array.forEachChild((child) => {
    if (child.getFullText().trim() === 'AppModule') index = child.getChildIndex();
  });
  array.removeElement(index);
  array.addElement('AppBrowserModule');

  appSsrModule.addImportDeclaration({
    namedImports: ['AppBrowserModule'],
    moduleSpecifier: './app.browser.module',
  });

  appSsrModule.formatText();
  await appSsrModule.save();
  await project.save();
}
