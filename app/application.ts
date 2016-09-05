import {Module, Router} from "../core";
import {Assets, A, B, C} from "./components/assets";
import {Inject} from "../src/decorators";
import {Logger} from "../src/logger/logger";

@Module({
  port: 9000,
  providers: [A, B, Assets, C]
})
export class Application {

  @Inject(Assets) z;

  constructor(assets: Assets,
              router: Router,
              logger: Logger,
              @Inject(Assets) a) {
    logger.enable();
    logger.printToConsole();
    logger.info("Application.arg", arguments);
  }

  afterConstruct() {
    console.log("After construct", this.z);
  }
}
