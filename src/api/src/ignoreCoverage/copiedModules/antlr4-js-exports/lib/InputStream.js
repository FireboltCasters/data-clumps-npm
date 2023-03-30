"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _CharStream = _interopRequireDefault(require("./CharStream.js"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
/* Copyright (c) 2012-2022 The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

/**
 * @deprecated Use CharStream instead
*/
class InputStream extends _CharStream.default {
  constructor(data, decodeToUnicodeCodePoints) {
    super(data, decodeToUnicodeCodePoints);
  }
}
exports.default = InputStream;