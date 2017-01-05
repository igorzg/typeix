import {Router} from "../router/router";
import {Injector} from "../injector/injector";
import {Logger} from "../logger/logger";
import {assert} from "chai";
import {Inject} from "../decorators/inject";
import {Injectable} from "../decorators/injectable";

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
    assert.isTrue(a.getA() instanceof Logger);
    assert.isTrue(a.getB() instanceof Logger);
    assert.isTrue(a.getC() instanceof Logger);
  });

});
