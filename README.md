# Typescript API for RESTful Services for (Node.js)

[![Build Status](https://travis-ci.org/igorzg/typeix.svg?branch=master)](https://travis-ci.org/igorzg/typeix)
[![npm version](https://badge.fury.io/js/typeix.svg)](https://badge.fury.io/js/typeix)

* Works with node gte 6.x.x
* Typeix has dependency injection inspired by Angular 2


[View demo application](https://github.com/igorzg/typeix-demo-app)

## Features
* Dependency Injection - @Inject JSR 330 standard
* Modular design
* MVC structure
* Component driven -> singletons -> depends on injection level
* Request Filters
* Nice routing features -> supports static && dynamic routing && reverse router
* Controller inheritance


## Getting started
#### create project

```npm
npm init
```

```npm
npm install typeix --save
npm install @types/node --save
```

#### create controllers/core.controller.ts

```typescript
import { Controller, Action, isPresent } from "typeix";
import { readFile } from "fs";
import { normalize } from "path";

@Controller({
  name: "core" // route controller
})
export class CoreController {

  @Action("favicon") // route action
  async faviconLoader() {
    return await <Promise<Buffer>> new Promise(
      (resolve, reject) =>
        readFile(
          normalize(__dirname + "/pathto/my/favicon.ico"),
          (err, data) => isPresent(err) ? reject(err) : resolve(data)
        )
    );
  }

  @Action("index")
  myIndexAction() {
    return "Hello world"; // accepts - string // buffer // Promise<string|Buffer>
  }
}

```

#### create application.module.ts
```typescript
import { Module, Router, Logger, Inject, IAfterConstruct, Methods } from "typeix"
import { CoreController } from "./controllers/core.controller"

@Module({
  controllers: [CoreController],
  providers: [Logger, Router]
})
class Application implements IAfterConstruct {
  
  @Inject(Router)
  private router: Router;
  
  afterConstruct() {
    // just controller/action always points to root module
    this.router.addRules([
        {
          methods: [Methods.GET],
          // module/controller/action or controller/action
          route: "core/favicon", 
          url: "/favicon.ico"
        },
        {
          methods: [Methods.GET],
           // equals root/core/index since bootstrap module is root module
          route: "core/index",
          url: "/"
        }
    ]);
  }
  
}
```

#### create bootstrap.ts
```typescript
import {Application} from "./application.module";
import {httpServer} from "typeix";

/**
 * Bootstrap http or https server.
 *
 * @description
 * Creates server instance on port 9000
 * We always use separate bootstrap file to bootstrap application 
 * because of testing or server side fakeHttp feature.
 * We will be able to simulate server side request with fakeHttp
 */
httpServer(Application, 9000);
```

To start your application run node bootstrap.js after compiling to javascript.
