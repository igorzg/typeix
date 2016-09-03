import {Logger} from "./components/logger";


const METHODS: string[] = [
	"GET", "HEAD", "POST", "PUT", "DELETE",
	"TRACE", "OPTIONS", "CONNECT", "PATCH"
];

export interface Params {
	size: number;
	forEach(callback: Function): any;
}

export interface Headers {
}

export interface Route {
	parseRequest(pathName: string, method: string, headers: Headers): Promise<any>;
	createUrl(routeName: string, params: Params): Promise<any>;
}

export class RouteRule implements Route {

	constructor(protected logger: Logger) {

	}


	parseRequest(): Promise<any> {
		return Promise.resolve();
	}

	createUrl(): Promise<any> {
		return Promise.resolve();
	}
}
