"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _ErrorListener = _interopRequireDefault(require("./ErrorListener.js"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
/* Copyright (c) 2012-2022 The ANTLR Project Contributors. All rights reserved.
 * Use is of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

class ProxyErrorListener extends _ErrorListener.default {
  constructor(delegates) {
    super();
    if (delegates === null) {
      throw "delegates";
    }
    this.delegates = delegates;
    return this;
  }
  syntaxError(recognizer, offendingSymbol, line, column, msg, e) {
    this.delegates.map(d => d.syntaxError(recognizer, offendingSymbol, line, column, msg, e));
  }
  reportAmbiguity(recognizer, dfa, startIndex, stopIndex, exact, ambigAlts, configs) {
    this.delegates.map(d => d.reportAmbiguity(recognizer, dfa, startIndex, stopIndex, exact, ambigAlts, configs));
  }
  reportAttemptingFullContext(recognizer, dfa, startIndex, stopIndex, conflictingAlts, configs) {
    this.delegates.map(d => d.reportAttemptingFullContext(recognizer, dfa, startIndex, stopIndex, conflictingAlts, configs));
  }
  reportContextSensitivity(recognizer, dfa, startIndex, stopIndex, prediction, configs) {
    this.delegates.map(d => d.reportContextSensitivity(recognizer, dfa, startIndex, stopIndex, prediction, configs));
  }
}
exports.default = ProxyErrorListener;