import {assert, expect, use} from "chai";
import * as sinonChai from "sinon-chai";
import {spy, stub, assert as assertSpy} from "sinon";
import {Module} from "../decorators/module";
import {Injectable} from "../decorators/injectable";
import {BOOTSTRAP_MODULE, createModule, getModule} from "../server/bootstrap";
import {IModule} from "../interfaces/imodule";

// use chai spies
use(sinonChai);

describe("Modules", () => {

  @Injectable()
  class ServiceA {}

  @Injectable()
  class ServiceB {}

  @Injectable()
  class ServiceC {}

  it("ModuleA initialized", () => {

    @Module({
      name: BOOTSTRAP_MODULE,
      providers: [ServiceA]
    })
    class ModuleA {

    }

    let _modules: Array<IModule> = createModule(ModuleA);
    let iModule = getModule(_modules, BOOTSTRAP_MODULE);
    assert.isDefined(iModule);
  });


  it("ModuleA service check", () => {

    @Module({
      name: BOOTSTRAP_MODULE,
      providers: [ServiceA]
    })
    class ModuleA {

    }

    let _modules: Array<IModule> = createModule(ModuleA);
    let iModule = getModule(_modules, BOOTSTRAP_MODULE);
    assert.isDefined(iModule.injector.get(ModuleA));
  });


  it("Module B import test", () => {
    let name = "moduleb";
    @Module({
      name: name,
      providers: [ServiceB]
    })
    class ModuleB {}


    @Module({
      imports: [ModuleB],
      name: BOOTSTRAP_MODULE,
      providers: [ServiceA]
    })
    class ModuleA {

    }

    let _modules: Array<IModule> = createModule(ModuleA);

    let iModuleB = getModule(_modules, name);
    assert.isDefined(iModuleB.injector.get(ServiceB));
    assert.isDefined(iModuleB);

    let iModuleA = getModule(_modules, BOOTSTRAP_MODULE);
    assert.isDefined(iModuleA.injector.get(ServiceA));
    assert.isDefined(iModuleA);
  });


  it("Module B exports test", () => {
    let name = "moduleb";
    @Module({
      exports: [ServiceB],
      name: name,
      providers: [ServiceB]
    })
    class ModuleB {}


    @Module({
      imports: [ModuleB],
      name: BOOTSTRAP_MODULE,
      providers: [ServiceA]
    })
    class ModuleA {

    }

    let _modules: Array<IModule> = createModule(ModuleA);

    let iModuleB = getModule(_modules, name);
    assert.isDefined(iModuleB.injector.get(ServiceB));
    assert.isDefined(iModuleB);

    let iModuleA = getModule(_modules, BOOTSTRAP_MODULE);
    assert.isDefined(iModuleA.injector.get(ServiceA));
    assert.isDefined(iModuleA.injector.get(ServiceB));
    assert.isDefined(iModuleA);
  });
});
