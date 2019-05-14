import {Methods} from "../router/router";
import {Injector} from "../injector/injector";
import {IResolvedRoute} from "../interfaces/iroute";
import {ControllerResolver} from "../server/controller-resolver";
import {Request} from "../server/request";
import {assert, use} from "chai";
import * as sinonChai from "sinon-chai";
import {assert as assertSpy, spy, stub} from "sinon";
import {EventEmitter} from "events";
import {isEqual, uuid} from "../core";
import {Logger} from "../logger/logger";
import {Action, After, AfterEach, Before, BeforeEach} from "../decorators/action";
import {Metadata} from "../injector/metadata";
import {IAction} from "../interfaces/iaction";
import {Produces} from "../decorators/produces";
import {Inject} from "../decorators/inject";
import {Param} from "../decorators/param";
import {Chain} from "../decorators/chain";
import {Controller} from "../decorators/controller";
import {IFilter} from "../interfaces/ifilter";
import {Filter} from "../decorators/filter";
import {IControllerMetadata} from "../interfaces/icontroller";
import {fakeControllerActionCall} from "../server/mocks";
import {Context} from  "aws-lambda";

// use chai spies
use(sinonChai);

describe("ControllerResolver", () => {


  let resolvedRoute: IResolvedRoute;
  let eventEmitter;
  let controllerResolver: ControllerResolver;
  let controllerProvider, IRequest, request, response, data, id = uuid(), url = "/";
  let actionName = "action";
  let event = {};
  let context = {
    callbackWaitsForEmptyEventLoop: true,
    functionName: "functionName",
    functionVersion: "functionVersion",
    invokedFunctionArn: "arn:aws:lambda:region:account-id:function:function-name",
    memoryLimitInMB: 128,
    awsRequestId: "some-stringy",
    logGroupName: "some-stringy",
    logStreamName: "some-stringy",
    getRemainingTimeInMillis : ()=>{return 1},
    done: (error?: Error, result?: any)=>{},
    fail: (error: Error | string) =>{},
    succeed : (message: string, object: any)=>{}
  }

  beforeEach(() => {
    resolvedRoute = {
      method: Methods.GET,
      params: {
        a: 1,
        b: 2
      },
      route: "core/index"
    };
    response = new EventEmitter();
    request = new EventEmitter();
    event = {
      "key": "value"
    };
    context = context; 
    data = [new Buffer(1), new Buffer(1)];
    controllerProvider = {};
    IRequest = {};
    eventEmitter = new EventEmitter();
    let injector = Injector.createAndResolve(ControllerResolver, [
      {provide: "event", useValue: event},
      {provide: "context", useValue: context},
      {provide: "data", useValue: data},
      {provide: "request", useValue: request},
      {provide: "response", useValue: response},
      {provide: "url", useValue: url},
      {provide: "UUID", useValue: id},
      {provide: "controllerProvider", useValue: controllerProvider},
      {provide: "actionName", useValue: actionName},
      {provide: "resolvedRoute", useValue: resolvedRoute},
      {provide: "isForwarded", useValue: false},
      {provide: "isForwarder", useValue: false},
      {provide: "isChainStopped", useValue: false},
      {provide: EventEmitter, useValue: eventEmitter},
      {provide: Request, useValue: IRequest},
      Logger
    ]);
    controllerResolver = injector.get(ControllerResolver);
  });

  it("ControllerResolver.constructor", () => {
    assert.isTrue(controllerResolver instanceof ControllerResolver);
  });

  it("ControllerResolver.stopChain", () => {
    assert.isFalse(Reflect.get(controllerResolver, "isChainStopped"));
    controllerResolver.stopChain();
    assert.isTrue(Reflect.get(controllerResolver, "isChainStopped"));
  });

  it("ControllerResolver.destroy", () => {
    let aSpy = spy(eventEmitter, "emit");
    let bSpy = spy(eventEmitter, "removeAllListeners");
    controllerResolver.destroy();
    assertSpy.calledWith(aSpy, "destroy");
    assertSpy.called(bSpy);
  });

  it("ControllerResolver.getEventEmitter", () => {
    assert.isTrue(isEqual(controllerResolver.getEventEmitter(), eventEmitter));
  });

  it("ControllerResolver.getIncomingMessage", () => {
    assert.isTrue(isEqual(controllerResolver.getIncomingMessage(), request));
  });

  it("ControllerResolver.getResolvedRoute", () => {
    assert.isTrue(isEqual(controllerResolver.getResolvedRoute(), resolvedRoute));
  });  

  it("ControllerResolver.getId", () => {
    assert.isTrue(isEqual(controllerResolver.getId(), id));
  });  

  it("ControllerResolver.getContext", () => {
    assert.isTrue(isEqual(controllerResolver.getContext(), context));
  });  

  it("ControllerResolver.getEvent", () => {
    assert.isTrue(isEqual(controllerResolver.getEvent(), event));
  });  

  it("ControllerResolver.getServerResponse", () => {
    assert.isTrue(isEqual(controllerResolver.getServerResponse(), response));
  });

  it("ControllerResolver.process", () => {
    let aSpy = stub(controllerResolver, "processController");
    aSpy.returnsArg(0);
    let arg = controllerResolver.process();
    assertSpy.calledWith(aSpy, arg, controllerProvider, actionName);
  });

  it("ControllerResolver.hasMappedAction", () => {
    class B {
      @Action("index")
      index() {
      }
    }

    let provider = Metadata.verifyProvider(B);
    assert.isTrue(controllerResolver.hasMappedAction(provider, "index"));
    assert.isFalse(controllerResolver.hasMappedAction(provider, "nomappedAction"));
  });

  it("ControllerResolver.getMappedAction", () => {
    class A {
      @Action("parent")
      actionParent() {

      }

      @Before("index")
      beforeIndex() {

      }
    }

    class B extends A {
      @Action("index")
      actionIndex() {

      }
    }

    let aProvider = Metadata.verifyProvider(A);
    let bProvider = Metadata.verifyProvider(B);
    assert.isFalse(controllerResolver.hasMappedAction(aProvider, "index"));
    assert.isTrue(controllerResolver.hasMappedAction(aProvider, "parent"));
    assert.isTrue(controllerResolver.hasMappedAction(bProvider, "index"));
    assert.isTrue(controllerResolver.hasMappedAction(bProvider, "parent"));

    assert.isNotNull(controllerResolver.getMappedAction(aProvider, "parent"));
    assert.isNotNull(controllerResolver.getMappedAction(bProvider, "index"));
    assert.isNotNull(controllerResolver.getMappedAction(bProvider, "parent"));

    assert.isNotNull(controllerResolver.getMappedAction(aProvider, "index", "Before"));
    assert.isNotNull(controllerResolver.getMappedAction(bProvider, "index", "Before"));

    assert.throws(() => {
      controllerResolver.getMappedAction(aProvider, "index");
    }, `@Action("index") is not defined on controller A`);

    let action: IAction = controllerResolver.getMappedAction(bProvider, "index", "Before");
    let bAction: IAction = {
      key: "beforeIndex",
      proto: action.proto,
      type: "Before",
      value: "index"
    };
    assert.deepEqual(action, bAction);
    assert.isTrue(isEqual(action, bAction));
  });


  it("ControllerResolver.getDecoratorByMappedAction", () => {
    class A {
      @Action("parent")
      actionParent() {

      }

      @Before("index")
      beforeIndex() {

      }
    }

    class B extends A {
      @Produces("application/json")
      @Action("index")
      actionIndex() {

      }
    }

    let aProvider = Metadata.verifyProvider(A);
    let bProvider = Metadata.verifyProvider(B);

    let action: IAction = controllerResolver.getMappedAction(bProvider, "index");
    let bAction: IAction = {
      key: "actionIndex",
      proto: action.proto,
      type: "Action",
      value: "index"
    };
    assert.deepEqual(action, bAction);

    let produces = controllerResolver.getDecoratorByMappedAction(bProvider, action, "Produces");
    assert.deepEqual(produces, {
        "key": "actionIndex",
        "proto": produces.proto,
        "type": "Produces",
        "value": "application/json"
      }
    );

    assert.isUndefined(controllerResolver.getDecoratorByMappedAction(bProvider, action, "Undefined"));
  });


  it("ControllerResolver.getMappedActionArguments", () => {
    class A {
      @Action("parent")
      actionParent() {

      }
    }

    class B extends A {

      constructor(private test: Logger) {
        super();
        console.log("TEST", test);
      }

      @Action("index")
      actionIndex(@Param("a") param, @Inject(Logger) logger): any {

      }
    }

    let bProvider = Metadata.verifyProvider(B);
    let action: IAction = controllerResolver.getMappedAction(bProvider, "index");
    let arg = controllerResolver.getMappedActionArguments(bProvider, action);

    assert.deepEqual(arg, [
        {
          Class: B,
          type: "Inject",
          key: "actionIndex",
          value: Logger,
          paramIndex: 1
        },
        {
          Class: B,
          type: "Param",
          key: "actionIndex",
          value: "a",
          paramIndex: 0
        }
      ]
    );

  });


  it("ControllerResolver.processAction", () => {
    let aSpy = spy(eventEmitter, "emit");

    @Controller({
      name: "root"
    })
    class A {

      @Action("index")
      @Produces("application/json")
      actionIndex(@Param("a") param, @Inject(Logger) logger, @Param("b") b, @Chain chain, @Inject(Logger) lg): any {
        return {
          param,
          logger,
          chain
        };
      }
    }

    let aProvider = Metadata.verifyProvider(A);
    let action: IAction = controllerResolver.getMappedAction(aProvider, "index");
    let chain = "__chain__";

    // create controller injector
    let injector = new Injector(null, [chain]);
    injector.set(chain, "CHAIN");

    let controller = injector.createAndResolve(aProvider, Metadata.verifyProviders([Logger]));

    let cSpy = spy(controller, "actionIndex");

    let result: any = controllerResolver.processAction(injector, aProvider, action);
    assert.isNotNull(result);
    assertSpy.calledWith(aSpy, "contentType", "application/json");
    assertSpy.calledWith(cSpy, 1, injector.get(Logger), 2, "CHAIN", injector.get(Logger));

    assert.deepEqual(result, {
      param: 1,
      logger: injector.get(Logger),
      chain: "CHAIN"
    });

  });


  it("ControllerResolver.processFilters", (done) => {

    @Filter(10)
    class AFilter implements IFilter {

      before(data: string): string | Buffer | Promise<string | Buffer> {
        return "aFilter <- " + data;
      }

      after(data: string): string | Buffer | Promise<string | Buffer> {
        return "aFilter <- " + data;
      }

    }

    @Filter(20)
    class BFilter implements IFilter {

      before(data: string): string | Buffer | Promise<string | Buffer> {
        return "bFilter <- " + data;
      }

      after(data: string): string | Buffer | Promise<string | Buffer> {
        return "bFilter <- " + data;
      }

    }

    @Controller({
      filters: [AFilter, BFilter],
      name: "root"
    })
    class A {

      @Action("index")
      @Produces("application/json")
      actionIndex(@Param("a") param, @Inject(Logger) logger, @Param("b") b, @Chain chain, @Inject(Logger) lg): any {
        return {
          param,
          logger,
          chain
        };
      }
    }

    let aProvider = Metadata.verifyProvider(A);
    let chain = "__chain__";

    // create controller injector
    let injector = new Injector(null, [chain]);
    injector.set(chain, "CHAIN");

    let metadata: IControllerMetadata = Metadata.getComponentConfig(aProvider.provide);

    let result: Promise<any> = controllerResolver.processFilters(injector, metadata, false);
    assert.instanceOf(result, Promise);
    result.then(data => {
      assert.isNotNull(data);
      assert.equal(data, "aFilter <- bFilter <- CHAIN");
      done();
    })
      .catch(done);
  });


  it("ControllerResolver.processController no action chain", (done) => {
    @Controller({
      name: "root"
    })
    class A {

      @Action("index")
      actionIndex(@Param("a") param, @Chain chain): any {
        return {
          param,
          chain
        };
      }
    }

    let aProvider = Metadata.verifyProvider(A);
    // process controller
    let result = controllerResolver.processController(new Injector(), aProvider, "index");
    assert.instanceOf(result, Promise);

    result.then(data => {
      assert.isNotNull(data);
      assert.deepEqual(data, {
        param: 1,
        chain: null
      });
      done();
    })
      .catch(done);

  });

  it("ControllerResolver.processController action chain no filter", (done) => {


    @Controller({
      name: "root"
    })
    class A {

      @BeforeEach
      actionBeforeEach(@Chain chain): any {
        return "beforeEach <- " + chain;
      }

      @Before("index")
      actionBefore(@Chain chain): any {
        return "before <- " + chain;
      }

      @Action("index")
      actionIndex(@Chain chain): any {
        return "action <- " + chain;
      }

      @After("index")
      actionAfter(@Chain chain): any {
        return "after <- " + chain;
      }

      @AfterEach
      actionAfterEach(@Chain chain): any {
        return "afterEach <- " + chain;
      }

    }

    let injector = Injector.createAndResolve(Logger, []);
    let result = fakeControllerActionCall(
      injector,
      Metadata.verifyProvider(A),
      "index"
    );
    assert.instanceOf(result, Promise);

    result.then(data => {
      assert.isNotNull(data);
      assert.deepEqual(data, "afterEach <- after <- action <- before <- beforeEach <- null");
      done();
    })
      .catch(done);

  });


  it("ControllerResolver.processController with filters", (done) => {

    @Filter(10)
    class AFilter implements IFilter {

      before(data: string): string | Buffer | Promise<string | Buffer> {
        return "aFilter <- " + data;
      }

      after(data: string): string | Buffer | Promise<string | Buffer> {
        return "aFilter <- " + data;
      }

    }

    @Filter(20)
    class BFilter implements IFilter {

      before(data: string): string | Buffer | Promise<string | Buffer> {
        return "bFilter <- " + data;
      }

      after(data: string): string | Buffer | Promise<string | Buffer> {
        return "bFilter <- " + data;
      }

    }

    @Controller({
      name: "root",
      filters: [AFilter, BFilter]
    })
    class A {

      @BeforeEach
      actionBeforeEach(@Chain chain: string): string {
        return "beforeEach <- " + chain;
      }

      @Before("index")
      actionBefore(@Chain chain: string): string {
        return "before <- " + chain;
      }

      @Action("index")
      actionIndex(@Chain chain: string): string {
        return "action <- " + chain;
      }

      @After("index")
      actionAfter(@Chain chain: string): string {
        return "after <- " + chain;
      }

      @AfterEach
      actionAfterEach(@Chain chain: string): string {
        return "afterEach <- " + chain;
      }

    }

    let injector = Injector.createAndResolve(Logger, []);
    let result = fakeControllerActionCall(
      injector,
      Metadata.verifyProvider(A),
      "index"
    );
    assert.instanceOf(result, Promise);

    result.then(data => {
      assert.isNotNull(data);
      assert.deepEqual(data, "aFilter <- bFilter <- afterEach <- after <- action <- before <- beforeEach <- aFilter <- bFilter <- null");
      done();
    })
      .catch(done);

  });


  it("ControllerResolver.processController with stopChain", (done) => {

    @Filter(10)
    class AFilter implements IFilter {

      before(data: string): string | Buffer | Promise<string | Buffer> {
        return "aFilter <- " + data;
      }

      after(data: string): string | Buffer | Promise<string | Buffer> {
        return "aFilter <- " + data;
      }

    }

    @Filter(20)
    class BFilter implements IFilter {

      before(data: string): string | Buffer | Promise<string | Buffer> {
        return "bFilter <- " + data;
      }

      after(data: string): string | Buffer | Promise<string | Buffer> {
        return "bFilter <- " + data;
      }

    }

    @Controller({
      name: "root",
      filters: [AFilter, BFilter]
    })
    class A {

      @Inject(Request)
      private request: Request;

      @BeforeEach
      actionBeforeEach(@Chain chain: string): string {
        return "beforeEach <- " + chain;
      }

      @Before("index")
      actionBefore(@Chain chain: string): string {
        return "before <- " + chain;
      }

      @Action("index")
      actionIndex(@Chain chain: string): string {

        return "action <- " + chain;
      }

      @After("index")
      actionAfter(@Chain chain: string): string {
        this.request.stopChain();
        return "after <- " + chain;
      }

      @AfterEach
      actionAfterEach(@Chain chain: string): string {
        return "afterEach <- " + chain;
      }

    }

    let injector = Injector.createAndResolve(Logger, []);
    let result = fakeControllerActionCall(
      injector,
      Metadata.verifyProvider(A),
      "index"
    );
    assert.instanceOf(result, Promise);

    result.then(data => {
      assert.isNotNull(data);
      assert.deepEqual(data, "after <- action <- before <- beforeEach <- aFilter <- bFilter <- null");
      done();
    })
      .catch(done);

  });


  it("ControllerResolver.processController with stopChain in Filter 1", (done) => {

    @Filter(10)
    class AFilter implements IFilter {

      @Inject(Request)
      private request: Request;

      before(data: string): string | Buffer | Promise<string | Buffer> {
        this.request.stopChain();
        return "aFilter <- " + data;
      }

      after(data: string): string | Buffer | Promise<string | Buffer> {
        return "aFilter <- " + data;
      }

    }

    @Filter(20)
    class BFilter implements IFilter {

      before(data: string): string | Buffer | Promise<string | Buffer> {
        return "bFilter <- " + data;
      }

      after(data: string): string | Buffer | Promise<string | Buffer> {
        return "bFilter <- " + data;
      }

    }

    @Controller({
      name: "root",
      filters: [AFilter, BFilter]
    })
    class A {

      @Inject(Request)
      private request: Request;

      @BeforeEach
      actionBeforeEach(@Chain chain: string): string {
        return "beforeEach <- " + chain;
      }

      @Before("index")
      actionBefore(@Chain chain: string): string {
        return "before <- " + chain;
      }

      @Action("index")
      actionIndex(@Chain chain: string): string {

        return "action <- " + chain;
      }

      @After("index")
      actionAfter(@Chain chain: string): string {
        this.request.stopChain();
        return "after <- " + chain;
      }

      @AfterEach
      actionAfterEach(@Chain chain: string): string {
        return "afterEach <- " + chain;
      }

    }

    let injector = Injector.createAndResolve(Logger, []);
    let result = fakeControllerActionCall(
      injector,
      Metadata.verifyProvider(A),
      "index"
    );
    assert.instanceOf(result, Promise);

    result.then(data => {
      assert.isNotNull(data);
      assert.deepEqual(data, "aFilter <- bFilter <- null");
      done();
    })
      .catch(done);
  });


  it("ControllerResolver.processController with stopChain in Filter 2", (done) => {

    @Filter(10)
    class AFilter implements IFilter {

      @Inject(Request)
      private request: Request;

      before(data: string): string | Buffer | Promise<string | Buffer> {
        this.request.stopChain();
        return "aFilter <- " + data;
      }

      after(data: string): string | Buffer | Promise<string | Buffer> {
        return "aFilter <- " + data;
      }

    }

    @Filter(20)
    class BFilter implements IFilter {

      @Inject(Request)
      private request: Request;


      before(data: string): string | Buffer | Promise<string | Buffer> {
        this.request.stopChain();
        return "bFilter <- " + data;
      }

      after(data: string): string | Buffer | Promise<string | Buffer> {
        return "bFilter <- " + data;
      }

    }

    @Controller({
      name: "root",
      filters: [AFilter, BFilter]
    })
    class A {

      @Inject(Request)
      private request: Request;

      @BeforeEach
      actionBeforeEach(@Chain chain: string): string {
        return "beforeEach <- " + chain;
      }

      @Before("index")
      actionBefore(@Chain chain: string): string {
        return "before <- " + chain;
      }

      @Action("index")
      actionIndex(@Chain chain: string): string {

        return "action <- " + chain;
      }

      @After("index")
      actionAfter(@Chain chain: string): string {
        this.request.stopChain();
        return "after <- " + chain;
      }

      @AfterEach
      actionAfterEach(@Chain chain: string): string {
        return "afterEach <- " + chain;
      }

    }

    // process controller

    let result = fakeControllerActionCall(
      new Injector,
      A,
      "index"
    );

    assert.instanceOf(result, Promise);

    result.then(resolved => {
      assert.isNotNull(resolved);
      assert.deepEqual(resolved, "bFilter <- null");
      done();
    })
      .catch(done);
  });
});
