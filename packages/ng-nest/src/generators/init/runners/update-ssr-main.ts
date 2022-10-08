import { Tree } from '@nrwl/devkit';
import { getProjects } from 'nx/src/generators/utils/project-configuration';
import { join } from 'path';
import { IndentationText, Project } from 'ts-morph';
import { InitGeneratorSchema } from '../schema';

export function updateSsrMain(tree: Tree, options: InitGeneratorSchema) {
  const ngConfig = getProjects(tree).get(options.ssrApp);

  const ngRootDir = join(tree.root, ngConfig.root);
  const project = new Project({
    tsConfigFilePath: join(ngRootDir, 'tsconfig.server.json'),
    manipulationSettings: {
      indentationText: IndentationText.TwoSpaces,
    },
  });

  const main = project.getSourceFile('main.ssr.ts');

  const faultyExport = main.getExportDeclaration('@angular/platform-server');
  faultyExport.replaceWithText("export { ngExpressEngine } from '@nguniversal/express-engine';");

  main.saveSync();
  project.saveSync();
}
