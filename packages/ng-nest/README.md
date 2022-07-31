<p align="center">
 <img width="40%" height="40%" src="https://raw.githubusercontent.com/nxarch/ng-nest/master/assets/nxarch.png">
</p>

> A Nx plugin to integrate a NestJS server with a server side rendered Angular application.

From a conceptual view the NestJS server incorporates an Angular Universal application that will be reached on specified
routes.<br>
The server uses the AngularUniversalModule provided by [`@nxarch/ng-universal`](https://github.com/nxarch/ng-universal).
The setup for both application can be tedious and error-prone. This library takes care of the entire setup and provides
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

You need a NestJS application and a Angular application in the same workspace.
Nx Version >= 14

## Installation

```
npm i @nxarch/ng-nest
yarn add @nxarch/ng-nest
```

### Setup

Use the provided generator to setup all files.
If you don't have an Angular and a NestJS app refer to [this](#setup-nx-apps-if-not-already-setup) part on how to
generate these
applications.

```
yarn nx generate @nxarch/ng-nest:init --ssrApp=my-angular-project --serverApp=my-nestjs-project
```

### App Start

Use the added script in the package.json.

```
yarn dev:server
```

### Setup Nx apps (if not already setup)

Setup an Angular app and a NestJS app

```
yarn add --dev @nrwl/angular @nrwl/nest
yarn nx generate @nrwl/angular:app
yarn nx generate @nrwl/nest:app
```

### Configuration

For configuring the AngularUniversalModule refer to [`@nxarch/ng-universal`](https://github.com/nxarch/ng-universal)
.

### Notice

When using Angulars http client make sure to set a proper url.

```ts
// don't
hello$ = this.http.get<Message>('/api/hello');
// do
hello$ = this.http.get<Message>('http://localhost:4200/api/hello');
```
