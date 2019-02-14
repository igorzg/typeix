import {IncomingMessage, ServerResponse} from "http";
import {getMethodName} from "../router/router";
import {isArray, isFalsy, isPresent} from "../core";
import {Logger} from "../logger/logger";
import {Injector} from "../injector/injector";
import {IProvider} from "../interfaces/iprovider";
import {EventEmitter} from "events";
import {Url} from "url";
import {IResolvedRoute} from "../interfaces/iroute";
import {HttpError} from "../error";
import {Injectable} from "../decorators/injectable";
import {Inject} from "../decorators/inject";
import {FUNCTION_KEYS, FUNCTION_PARAMS, Metadata} from "../injector/metadata";
import {IControllerMetadata} from "../interfaces/icontroller";
import {IAction} from "../interfaces/iaction";
import {IParam} from "../interfaces/iparam";
import {Status} from "./status-code";
import {Request} from "./request";
import {ERROR_KEY} from "./request-resolver";
import {Context} from  "aws-lambda";

const CHAIN_KEY = "__chain__";

/**
 * @since 1.0.0
 * @class
 * @name Request
 * @constructor
 * @description
 * ControllerResolver is responsible for handling router result and processing all requests in system
 * This component is used internally by framework
 *
 * @private
 */
@Injectable()
export class ControllerResolver {

  /**
   * @param IncomingMessage
   * @description
   * Value provided by injector which handles request input
   */
  @Inject("request")
  private request: IncomingMessage;

  /**
   * @param ServerResponse
   * @description
   * Value provided by injector which handles response output
   */
  @Inject("response")
  private response: ServerResponse;

  /**
   * @param {Array<Buffer>} data
   * @description
   * Data received by client on POST, PATCH, PUT requests
   */
  @Inject("data")
  private data: Array<Buffer>;

  /**
   * @param {Injector} Injector
   * @description
   * Injector which created request
   */
  @Inject(Injector)
  private injector: Injector;

  /**
   * @param {Logger} logger
   * @description
   * Provided by injector
   */
  @Inject(Logger)
  private logger: Logger;
  /**
   * @param {EventEmitter} eventEmitter
   * @description
   * Responsible for handling events
   */
  @Inject(EventEmitter)
  private eventEmitter: EventEmitter;
  /**
   * @param {string} id
   * @description
   * UUID identifier of request
   */
  @Inject("UUID")
  private id: string;
  /**
   * @param {Url} url
   * @description
   * Parsed request url
   */
  @Inject("url")
  private url: Url;

  /**
   * @param {IProvider} controllerProvider
   * @description
   * Injector
   */
  @Inject("controllerProvider")
  private controllerProvider: IProvider;
  /**
   * @param {actionName} actionName:
   * @description
   * Action name
   */
  @Inject("actionName")
  private actionName: string;
  /**
   * @param {boolean} isChainStopped
   * @description
   * When chain is stopped framework will not propagate actions
   */
  @Inject("isChainStopped", true)
  private isChainStopped: boolean;

  /**
   * @param {IResolvedRoute} resolvedRoute
   * @description
   * Resolved route from injector
   */
  @Inject("resolvedRoute")
  private resolvedRoute: IResolvedRoute;

  /**
   * @param {any} event
   * @description
   * Lambda execution preprocessed event
   */
  @Inject("event")
  protected readonly event: any;

  /**
   * @param {Context} Context
   * @description
   * Lambda execution Context if present
   */
  @Inject("context")
  protected readonly context: Context;


  /**
   * @since 1.0.0
   * @function
   * @name Request#isControllerPrototypeOf
   * @private
   * @description
   * Validate controller inheritance
   */
  static isControllerInherited(a: Function, b: Function) {
    return b.isPrototypeOf(a.prototype) || Object.is(a.prototype, b);
  }

  /**
   * @since 1.0.0
   * @function
   * @name Request#stopChain
   * @private
   * @description
   * Stop action chain
   */
  stopChain() {
    this.isChainStopped = true;
  }

  /**
   * @since 1.0.0
   * @function
   * @name Request#destroy
   * @private
   * @description
   * Destroy all references to free memory
   */
  destroy() {
    this.eventEmitter.emit("destroy");
    this.eventEmitter.removeAllListeners();
  }

  /**
   * @since 1.0.0
   * @function
   * @name Request#getEventEmitter
   * @private
   *
   * @description
   * Get request event emitter
   */
  getEventEmitter(): EventEmitter {
    return this.eventEmitter;
  }

  /**
   * @since 1.0.0
   * @function
   * @name Request#getIncomingMessage
   * @private
   *
   * @description
   * Get IncomingMessage object
   */
  getIncomingMessage(): IncomingMessage {
    return this.request;
  }

  getResolvedRoute(): IResolvedRoute {
    return this.resolvedRoute;
  }

  /**
   * @since 2.0.5
   * @function
   * @name Request#getContext
   *
   * @description
   * returns the passed in context in case of lamda environment
   */

  getEvent(): any {
    return this.event;
  }

  /**
   * @since 2.0.5
   * @function
   * @name Request#getContext
   *
   * @description
   * returns the passed in context in case of lamda environment
   */

  getContext(): Context {
    return this.context;
  }

  getId(): string {
    return this.id;
  }

  getBody(): Array<Buffer> {
    return this.data;
  }

  /**
   * @since 1.0.0
   * @function
   * @name Request#getServerResponse
   * @private
   *
   * @description
   * Get ServerResponse object
   */
  getServerResponse(): ServerResponse {
    return this.response;
  }

  /**
   * @since 1.0.0
   * @function
   * @name Request#process
   * @private
   * @description
   * Process request logic
   */
  process(): Promise<string | Buffer> {

    // destroy on end
    this.response.once("finish", () => this.destroy());
    // destroy if connection was terminated before end
    this.response.once("close", () => this.destroy());

    // set request reflection
    const reflectionInjector = Injector.createAndResolveChild(this.injector, Request, [
      {provide: "controllerResolver", useValue: this}
    ]);

    return this.processController(reflectionInjector, this.controllerProvider, this.actionName);
  }


  /**
   * @since 1.0.0
   * @function
   * @name Request#hasMappedAction
   * @private
   * @description
   * Check if controller has mapped action
   */
  hasMappedAction(controllerProvider: IProvider, actionName: String, name: String = "Action"): boolean {
    let mappings = Metadata.getMetadata(controllerProvider.provide.prototype, FUNCTION_KEYS)
      .filter((item: IAction) => ControllerResolver.isControllerInherited(controllerProvider.provide, item.proto));

    return isPresent(mappings.find(item => item.type === name && item.value === actionName));
  }

  /**
   * @since 1.0.0
   * @function
   * @name Request#getMappedHook
   * @private
   * @description
   * Returns a mapped action metadata
   */
  getMappedAction(controllerProvider: IProvider, actionName: String, name: String = "Action"): IAction {
    // get mappings from controller
    let mappings = Metadata
      .getMetadata(controllerProvider.provide.prototype, FUNCTION_KEYS)
      .filter((item: IAction) =>
        item.type === name && item.value === actionName &&
        ControllerResolver.isControllerInherited(controllerProvider.provide, item.proto)
      );

    let mappedAction;
    // search mapped on current controller
    if (mappings.length > 0) {
      mappedAction = mappings.find(item => item.className === Metadata.getName(controllerProvider.provide));
    }
    // get first parent one from inheritance
    if (!isPresent(mappedAction)) {
      mappedAction = mappings.pop();
    }
    // check if action is present
    if (!isPresent(mappedAction)) {
      throw new HttpError(Status.Bad_Request, `@${name}("${actionName}") is not defined on controller ${Metadata.getName(controllerProvider.provide)}`, {
        actionName,
        name,
        resolvedRoute: this.resolvedRoute
      });
    }

    return mappedAction;
  }

  /**
   * @since 1.0.0
   * @function
   * @name Request#getDecoratorByMappedAction
   * @private
   * @description
   * Get param decorator by mapped action
   */
  getDecoratorByMappedAction(controllerProvider: IProvider, mappedAction: any, paramName: string): any {
    // get mappings from controller
    let mappings = Metadata.getMetadata(controllerProvider.provide.prototype, FUNCTION_KEYS);
    return mappings.find((item: IAction) =>
      item.type === paramName && item.key === mappedAction.key &&
      ControllerResolver.isControllerInherited(controllerProvider.provide, item.proto)
    );
  }

  /**
   * @since 1.0.0
   * @function
   * @name Request#getMappedActionArguments
   * @private
   * @description
   * Get list of action arguments
   */
  getMappedActionArguments(controllerProvider: IProvider, mappedAction: any): Array<any> {
    // get mappings from controller
    let mappings = Metadata.getMetadata(controllerProvider.provide.prototype, FUNCTION_PARAMS);
    return mappings.filter((item: IParam) => item.key === mappedAction.key);
  }


  /**
   * @since 1.0.0
   * @function
   * @name Request#processAction
   * @private
   * @description
   * Process mapped action
   */
  processAction(injector: Injector,
                controllerProvider: IProvider,
                mappedAction: IAction): string | Buffer {
    // get controller instance
    let controllerInstance = injector.get(controllerProvider.provide);
    // get action
    let action = controllerInstance[mappedAction.key].bind(controllerInstance);
    // content type
    let contentType: IParam = this.getDecoratorByMappedAction(controllerProvider, mappedAction, "Produces");

    if (isPresent(contentType)) {
      this.getEventEmitter().emit("contentType", contentType.value);
    }
    // resolve action params
    let actionParams = [];
    let params: Array<any> = this.getMappedActionArguments(controllerProvider, mappedAction);

    if (isPresent(params)) {
      // make sure params are sorted correctly :)
      params.sort((a, b) => {
        if (a.paramIndex > b.paramIndex) {
          return 1;
        } else if (a.paramIndex < b.paramIndex) {
          return -1;
        }
        return 0;
      });
      // push action params
      params.forEach(param => {
        switch (param.type) {
          case "Param":
            if (isPresent(this.resolvedRoute.params) && this.resolvedRoute.params.hasOwnProperty(param.value)) {
              actionParams.push(this.resolvedRoute.params[param.value]);
            } else {
              actionParams.push(null);
            }
            break;
          case "Chain":
            actionParams.push(injector.get(CHAIN_KEY));
            break;
          case "Inject":
            actionParams.push(injector.get(param.value));
            break;
          case "ErrorMessage":
            actionParams.push(injector.get(ERROR_KEY));
            break;
        }
      });
    }

    return action.apply(controllerInstance, actionParams);
  }

  /**
   * @since 1.0.0
   * @function
   * @name Request#processControllerFilters
   * @private
   * @description
   * Process controller filters
   */
  async processFilters(injector: Injector,
                       metadata: IControllerMetadata,
                       isAfter: boolean): Promise<any> {

    let filters = metadata.filters.filter(item => {
      let filterMetadata = Metadata.getComponentConfig(item);
      if (isPresent(filterMetadata)) {
        return (
          filterMetadata.route === "*" ||
          filterMetadata.route === this.resolvedRoute.route ||
          filterMetadata.route === (metadata.name + "/*")
        );
      }
      return false;
    })
      .sort((aItem, bItem) => {
        let a: any = Metadata.getComponentConfig(aItem);
        let b: any = Metadata.getComponentConfig(bItem);
        if (a.priority > b.priority) {
          return -1;
        } else if (a.priority < b.priority) {
          return 1;
        }
        return 0;
      });

    for (let Class of filters) {
      let filterInjector = Injector.createAndResolveChild(injector, Class, []);
      let filter = filterInjector.get(Class);

      if (isFalsy(this.isChainStopped)) {
        if (!isAfter) {
          let start = Date.now();
          let result = await filter.before(injector.get(CHAIN_KEY));
          injector.set(CHAIN_KEY, result);
          this.benchmark(`Filter.before: ${Metadata.getName(filter, "on filter ")}`, start);
        } else {
          let start = Date.now();
          let result = await filter.after(injector.get(CHAIN_KEY));
          injector.set(CHAIN_KEY, result);
          this.benchmark(`Filter.after: ${Metadata.getName(filter, "on filter ")}`, start);
        }
      }

      filterInjector.destroy();
    }

    return await injector.get(CHAIN_KEY);
  }

  /**
   * @since 1.0.0
   * @function
   * @name Request#processController
   * @private
   * @description
   * Handle controller instance
   */
  async processController(reflectionInjector: Injector,
                          controllerProvider: IProvider,
                          actionName: String): Promise<any> {
    // get controller metadata
    let metadata: IControllerMetadata = Metadata.getComponentConfig(controllerProvider.provide);
    let providers: Array<IProvider> = Metadata.verifyProviders(metadata.providers);
    // limit controller api
    let limitApi = ["request", "response", "controllerProvider", "modules"];
    limitApi.forEach(item => providers.push({provide: item, useValue: {}}));
    // benchmark
    let requestStart = Date.now();
    // create controller injector
    let injector = new Injector(reflectionInjector, [CHAIN_KEY]);

    // initialize controller
    injector.createAndResolve(
      controllerProvider,
      Metadata.verifyProviders(providers)
    );

    // set default chain key
    injector.set(CHAIN_KEY, null);

    // process filters
    if (isArray(metadata.filters)) {
      // set filter result
      injector.set(CHAIN_KEY, await this.processFilters(injector, metadata, false));
    }

    // process @BeforeEach action
    if (this.hasMappedAction(controllerProvider, null, "BeforeEach") && isFalsy(this.isChainStopped)) {
      let start = Date.now();
      let result = await this.processAction(
        injector,
        controllerProvider,
        this.getMappedAction(controllerProvider, null, "BeforeEach")
      );

      injector.set(CHAIN_KEY, result);
      this.benchmark("BeforeEach", start);
    }

    // process @Before action
    if (this.hasMappedAction(controllerProvider, actionName, "Before") && isFalsy(this.isChainStopped)) {
      let start = Date.now();
      let result = await this.processAction(
        injector,
        controllerProvider,
        this.getMappedAction(controllerProvider, actionName, "Before")
      );
      injector.set(CHAIN_KEY, result);
      this.benchmark("Before", start);
    }

    // Action
    if (isFalsy(this.isChainStopped)) {
      let start = Date.now();
      let result = await this.processAction(
        injector,
        controllerProvider,
        this.getMappedAction(controllerProvider, actionName)
      );
      injector.set(CHAIN_KEY, result);
      this.benchmark("Action", start);
    }

    // process @After action
    if (this.hasMappedAction(controllerProvider, actionName, "After") && isFalsy(this.isChainStopped)) {
      let start = Date.now();
      let result = await this.processAction(
        injector,
        controllerProvider,
        this.getMappedAction(controllerProvider, actionName, "After")
      );
      injector.set(CHAIN_KEY, result);
      this.benchmark("After", start);
    }

    // process @AfterEach action
    if (this.hasMappedAction(controllerProvider, null, "AfterEach") && isFalsy(this.isChainStopped)) {
      let start = Date.now();
      let result = await this.processAction(
        injector,
        controllerProvider,
        this.getMappedAction(controllerProvider, null, "AfterEach")
      );
      injector.set(CHAIN_KEY, result);
      this.benchmark("AfterEach", start);
    }

    if (isFalsy(this.isChainStopped) && isArray(metadata.filters)) {
      // set filter result
      injector.set(CHAIN_KEY, await this.processFilters(injector, metadata, true));
    }

    this.benchmark("Request", requestStart);

    // render action call
    return await injector.get(CHAIN_KEY);
  }

  /**
   * @since 1.0.0
   * @function
   * @name Request#benchmark
   * @private
   * @description
   * Print benchmark
   */
  private benchmark(message: string, start: number) {
    this.logger.benchmark(`${message}: ${(Date.now() - start)}ms`, {
      method: getMethodName(this.resolvedRoute.method),
      route: this.resolvedRoute.route,
      url: this.request.url
    });
  }
}
