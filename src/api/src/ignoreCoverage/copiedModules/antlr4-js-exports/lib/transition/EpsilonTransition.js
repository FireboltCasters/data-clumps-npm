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

class EpsilonTransition extends _Transition.default {
  constructor(target, outermostPrecedenceReturn) {
    super(target);
    this.serializationType = _Transition.default.EPSILON;
    this.isEpsilon = true;
    this.outermostPrecedenceReturn = outermostPrecedenceReturn;
  }
  matches(symbol, minVocabSymbol, maxVocabSymbol) {
    return false;
  }
  toString() {
    return "epsilon";
  }
}
exports.default = EpsilonTransition;