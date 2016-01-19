/**
 * Created by igi on 17/01/16.
 */
import { Component } from '../../core';

@Component()
export class A{
    name: string = 'aClass';
}

@Component({
    name: 'assets'
})
export class Assets{
    asset: string = 'aAsset';
    constructor(c: A) {
        console.log('Assets.arg', arguments);
    }
}



@Component()
export class B{
    bName: string = 'bname';
    constructor(a: A) {
        console.log('B.arg', arguments);
    }
}

@Component()
export class C {
    constructor(assets: Assets) {
        console.log('C.arg', arguments);
    }
}