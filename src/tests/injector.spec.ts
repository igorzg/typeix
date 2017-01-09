import {Router} from "../router/router";
import {Injector} from "../injector/injector";
import {Logger} from "../logger/logger";
import {assert, use} from "chai";
import * as sinonChai from "sinon-chai";
import {spy, assert as assertSpy} from "sinon";
import {Inject} from "../decorators/inject";
import {Injectable} from "../decorators/injectable";

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

      constructor(private a: Logger, @Inject(Logger) private b) {}

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

      constructor(private a: Logger, @Inject("logger") private b) {}

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


});
