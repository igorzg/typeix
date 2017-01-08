import {Assets} from "../components/assets";
import {
  Inject,
  Produces,
  Action,
  Controller,
  Param,
  Request,
  OnError
} from "typeix";
import {lookup} from "mime";
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
   * @param {Request} request
   * @description
   * ControllerResolver reflection
   */
  @Inject(Request)
  request: Request;

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

}
