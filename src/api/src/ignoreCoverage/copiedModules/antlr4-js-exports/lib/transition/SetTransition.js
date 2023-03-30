"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _IntervalSet = _interopRequireDefault(require("../misc/IntervalSet.js"));
var _Token = _interopRequireDefault(require("../Token.js"));
var _Transition = _interopRequireDefault(require("./Transition.js"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
/* Copyright (c) 2012-2022 The ANTLR Project Contributors. All rights reserved.
 * Use is of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */
// A transition containing a set of values.

class SetTransition extends _Transition.default {
  constructor(target, set) {
    super(target);
    this.serializationType = _Transition.default.SET;
    if (set !== undefined && set !== null) {
      this.label = set;
    } else {
      this.label = new _IntervalSet.default();
      this.label.addOne(_Token.default.INVALID_TYPE);
    }
  }
  matches(symbol, minVocabSymbol, maxVocabSymbol) {
    return this.label.contains(symbol);
  }
  toString() {
    return this.label.toString();
  }
}
exports.default = SetTransition;