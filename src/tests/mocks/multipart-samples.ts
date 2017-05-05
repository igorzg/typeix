/**
 * Created by igorivanovic on 05.05.17.
 */

export const multipart_1 = ["------WebKitFormBoundaryTB2MiQ36fnSJlrhY",
  "Content-Disposition: form-data; name=\"cont\"",
  "",
  "some random content",
  "------WebKitFormBoundaryTB2MiQ36fnSJlrhY",
  "Content-Disposition: form-data; name=\"pass\"",
  "",
  "some random pass",
  "------WebKitFormBoundaryTB2MiQ36fnSJlrhY",
  "Content-Disposition: form-data; name=\"bit\"",
  "",
  "2",
  "------WebKitFormBoundaryTB2MiQ36fnSJlrhY--"
].join("\r\n");

export const multipart_1_contentType = "multipart/form-data; boundary=----WebKitFormBoundaryTB2MiQ36fnSJlrhY";


export const multipart_2 = ["-----------------------------paZqsnEHRufoShdX6fh0lUhXBP4k",
  "Content-Disposition: form-data; name=\"file_name_0\"",
  "",
  "super alpha file",
  "-----------------------------paZqsnEHRufoShdX6fh0lUhXBP4k",
  "Content-Disposition: form-data; name=\"file_name_1\"",
  "",
  "super beta file",
  "-----------------------------paZqsnEHRufoShdX6fh0lUhXBP4k",
  "Content-Disposition: form-data; name=\"upload_file_0\"; filename=\"1k_a.dat\"",
  "Content-Type: application/octet-stream",
  "",
  "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
  "-----------------------------paZqsnEHRufoShdX6fh0lUhXBP4k",
  "Content-Disposition: form-data; name=\"upload_file_1\"; filename=\"1k_b.dat\"",
  "Content-Type: application/octet-stream",
  "",
  "BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB",
  "-----------------------------paZqsnEHRufoShdX6fh0lUhXBP4k--"
].join("\r\n");

export const multipart_2_contentType = "multipart/form-data; boundary=---------------------------paZqsnEHRufoShdX6fh0lUhXBP4k";


export const multipart_3 = [
  "--893e5556-f402-4fec-8180-c59333354c6f\r\n" +
  "Content-Disposition: form-data; name=\"image\"; filename*=utf-8''%E6%B5%8B%E8%AF%95%E6%96%87%E6%A1%A3\r\n" +
  "\r\n" +
  "\r\n" +
  "--893e5556-f402-4fec-8180-c59333354c6f--\r\n"
].join("\r\n");

export const multipart_3_contentType = "multipart/form-data; boundary=893e5556-f402-4fec-8180-c59333354c6f";


export const multipart_4 = [
  "------WebKitFormBoundaryvfUZhxgsZDO7FXLF",
  "Content-Disposition: form-data; name=\"title\"",
  "",
  "foofoo",
  "",
  "------WebKitFormBoundaryvfUZhxgsZDO7FXLF",
  "Content-Disposition: form-data; name=\"text\"",
  "",
  "hi1",
  "",
  "------WebKitFormBoundaryvfUZhxgsZDO7FXLF"
].join("\r\n");
export const multipart_4_contentType = "multipart/form-data; boundary=----WebKitFormBoundaryvfUZhxgsZDO7FXLF";



export const multipart_5 =  "------WebKitFormBoundaryvfUZhxgsZDO7FXLF\r\n" +
"Content-Disposition: form-data; name=\"title\"\r\n" +
"\r\n" +
"foofoo" +
"\r\n" +
"------WebKitFormBoundaryvfUZhxgsZDO7FXLF\r\n" +
"Content-Disposition: form-data; name=\"upload\"; filename=\"blah1.txt\"\r\n" +
"Content-Type: text/plain\r\n" +
"\r\n" +
"hi1\r\n" +
"\r\n" +
"------WebKitFormBoundaryvfUZhxgsZDO7FXLF\r\n" +
"Content-Disposition: form-data; name=\"upload\"; filename=\"blah2.txt\"\r\n" +
"Content-Type: text/plain\r\n" +
"\r\n" +
"hi2\r\n" +
"\r\n" +
"------WebKitFormBoundaryvfUZhxgsZDO7FXLF\r\n" +
"Content-Disposition: form-data; name=\"upload\"; filename=\"blah3.txt\"\r\n" +
"Content-Type: text/plain\r\n" +
"\r\n" +
"hi3\r\n" +
"\r\n" +
"------WebKitFormBoundaryvfUZhxgsZDO7FXLF\r\n" +
"Content-Disposition: form-data; name=\"upload\"; filename=\"blah4.txt\"\r\n" +
"Content-Type: text/plain\r\n" +
"\r\n" +
"hi4\r\n" +
"\r\n" +
"------WebKitFormBoundaryvfUZhxgsZDO7FXLF--\r\n";

export const multipart_5_contentType = "multipart/form-data; boundary=----WebKitFormBoundaryvfUZhxgsZDO7FXLF";
