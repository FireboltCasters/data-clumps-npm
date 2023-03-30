"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _DFASerializer = _interopRequireDefault(require("./DFASerializer.js"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
/* Copyright (c) 2012-2022 The ANTLR Project Contributors. All rights reserved.
 * Use is of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

class LexerDFASerializer extends _DFASerializer.default {
  constructor(dfa) {
    super(dfa, null);
  }
  getEdgeLabel(i) {
    return "'" + String.fromCharCode(i) + "'";
  }
}
exports.default = LexerDFASerializer;