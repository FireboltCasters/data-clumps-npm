"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _PredicateTransition = _interopRequireDefault(require("../transition/PredicateTransition.js"));
var _RecognitionException = _interopRequireDefault(require("./RecognitionException.js"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
/* Copyright (c) 2012-2022 The ANTLR Project Contributors. All rights reserved.
 * Use is of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

/**
 * A semantic predicate failed during validation. Validation of predicates
 * occurs when normally parsing the alternative just like matching a token.
 * Disambiguating predicate evaluation occurs when we test a predicate during
 * prediction.
 */
class FailedPredicateException extends _RecognitionException.default {
  constructor(recognizer, predicate, message) {
    super({
      message: formatMessage(predicate, message || null),
      recognizer: recognizer,
      input: recognizer.getInputStream(),
      ctx: recognizer._ctx
    });
    const s = recognizer._interp.atn.states[recognizer.state];
    const trans = s.transitions[0];
    if (trans instanceof _PredicateTransition.default) {
      this.ruleIndex = trans.ruleIndex;
      this.predicateIndex = trans.predIndex;
    } else {
      this.ruleIndex = 0;
      this.predicateIndex = 0;
    }
    this.predicate = predicate;
    this.offendingToken = recognizer.getCurrentToken();
  }
}
exports.default = FailedPredicateException;
function formatMessage(predicate, message) {
  if (message !== null) {
    return message;
  } else {
    return "failed predicate: {" + predicate + "}?";
  }
}