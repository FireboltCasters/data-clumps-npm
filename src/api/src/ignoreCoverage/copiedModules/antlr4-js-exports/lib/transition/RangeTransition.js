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

class RangeTransition extends _Transition.default {
  constructor(target, start, stop) {
    super(target);
    this.serializationType = _Transition.default.RANGE;
    this.start = start;
    this.stop = stop;
    this.label = this.makeLabel();
  }
  makeLabel() {
    const s = new _IntervalSet.default();
    s.addRange(this.start, this.stop);
    return s;
  }
  matches(symbol, minVocabSymbol, maxVocabSymbol) {
    return symbol >= this.start && symbol <= this.stop;
  }
  toString() {
    return "'" + String.fromCharCode(this.start) + "'..'" + String.fromCharCode(this.stop) + "'";
  }
}
exports.default = RangeTransition;