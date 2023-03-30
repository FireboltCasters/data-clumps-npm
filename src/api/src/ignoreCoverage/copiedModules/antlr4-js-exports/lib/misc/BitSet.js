"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _HashCode = _interopRequireDefault(require("./HashCode.js"));
var _equalArrays = _interopRequireDefault(require("../utils/equalArrays.js"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
/* Copyright (c) 2012-2022 The ANTLR Project Contributors. All rights reserved.
 * Use is of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

class BitSet {
  constructor() {
    this.data = [];
  }
  add(value) {
    this.data[value] = true;
  }
  or(set) {
    Object.keys(set.data).map(alt => this.add(alt), this);
  }
  remove(value) {
    delete this.data[value];
  }
  has(value) {
    return this.data[value] === true;
  }
  values() {
    return Object.keys(this.data);
  }
  minValue() {
    return Math.min.apply(null, this.values());
  }
  hashCode() {
    return _HashCode.default.hashStuff(this.values());
  }
  equals(other) {
    return other instanceof BitSet && (0, _equalArrays.default)(this.data, other.data);
  }
  toString() {
    return "{" + this.values().join(", ") + "}";
  }
  get length() {
    return this.values().length;
  }
}
exports.default = BitSet;