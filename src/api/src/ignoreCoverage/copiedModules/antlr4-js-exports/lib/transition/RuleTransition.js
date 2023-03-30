"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _Transition = _interopRequireDefault(require("./Transition.js"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
/* Copyright (c) 2012-2022 The ANTLR Project Contributors. All rights reserved.
 * Use is of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

class RuleTransition extends _Transition.default {
  constructor(ruleStart, ruleIndex, precedence, followState) {
    super(ruleStart);
    // ptr to the rule definition object for this rule ref
    this.ruleIndex = ruleIndex;
    this.precedence = precedence;
    // what node to begin computations following ref to rule
    this.followState = followState;
    this.serializationType = _Transition.default.RULE;
    this.isEpsilon = true;
  }
  matches(symbol, minVocabSymbol, maxVocabSymbol) {
    return false;
  }
}
exports.default = RuleTransition;