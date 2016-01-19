import { bootstrap, Bootstrap } from '../core';
import { Assets, A, B, C } from './components/assets';

@Bootstrap()
export class Application {
    constructor(assets: Assets, b: A, c: B, a: C) {
        console.log('arguments', arguments);
    }
}

bootstrap(Application);