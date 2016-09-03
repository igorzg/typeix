import {Bootstrap, Router} from "../core";
import {Assets, A, B, C} from "./components/assets";
import {Inject} from "../ts/decorators";

@Bootstrap({
  hostname: "localhost",
  port: 9000,
  providers: [A, B, Assets, C]
})
export class Application {

  @Inject(Assets) z;

  constructor(assets: Assets,
              router: Router,
              @Inject(Assets) a) {

    console.log("Application.arg", arguments);
  }

  afterConstruct() {
    console.log("After construct", this.z);
  }
}
