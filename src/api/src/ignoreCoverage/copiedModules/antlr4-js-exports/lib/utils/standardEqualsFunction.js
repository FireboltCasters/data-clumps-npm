"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = standardEqualsFunction;
/* Copyright (c) 2012-2022 The ANTLR Project Contributors. All rights reserved.
 * Use is of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */
function standardEqualsFunction(a, b) {
  return a ? a.equals(b) : a === b;
}