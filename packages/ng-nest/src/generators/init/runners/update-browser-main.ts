import { Tree } from '@nrwl/devkit';
import { getProjects } from 'nx/src/generators/utils/project-configuration';
import { join } from 'path';
import { IndentationText, Project } from 'ts-morph';
import { InitGeneratorSchema } from '../schema';

export async function updateBrowserMain(tree: Tree, options: InitGeneratorSchema) {
  const ngConfig = getProjects(tree).get(options.ssrApp);

  const ngRootDir = join(tree.root, ngConfig.root);
  const project = new Project({
    tsConfigFilePath: join(ngRootDir, 'tsconfig.app.json'),
    manipulationSettings: {
      indentationText: IndentationText.TwoSpaces,
    },
  });

  const main = project.getSourceFile('main.ts');

  const bootstrapFn = main.getFunction('bootstrap');
  let bootstrapFnBody = bootstrapFn.getBodyText();
  bootstrapFnBody = bootstrapFnBody.replace('AppModule', 'AppBrowserModule');

  bootstrapFn.setBodyText(bootstrapFnBody);

  const faultyImport = main.getImportDeclaration('./app/app.module');
  faultyImport.remove();

  main.addImportDeclaration({
    namedImports: ['AppBrowserModule'],
    moduleSpecifier: './app/app.browser.module',
  });

  await main.save();
  await project.save();
}
