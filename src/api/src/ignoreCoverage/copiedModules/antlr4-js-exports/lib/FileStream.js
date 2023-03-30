"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _InputStream = _interopRequireDefault(require("./InputStream.js"));
var _CharStream = _interopRequireDefault(require("./CharStream.js"));
var _fs = _interopRequireDefault(require("fs"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
/* Copyright (c) 2012-2022 The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

const isNode = typeof process !== "undefined" && process.versions != null && process.versions.node != null;
/**
 * This is an InputStream that is loaded from a file all at once
 * when you construct the object.
 */
class FileStream extends _InputStream.default {
  static fromPath(path, encoding, callback) {
    if (!isNode) throw new Error("FileStream is only available when running in Node!");
    _fs.default.readFile(path, encoding, function (err, data) {
      let is = null;
      if (data !== null) {
        is = new _CharStream.default(data, true);
      }
      callback(err, is);
    });
  }
  constructor(fileName, encoding, decodeToUnicodeCodePoints) {
    if (!isNode) throw new Error("FileStream is only available when running in Node!");
    const data = _fs.default.readFileSync(fileName, encoding || "utf-8");
    super(data, decodeToUnicodeCodePoints);
    this.fileName = fileName;
  }
}
exports.default = FileStream;