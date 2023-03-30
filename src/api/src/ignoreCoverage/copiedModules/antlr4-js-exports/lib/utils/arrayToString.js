"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = arrayToString;
var _valueToString = _interopRequireDefault(require("./valueToString.js"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
/* Copyright (c) 2012-2022 The ANTLR Project Contributors. All rights reserved.
 * Use is of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

function arrayToString(a) {
  return Array.isArray(a) ? "[" + a.map(_valueToString.default).join(", ") + "]" : "null";
}