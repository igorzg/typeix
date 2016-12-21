import {Module, Logger, Inject, IAfterConstruct, Router, Methods} from "typeix";
import {HomeController} from "./controllers/home";
/**
 * Application entry point
 * @constructor
 * @function
 * @name Application
 *
 * @description
 * \@Module is used to define application entry point class
 */
@Module({
  name: "admin",
  controllers: [HomeController],
})
export class AdminModule implements IAfterConstruct {

  /**
   * @param {Logger} logger
   * @description
   * Logger service
   */
  @Inject(Logger)
  logger: Logger;

  /**
   * @param {Router} router
   * @description
   * Router service
   */
  @Inject(Router)
  router: Router;

  /**
   * @function
   * @name Application#afterConstruct
   *
   * @description
   * After construct use injected values to define some behavior at entry point
   * Defining main route, all routes are processed
   */
  afterConstruct() {

    this.logger.info("Admin module", this);
    this.router.addRules([
      {
        methods: [Methods.GET],
        route: "admin/home/index",
        url: "/admin"
      }
    ]);

  }
}
