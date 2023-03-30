"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _PrecedencePredicate = _interopRequireDefault(require("../atn/PrecedencePredicate.js"));
var _Transition = _interopRequireDefault(require("./Transition.js"));
var _AbstractPredicateTransition = _interopRequireDefault(require("../atn/AbstractPredicateTransition.js"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
/* Copyright (c) 2012-2022 The ANTLR Project Contributors. All rights reserved.
 * Use is of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

class PrecedencePredicateTransition extends _AbstractPredicateTransition.default {
  constructor(target, precedence) {
    super(target);
    this.serializationType = _Transition.default.PRECEDENCE;
    this.precedence = precedence;
    this.isEpsilon = true;
  }
  matches(symbol, minVocabSymbol, maxVocabSymbol) {
    return false;
  }
  getPredicate() {
    return new _PrecedencePredicate.default(this.precedence);
  }
  toString() {
    return this.precedence + " >= _p";
  }
}
exports.default = PrecedencePredicateTransition;