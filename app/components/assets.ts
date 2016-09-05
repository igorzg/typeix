import {Injectable} from "../../src/decorators";
/**
 * Created by igi on 17/01/16.
 */

@Injectable()
export class A{
    name: string = "aClass";
}

@Injectable()
export class Assets{
    asset: string = "aAsset";
    constructor(c: A) {
        console.log("Assets.arg", arguments);
    }
}



@Injectable()
export class B{
    bName: string = "bname";
    constructor(a: A) {
        console.log("B.arg", arguments);
    }
}

@Injectable()
export class C {
    constructor(assets: Assets) {
        console.log("C.arg", arguments);
    }
}
