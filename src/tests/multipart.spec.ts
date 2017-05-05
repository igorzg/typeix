import {assert, expect, use} from "chai";
import * as sinonChai from "sinon-chai";
import {spy, stub, assert as assertSpy} from "sinon";
import {Injector} from "../injector/injector";
import {
  multipart_1, multipart_1_contentType,
  multipart_2,
  multipart_2_contentType,
  multipart_3,
  multipart_3_contentType, multipart_4, multipart_4_contentType, multipart_5,
  multipart_5_contentType
} from "./mocks/multipart-samples";
import {MultiPart} from "../parsers/multipart";

use(sinonChai);

describe("Multipart parser", () => {

  it("Parse multipart_5", () => {
    let data = new Buffer(multipart_5);
    let multipart = new MultiPart(multipart_5_contentType);
    let parsed = multipart.parse(data);
    console.log(parsed);
  });


  it("Parse multipart_4", () => {
    let data = new Buffer(multipart_4);
    let multipart = new MultiPart(multipart_4_contentType);
    let parsed = multipart.parse(data);
    console.log(parsed);
  });


  it("Parse multipart_3", () => {
    let data = new Buffer(multipart_3);
    let multipart = new MultiPart(multipart_3_contentType);
    let parsed = multipart.parse(data);
    console.log(parsed);
  });

  it("Parse multipart_2", () => {
    let data = new Buffer(multipart_2);
    let multipart = new MultiPart(multipart_2_contentType);
    let parsed = multipart.parse(data);
    console.log(parsed);
  });


  it("Parse multipart_1", () => {
    let data = new Buffer(multipart_1);
    let multipart = new MultiPart(multipart_1_contentType);
    let parsed = multipart.parse(data);
    console.log(parsed);
  });
});
