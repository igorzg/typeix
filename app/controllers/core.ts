import {Inject, Controller} from "../../src/injector/decorators";
import {A} from "../components/assets";

@Controller({
  name: "core"
})
export class CoreController {

  @Inject(A) awe;

  // @BeforeAll
  async beforeIndex(@Inject(A) c) {
    let a = await 1;

    return [a, c];
  }

  // @Action('index')
  actionIndex(value, @Inject("a") c): string {

    return value;

  }

}
