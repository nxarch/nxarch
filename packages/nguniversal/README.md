<p align="center"><img width="40%" height="40%" src="https://raw.githubusercontent.com/nxarch/nxarch/master/assets/nxarch.png"></p>

> This library provides useful Modules and Utilities to simplify and enhance efficiency working with Angular Universal

<p align="center">
<a href="https://github.com/nxarch/nxarch/actions/workflows/ci.yml">
  <img src="https://github.com/nxarch/nxarch/actions/workflows/ci.yml/badge.svg" />
</a>&nbsp;

<a href="https://www.npmjs.com/@nxarch/ng-nest">
  <img src="https://img.shields.io/npm/v/@nxarch/nguniversal.svg?logo=npm&logoColor=fff&label=NPM+package&color=limegreen" alt="NxArch on npm" />
</a>&nbsp;
</p>

## Prerequisites

Angular Universal Version >= 14.0.0

## Installation

```
npm i @nxarch/nguniversal
yarn add @nxarch/nguniversal
```

## TransferStateService

This utility service simplifies working with Angular Universals Transfer State. The service will determine if the
provided callback function should be executed based on the existence of the key.

- the TransferStateService methods are called on the server and on the client
- values that are returned by the callback function are stored in the transfer state
- the state is stored as json inside the html that is being sent to the client
- on the client the transferStateService can determine if the value is already present or not based on the key
- once a value is read the key value pair will be removed from the transfer state

### Setup

This setup is not required for Angular 14.<br>
You can just [use](#usage) the service in your dependency injection.

```ts
// browser.module.ts
@NgModule({
  imports: [
    BrowserModule.withServerTransition({ appId: 'ssrApp' }),
    BrowserTransferStateModule, // add this module
  ],
})
export class AppBrowserModule {}

// ssr.module.ts
@NgModule({
  imports: [
    ServerModule,
    AppBrowserModule,
    ServerTransferStateModule, // add this module
  ],
})
export class AppSsrModule {}
```

### Usage

The http call will be made on the server and send to the client with the html.

`{ "your-token": "some hello message" }`

On the client the transfer state is read. The key `"your-token"` exists so the callback function won't be executed.

```ts
export class AppComponent {
  hello$ = this.transferStateService.fetch('your-token', () =>
    this.http.get<string>('http://localhost:4200/api/hello')
  );

  constructor(
    private readonly transferStateService: TransferStateService,
    private http: HttpClient
  ) {}
}
```

## Environment Tokens

### Usage

In terms of environment there are only two states. The statements are run on the server (IS_SERVER) or on the client
(IS_BROWSER).

```ts
export class AppComponent implements OnInit {
  constructor(
    @Inject(IS_SERVER) private isServer: boolean,
    @Inject(IS_BROWSER) private isBrowser: boolean
  ) {}

  ngOnInit() {
    if (this.isServer) {
      // this will only run on the server
    }
    if (this.isBrowser) {
      // this will only run oin the client
    }
  }
}
```
