
import {Assets, A, B, C} from "./components/assets";
import {Inject, Module} from "../src/injector/decorators";
import {Logger} from "../src/logger/logger";
import {Router, Methods} from "../src/router/router";

@Module({
  providers: [A, B, Assets, C]
})
export class Application {

  @Inject(Assets) z;

  constructor(assets: Assets,
              logger: Logger,
              router: Router,
              @Inject(Assets) a) {

    logger.enable();
    logger.printToConsole();
    logger.info("Application.arg", arguments);

    router.addRules([
      {
        methods: [Methods.GET],
        route: "home/index",
        url: "/"
      }
    ]);
  }

  afterConstruct() {
    console.log("After construct", this.z);
  }
}
