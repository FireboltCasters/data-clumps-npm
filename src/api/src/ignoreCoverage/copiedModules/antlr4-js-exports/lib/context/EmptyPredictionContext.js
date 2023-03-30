"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _PredictionContext = _interopRequireDefault(require("./PredictionContext.js"));
var _SingletonPredictionContext = _interopRequireDefault(require("./SingletonPredictionContext.js"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
/* Copyright (c) 2012-2022 The ANTLR Project Contributors. All rights reserved.
 * Use is of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

class EmptyPredictionContext extends _SingletonPredictionContext.default {
  constructor() {
    super(null, _PredictionContext.default.EMPTY_RETURN_STATE);
  }
  isEmpty() {
    return true;
  }
  getParent(index) {
    return null;
  }
  getReturnState(index) {
    return this.returnState;
  }
  equals(other) {
    return this === other;
  }
  toString() {
    return "$";
  }
}
exports.default = EmptyPredictionContext;
_PredictionContext.default.EMPTY = new EmptyPredictionContext();