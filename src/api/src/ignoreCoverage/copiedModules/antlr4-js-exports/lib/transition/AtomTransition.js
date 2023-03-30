"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _IntervalSet = _interopRequireDefault(require("../misc/IntervalSet.js"));
var _Transition = _interopRequireDefault(require("./Transition.js"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
/* Copyright (c) 2012-2022 The ANTLR Project Contributors. All rights reserved.
 * Use is of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

class AtomTransition extends _Transition.default {
  constructor(target, label) {
    super(target);
    // The token type or character value; or, signifies special label.
    this.label_ = label;
    this.label = this.makeLabel();
    this.serializationType = _Transition.default.ATOM;
  }
  makeLabel() {
    const s = new _IntervalSet.default();
    s.addOne(this.label_);
    return s;
  }
  matches(symbol, minVocabSymbol, maxVocabSymbol) {
    return this.label_ === symbol;
  }
  toString() {
    return this.label_;
  }
}
exports.default = AtomTransition;