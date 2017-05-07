import {assert, expect, use} from "chai";
import * as sinonChai from "sinon-chai";
import {spy, stub, assert as assertSpy} from "sinon";
import {
  multipart_1, multipart_1_contentType,
  multipart_2,
  multipart_2_contentType,
  multipart_3,
  multipart_3_contentType, multipart_4, multipart_4_contentType, multipart_5,
  multipart_5_contentType
} from "./mocks/multipart-samples";
import {MultiPart, MultiPartField, MultiPartFile} from "../parsers/multipart";

use(sinonChai);

describe("Multipart parser", () => {

  it("Parse multipart_5", () => {
    let data = new Buffer(multipart_5);
    let multipart = new MultiPart(multipart_5_contentType);
    let parsed = multipart.parse(data);
    assert.isDefined(parsed);
    assert.isTrue(parsed.length === 5);

    let a1 = <MultiPartField> parsed.shift();
    let a2 = <MultiPartFile> parsed.shift();
    let a3 = <MultiPartFile> parsed.shift();
    let a4 = <MultiPartFile> parsed.shift();
    let a5 = <MultiPartFile> parsed.shift();
    assert.instanceOf(a1, MultiPartField);
    assert.instanceOf(a2, MultiPartFile);
    assert.instanceOf(a3, MultiPartFile);
    assert.instanceOf(a4, MultiPartFile);
    assert.instanceOf(a5, MultiPartFile);

    assert.equal(a1.getFieldName(), "title");
    assert.equal(a1.getFieldValue(), "foofoo");

    assert.equal(a2.getFieldName(), "upload");
    assert.equal(a2.getFileName(), "blah1.txt");
    assert.equal(a2.getBuffer().toString(), "hi1\r\n");


    assert.equal(a3.getFieldName(), "upload");
    assert.equal(a3.getFileName(), "blah2.txt");
    assert.equal(a3.getBuffer().toString(), "hi2\r\n");

    assert.equal(a4.getFieldName(), "upload");
    assert.equal(a4.getFileName(), "blah3.txt");
    assert.equal(a4.getBuffer().toString(), "hi3\r\n");

    assert.equal(a5.getFieldName(), "upload");
    assert.equal(a5.getFileName(), "blah4.txt");
    assert.equal(a5.getBuffer().toString(), "hi4\r\n");

  });


  it("Parse multipart_4", () => {
    let data = new Buffer(multipart_4);
    let multipart = new MultiPart(multipart_4_contentType);
    let parsed = multipart.parse(data);

    assert.isDefined(parsed);
    assert.isTrue(parsed.length === 2);

    let a1 = <MultiPartField> parsed.shift();
    let a2 = <MultiPartField> parsed.shift();
    assert.equal(a1.getFieldName(), "title");
    assert.equal(a1.getFieldValue(), "foofoo1\r\n");

    assert.equal(a2.getFieldName(), "text");
    assert.equal(a2.getFieldValue(), "hi1\r\n");

  });


  it("Parse multipart_3", () => {
    let data = new Buffer(multipart_3);
    let multipart = new MultiPart(multipart_3_contentType);
    let parsed = multipart.parse(data);
    assert.isDefined(parsed);
    let a2 = <MultiPartFile> parsed.shift();

    assert.equal(a2.getFieldName(), "image");
    assert.equal(a2.getFileName(), "测试文档");
    assert.equal(a2.getBuffer().toString(), "");
  });

  it("Parse multipart_2", () => {
    let data = new Buffer(multipart_2);
    let multipart = new MultiPart(multipart_2_contentType);
    let parsed = multipart.parse(data);
    assert.isDefined(parsed);

    let a1 = <MultiPartField> parsed.shift();
    let a2 = <MultiPartField> parsed.shift();
    let a3 = <MultiPartFile> parsed.shift();
    let a4 = <MultiPartFile> parsed.shift();
    assert.instanceOf(a1, MultiPartField);
    assert.instanceOf(a2, MultiPartField);
    assert.instanceOf(a3, MultiPartFile);
    assert.instanceOf(a4, MultiPartFile);

    assert.equal(a1.getFieldName(), "file_name_0");
    assert.equal(a1.getFieldValue(), "super alpha file");

    assert.equal(a2.getFieldName(), "file_name_1");
    assert.equal(a2.getFieldValue(), "super beta file");

    assert.equal(a3.getFieldName(), "upload_file_0");
    assert.equal(a3.getFileName(), "1k_a.dat");
    assert.equal(a3.getBuffer().toString(), "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA");

    assert.equal(a4.getFieldName(), "upload_file_1");
    assert.equal(a4.getFileName(), "1k_b.dat");
    assert.equal(a4.getBuffer().toString(), "BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB");

  });


  it("Parse multipart_1", () => {
    let data = new Buffer(multipart_1);
    let multipart = new MultiPart(multipart_1_contentType);
    let parsed = multipart.parse(data);
    assert.isDefined(parsed);


    let a1 = <MultiPartField> parsed.shift();
    let a2 = <MultiPartField> parsed.shift();
    let a3 = <MultiPartField> parsed.shift();

    assert.equal(a1.getFieldName(), "cont");
    assert.equal(a1.getFieldValue(), "some random content");

    assert.equal(a2.getFieldName(), "pass");
    assert.equal(a2.getFieldValue(), "some random pass");

    assert.equal(a3.getFieldName(), "bit");
    assert.equal(a3.getFieldValue(), "2");

  });
});
