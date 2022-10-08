<p align="center">
 <img width="40%" height="40%" src="https://raw.githubusercontent.com/nxarch/nxarch/master/assets/nxarch.png">
</p>

> A Nx plugin to integrate a NestJS server with a server side rendered Angular application.

From a conceptual point of view the NestJS server incorporates an Angular Universal application that will be reached on
specified
routes.<br>
The server uses the AngularUniversalModule provided
by [`@nxarch/nest-nguniversal`](https://github.com/nxarch/nest-nguniversal).
The setup for both applications can be tedious and error-prone. This library takes care of the entire setup and provides
an executor for a good DX.

<p align="center">
<a href="https://github.com/nxarch/nxarch/actions/workflows/ci.yml">
  <img src="https://github.com/nxarch/nxarch/actions/workflows/ci.yml/badge.svg" />
</a>&nbsp;

<a href="https://www.npmjs.com/@nxarch/ng-nest">
  <img src="https://img.shields.io/npm/v/@nxarch/ng-nest.svg?logo=npm&logoColor=fff&label=NPM+package&color=limegreen" alt="NxArch on npm" />
</a>&nbsp;
</p>

## Prerequisites

- You need a NestJS application and an Angular application in the same [workspace](#setup-nx-apps-if-not-already-setup).
- Nx Version >= 14.0.0

## Installation

```
npm i @nxarch/ng-nest
yarn add @nxarch/ng-nest
```

## Setup

Use the provided generator to setup all files.
If you don't have an Angular and a NestJS app refer to [this](#setup-nx-apps-if-not-already-setup) part on how to
generate these
applications.

```
yarn nx generate @nxarch/ng-nest:init --ssrApp=my-angular-project --serverApp=my-nestjs-project
```

## App Start

Use the added script in the package.json.

```
yarn dev:server
```

### Setup Nx apps (if not already setup)

Use this command to quickly scaffold a **new workspace** with an Angular and a NestJS application.

```
npx create-nx-workspace --preset angular-nest
```

Setup an Angular app and a NestJS app in an **existing** Nx workspace.

```
yarn add --dev @nrwl/angular @nrwl/nest
yarn nx generate @nrwl/angular:app
yarn nx generate @nrwl/nest:app
```

### Configuration

You can configure the plugin with these properties. <br>
Use them in server projects project.json: `targets -> serve-ssr -> options`

| Property             | Type      | Description                                                                                                                                                                            |
|----------------------|-----------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `browserTarget`      | string    | The target name of your browser target (already configured after setup)                                                                                                                |
| `ssrTarget`          | string    | The target name of your ssr target (already configured after setup)                                                                                                                    |
| `serveTarget`        | string    | The target name of your server target (already configured after setup)                                                                                                                 |
| `host`               | string?   | Browsersync host (default: localhost)                                                                                                                                                  |
| `port`               | number?   | The browsersync port (default: 4200)                                                                                                                                                   |
| `ssl`                | boolean?  | Enable ssl on browsersync (default: false)                                                                                                                                             |
| `sslKey`             | string?   | SSL key to use if ssl is enabled                                                                                                                                                       |
| `sslCert`            | string?   | SSL cert to use if ssl is enabled                                                                                                                                                      |
| `proxyConfig`        | string?   | A possible proxy config for browsersync                                                                                                                                                |
| `openBrowser`        | boolean?  | Enable if a browser window should open on app startup (default: true)                                                                                                                  |
| `browsers`           | string[]? | Specify which browsers to open on app startup (default is your default system browser) (e.g. ["Google Chrome"])                                                                        |
| `serverAutoSync`     | boolean?  | You can disable server auto sync if you want to take care of reloading browsersync after server changes. User triggerReload() function to trigger browsersync reloads. (default: true) |
| `disableBrowserSync` | boolean?  | Disable browsersync entirely (default: false)                                                                                                                                          |

For configuring the AngularUniversalModule refer
to [`@nxarch/nest-nguniversal`](https://github.com/nxarch/nest-nguniversal).

### Notice

When using Angulars http client make sure to set a proper url.

```ts
// don't
hello$ = this.http.get<Message>('/api/hello');
// do
hello$ = this.http.get<Message>('http://localhost:4200/api/hello');
```
