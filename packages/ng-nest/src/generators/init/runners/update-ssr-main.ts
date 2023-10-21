import { Tree } from '@nx/devkit';
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

  main.replaceWithText(
    `
// If you want prod mode to be enabled use this snippet
// import { enableProdMode } from '@angular/core';
// import { environment } from './environments/environment';
//
// if (environment.production) {
//   enableProdMode();
// }

export { AppSsrModule } from './app/app.ssr.module';
export { ngExpressEngine } from '@nguniversal/express-engine';
`.trim()
  );

  main.saveSync();
  project.saveSync();
}
