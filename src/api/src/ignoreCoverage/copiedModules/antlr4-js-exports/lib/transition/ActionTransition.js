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

class ActionTransition extends _Transition.default {
  constructor(target, ruleIndex, actionIndex, isCtxDependent) {
    super(target);
    this.serializationType = _Transition.default.ACTION;
    this.ruleIndex = ruleIndex;
    this.actionIndex = actionIndex === undefined ? -1 : actionIndex;
    this.isCtxDependent = isCtxDependent === undefined ? false : isCtxDependent; // e.g., $i ref in pred
    this.isEpsilon = true;
  }
  matches(symbol, minVocabSymbol, maxVocabSymbol) {
    return false;
  }
  toString() {
    return "action_" + this.ruleIndex + ":" + this.actionIndex;
  }
}
exports.default = ActionTransition;