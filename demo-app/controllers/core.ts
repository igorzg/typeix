import {Assets} from "../components/assets";
import {
  Inject,
  Produces,
  Action,
  Controller,
  Param,
  RequestReflection,
  OnError,
  BeforeEach,
  Chain
} from "typeix";
import {lookup} from "mime";
import {Cache} from "../filters/cache";
/**
 * Controller example
 * @constructor
 * @function
 * @name CoreController
 *
 * @description
 * Define controller, assign action and inject your services.
 * Each request create new instance of controller, your Injected type is injected by top level injector if is not defined
 * as local instance as providers to this controllers
 */
@Controller({
  name: "core",
  filters: [Cache],
  providers: [] // type of local instances within new request since controller is instanciated on each request
})
export class CoreController {

  /**
   * @param {Assets} assetLoader
   * @description
   * Custom asset loader service
   */
  @Inject(Assets)
  assetLoader: Assets;
  /**
   * @param {RequestReflection} request
   * @description
   * Request reflection
   */
  @Inject(RequestReflection)
  request: RequestReflection;

  /**
   * @function
   * @name fileLoadAction
   *
   * @description
   * This action loads file from disk
   * \@Produces("image/x-icon") -> content type header
   */
  @Produces("image/x-icon")
  @Action("favicon")
  faviconLoader(): Promise<Buffer> {
    return this.fileLoadAction("favicon.ico");
  }

  /**
   * @function
   * @name fileLoadAction
   *
   * @description
   * This action loads file from disk
   *
   */
  @Action("assets")
  @OnError(500, JSON.stringify({message: "File don't exists"}))
  fileLoadAction(@Param("file") file: string): Promise<Buffer> {
    let type = lookup(Assets.publicPath(file));
    this.request.setContentType(type);
    return this.assetLoader.load(file);
  }

  /**
   * @function
   * @name BeforeEach
   *
   * @description
   * before each
   *
   */
  @BeforeEach()
  beforeEachAction(@Chain() data: string): string {
    return "Before each core <- " + data;
  }

}
