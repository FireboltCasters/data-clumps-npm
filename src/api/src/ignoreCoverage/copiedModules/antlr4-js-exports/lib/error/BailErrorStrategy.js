"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _InputMismatchException = _interopRequireDefault(require("./InputMismatchException.js"));
var _ParseCancellationException = _interopRequireDefault(require("./ParseCancellationException.js"));
var _DefaultErrorStrategy = _interopRequireDefault(require("./DefaultErrorStrategy.js"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
/* Copyright (c) 2012-2022 The ANTLR Project Contributors. All rights reserved.
 * Use is of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

/**
 * This implementation of {@link ANTLRErrorStrategy} responds to syntax errors
 * by immediately canceling the parse operation with a
 * {@link ParseCancellationException}. The implementation ensures that the
 * {@link ParserRuleContext//exception} field is set for all parse tree nodes
 * that were not completed prior to encountering the error.
 *
 * <p>
 * This error strategy is useful in the following scenarios.</p>
 *
 * <ul>
 * <li><strong>Two-stage parsing:</strong> This error strategy allows the first
 * stage of two-stage parsing to immediately terminate if an error is
 * encountered, and immediately fall back to the second stage. In addition to
 * avoiding wasted work by attempting to recover from errors here, the empty
 * implementation of {@link BailErrorStrategy//sync} improves the performance of
 * the first stage.</li>
 * <li><strong>Silent validation:</strong> When syntax errors are not being
 * reported or logged, and the parse result is simply ignored if errors occur,
 * the {@link BailErrorStrategy} avoids wasting work on recovering from errors
 * when the result will be ignored either way.</li>
 * </ul>
 *
 * <p>
 * {@code myparser.setErrorHandler(new BailErrorStrategy());}</p>
 *
 * @see Parser//setErrorHandler(ANTLRErrorStrategy)
 * */
class BailErrorStrategy extends _DefaultErrorStrategy.default {
  constructor() {
    super();
  }

  /**
   * Instead of recovering from exception {@code e}, re-throw it wrapped
   * in a {@link ParseCancellationException} so it is not caught by the
   * rule function catches. Use {@link Exception//getCause()} to get the
   * original {@link RecognitionException}.
   */
  recover(recognizer, e) {
    let context = recognizer._ctx;
    while (context !== null) {
      context.exception = e;
      context = context.parentCtx;
    }
    throw new _ParseCancellationException.default(e);
  }

  /**
   * Make sure we don't attempt to recover inline; if the parser
   * successfully recovers, it won't throw an exception.
   */
  recoverInline(recognizer) {
    this.recover(recognizer, new _InputMismatchException.default(recognizer));
  }

  // Make sure we don't attempt to recover from problems in subrules.//
  sync(recognizer) {
    // pass
  }
}
exports.default = BailErrorStrategy;