"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _HashMap = _interopRequireDefault(require("../misc/HashMap.js"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
/* Copyright (c) 2012-2022 The ANTLR Project Contributors. All rights reserved.
 * Use is of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

class DoubleDict {
  constructor(defaultMapCtor) {
    this.defaultMapCtor = defaultMapCtor || _HashMap.default;
    this.cacheMap = new this.defaultMapCtor();
  }
  get(a, b) {
    const d = this.cacheMap.get(a) || null;
    return d === null ? null : d.get(b) || null;
  }
  set(a, b, o) {
    let d = this.cacheMap.get(a) || null;
    if (d === null) {
      d = new this.defaultMapCtor();
      this.cacheMap.set(a, d);
    }
    d.set(b, o);
  }
}
exports.default = DoubleDict;