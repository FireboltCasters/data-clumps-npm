"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _Transition = _interopRequireDefault(require("./Transition.js"));
var _SetTransition = _interopRequireDefault(require("./SetTransition.js"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
/* Copyright (c) 2012-2022 The ANTLR Project Contributors. All rights reserved.
 * Use is of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

class NotSetTransition extends _SetTransition.default {
  constructor(target, set) {
    super(target, set);
    this.serializationType = _Transition.default.NOT_SET;
  }
  matches(symbol, minVocabSymbol, maxVocabSymbol) {
    return symbol >= minVocabSymbol && symbol <= maxVocabSymbol && !super.matches(symbol, minVocabSymbol, maxVocabSymbol);
  }
  toString() {
    return '~' + super.toString();
  }
}
exports.default = NotSetTransition;