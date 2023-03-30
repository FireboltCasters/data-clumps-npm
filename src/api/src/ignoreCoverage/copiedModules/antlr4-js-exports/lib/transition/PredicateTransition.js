"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _Predicate = _interopRequireDefault(require("../atn/Predicate.js"));
var _Transition = _interopRequireDefault(require("./Transition.js"));
var _AbstractPredicateTransition = _interopRequireDefault(require("../atn/AbstractPredicateTransition.js"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
/* Copyright (c) 2012-2022 The ANTLR Project Contributors. All rights reserved.
 * Use is of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

class PredicateTransition extends _AbstractPredicateTransition.default {
  constructor(target, ruleIndex, predIndex, isCtxDependent) {
    super(target);
    this.serializationType = _Transition.default.PREDICATE;
    this.ruleIndex = ruleIndex;
    this.predIndex = predIndex;
    this.isCtxDependent = isCtxDependent; // e.g., $i ref in pred
    this.isEpsilon = true;
  }
  matches(symbol, minVocabSymbol, maxVocabSymbol) {
    return false;
  }
  getPredicate() {
    return new _Predicate.default(this.ruleIndex, this.predIndex, this.isCtxDependent);
  }
  toString() {
    return "pred_" + this.ruleIndex + ":" + this.predIndex;
  }
}
exports.default = PredicateTransition;