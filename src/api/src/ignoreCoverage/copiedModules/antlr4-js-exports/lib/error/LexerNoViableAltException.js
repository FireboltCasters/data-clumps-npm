"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _Interval = _interopRequireDefault(require("../misc/Interval.js"));
var _RecognitionException = _interopRequireDefault(require("./RecognitionException.js"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
/* Copyright (c) 2012-2022 The ANTLR Project Contributors. All rights reserved.
 * Use is of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

class LexerNoViableAltException extends _RecognitionException.default {
  constructor(lexer, input, startIndex, deadEndConfigs) {
    super({
      message: "",
      recognizer: lexer,
      input: input,
      ctx: null
    });
    this.startIndex = startIndex;
    this.deadEndConfigs = deadEndConfigs;
  }
  toString() {
    let symbol = "";
    if (this.startIndex >= 0 && this.startIndex < this.input.size) {
      symbol = this.input.getText(new _Interval.default(this.startIndex, this.startIndex));
    }
    return "LexerNoViableAltException" + symbol;
  }
}
exports.default = LexerNoViableAltException;