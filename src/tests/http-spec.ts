import {assert, use} from "chai";
import * as sinonChai from "sinon-chai";
import {assert as assertSpy, spy, stub} from "sinon";
import {Injector} from "../injector/injector";
import {createServer, IncomingMessage, Server, ServerResponse} from "http";
import {Logger} from "../logger/logger";
import {isArray, isFunction, isPresent, isString} from "../core";
import {BOOTSTRAP_MODULE, createModule, fireRequest, getModule} from "./bootstrap";
import {IModule, IModuleMetadata} from "../interfaces/imodule";
import {Metadata} from "../injector/metadata";
import * as WebSocket from "ws";
import {fireWebSocket, IWebSocketResult} from "./socket";
import {HttpError} from "../error";
import { Context, Callback, APIGatewayEventRequestContext } from "aws-lambda";
import {httpVerb} from "./http-verbs"
import * as requestResponse  from "aws-lambda-create-request-response";
