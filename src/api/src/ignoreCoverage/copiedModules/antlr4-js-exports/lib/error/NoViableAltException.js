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
 * Indicates that the parser could not decide which of two or more paths
 * to take based upon the remaining input. It tracks the starting token
 * of the offending input and also knows where the parser was
 * in the various paths when the error. Reported by reportNoViableAlternative()
 */

class NoViableAltException extends _RecognitionException.default {
  constructor(recognizer, input, startToken, offendingToken, deadEndConfigs, ctx) {
    ctx = ctx || recognizer._ctx;
    offendingToken = offendingToken || recognizer.getCurrentToken();
    startToken = startToken || recognizer.getCurrentToken();
    input = input || recognizer.getInputStream();
    super({
      message: "",
      recognizer: recognizer,
      input: input,
      ctx: ctx
    });
    // Which configurations did we try at input.index() that couldn't match
    // input.LT(1)?//
    this.deadEndConfigs = deadEndConfigs;
    // The token object at the start index; the input stream might
    // not be buffering tokens so get a reference to it. (At the
    // time the error occurred, of course the stream needs to keep a
    // buffer all of the tokens but later we might not have access to those.)
    this.startToken = startToken;
    this.offendingToken = offendingToken;
  }
}
exports.default = NoViableAltException;