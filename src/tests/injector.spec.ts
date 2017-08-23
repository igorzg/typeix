import {Router} from "../router/router";
import {Injector} from "../injector/injector";
import {Logger} from "../logger/logger";
import {assert, use} from "chai";
import * as sinonChai from "sinon-chai";
import {assert as assertSpy, spy} from "sinon";
import {Inject} from "../decorators/inject";
import {Injectable} from "../decorators/injectable";
import {Metadata} from "../injector/metadata";

// use chai spies
use(sinonChai);

describe("Injector", () => {
  it("Should create instance of Router", () => {
    let rootInjector = new Injector();
    let injector = Injector.createAndResolve(Router, [
      {provide: Injector, useValue: rootInjector},
      {provide: Logger, useClass: Logger}
    ]);
    let router: Router = injector.get(Router);
    assert.isNotNull(router);
  });


  it("@Injectable Should inject correctly on constructor and @Inject", () => {

    @Injectable()
    class A {

      @Inject(Logger)
      private c;

      constructor(private a: Logger, @Inject(Logger) private b) {
      }

      getA(): Logger {
        return this.a;
      }

      getB(): Logger {
        return this.b;
      }

      getC(): Logger {
        return this.c;
      }
    }

    let injector = Injector.createAndResolve(A, [
      {provide: Logger, useClass: Logger}
    ]);
    let a: A = injector.get(A);
    assert.instanceOf(a.getA(), Logger);
    assert.instanceOf(a.getB(), Logger);
    assert.instanceOf(a.getC(), Logger);
  });


  it("@Injectable Should inject correctly with useFactory", () => {

    @Injectable()
    class A {

      @Inject("logger")
      private c;

      constructor(private a: Logger, @Inject("logger") private b) {
      }

      getA(): Logger {
        return this.a;
      }

      getB(): Logger {
        return this.b;
      }

      getC(): Logger {
        return this.c;
      }
    }

    let provider = {
      provide: "logger",
      useFactory: (logger) => {
        assert.instanceOf(logger, Logger);
        return logger;
      },
      deps: [Logger]
    };
    let aSpy = spy(provider, "useFactory");
    let injector = Injector.createAndResolve(A, [
      Logger,
      provider
    ]);
    assertSpy.called(aSpy);
    let a: A = injector.get(A);
    assert.instanceOf(a.getA(), Logger);
    assert.instanceOf(a.getB(), Logger);
    assert.instanceOf(a.getC(), Logger);
  });


  it("Make sure that @Injection of abstract implementation always delivers correct Token!", () => {


    @Injectable()
    class ServiceA {
    }

    @Injectable()
    class ServiceB {
    }

    @Injectable()
    class ServiceC {
    }

    @Injectable()
    abstract class AbstractClass {

      @Inject(ServiceA)
      public serviceAClass: ServiceA;

    }

    @Injectable()
    class ImplementationA extends AbstractClass {

      @Inject(ServiceB)
      public config: ServiceB;

      @Inject(ServiceB)
      public serviceBClass: ServiceB;

    }

    @Injectable()
    class ImplementationB extends AbstractClass {

      @Inject(ServiceC)
      public config: ServiceC;

      @Inject(ServiceC)
      public serviceCClass: ServiceC;

    }

    let providerA = Metadata.verifyProvider(ImplementationA);
    let providerB = Metadata.verifyProvider(ImplementationB);

    let parent = new Injector();
    parent.createAndResolve(Metadata.verifyProvider(AbstractClass), [Metadata.verifyProvider(ServiceA)]);

    let injector = new Injector(parent);
    injector.createAndResolve(providerA, [Metadata.verifyProvider(ServiceB)]);
    injector.createAndResolve(providerB, [Metadata.verifyProvider(ServiceC)]);

    let instanceA = injector.get(ImplementationA);
    let instanceB = injector.get(ImplementationB);

    assert.instanceOf(instanceA.serviceAClass, ServiceA);
    assert.instanceOf(instanceA.config, ServiceB);
    assert.instanceOf(instanceA.serviceBClass, ServiceB);
    assert.isUndefined(instanceA.serviceCClass);

    assert.instanceOf(instanceB.serviceAClass, ServiceA);
    assert.instanceOf(instanceB.config, ServiceC);
    assert.instanceOf(instanceB.serviceCClass, ServiceC);
    assert.isUndefined(instanceB.serviceBClass);

  });

});
