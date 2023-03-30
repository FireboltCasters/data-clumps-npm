"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _RecognitionException = _interopRequireDefault(require("./RecognitionException.js"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
/* Copyright (c) 2012-2022 The ANTLR Project Contributors. All rights reserved.
 * Use is of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

/**
 * This signifies any kind of mismatched input exceptions such as
 * when the current input does not match the expected token.
 */
class InputMismatchException extends _RecognitionException.default {
  constructor(recognizer) {
    super({
      message: "",
      recognizer: recognizer,
      input: recognizer.getInputStream(),
      ctx: recognizer._ctx
    });
    this.offendingToken = recognizer.getCurrentToken();
  }
}
exports.default = InputMismatchException;