import { Tree } from '@nrwl/devkit';
import { getProjects } from 'nx/src/generators/utils/project-configuration';
import { join } from 'path';
import { IndentationText, Project } from 'ts-morph';
import { InitGeneratorSchema } from '../schema';

export function updateAppBrowserModule(tree: Tree, options: InitGeneratorSchema) {
  const ssrConfig = getProjects(tree).get(options.ssrApp);

  const browserRootDir = join(tree.root, ssrConfig.root);
  const project = new Project({
    tsConfigFilePath: join(browserRootDir, 'tsconfig.app.json'),
    manipulationSettings: {
      indentationText: IndentationText.TwoSpaces,
    },
  });

  const appModule = project.getSourceFile('app.module.ts');
  const appModuleClass = appModule.getClass('AppModule');
  appModuleClass.rename('AppBrowserModule');

  appModule.formatText();
  appModule.saveSync();
}
