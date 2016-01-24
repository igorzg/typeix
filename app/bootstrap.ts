import { bootstrap, Bootstrap, RouteRule, Router } from '../core';
import { Assets, A, B, C } from './components/assets';

@Bootstrap()
export class Application {
    constructor(assets: Assets, router: Router) {

        console.log('arguments', arguments);
    }
}

bootstrap(Application);