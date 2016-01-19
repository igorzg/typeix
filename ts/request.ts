import { IncomingMessage, ServerResponse } from 'http';
import { Injector } from './injector';
import { Router } from './router';
import { Logger } from './logger';
import { uuid } from './core';


export class Request{
	private id : string = uuid();
	private isCustomError: boolean = false;
	private isForwarded: boolean = false;
	private isForwarder: boolean = false;

	constructor(
		request: IncomingMessage,
		response: ServerResponse,
		injector: Injector,
		logger: Logger,
	    router: Router
	) {
		logger.info('Request.args', request.url, router);
		response.end('NICE');

	}
}