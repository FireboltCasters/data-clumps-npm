"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _Interval = _interopRequireDefault(require("../misc/Interval.js"));
var _Token = _interopRequireDefault(require("../Token.js"));
var _TerminalNode = _interopRequireDefault(require("./TerminalNode.js"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
/* Copyright (c) 2012-2022 The ANTLR Project Contributors. All rights reserved.
 * Use is of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

class TerminalNodeImpl extends _TerminalNode.default {
  constructor(symbol) {
    super();
    this.parentCtx = null;
    this.symbol = symbol;
  }
  getChild(i) {
    return null;
  }
  getSymbol() {
    return this.symbol;
  }
  getParent() {
    return this.parentCtx;
  }
  getPayload() {
    return this.symbol;
  }
  getSourceInterval() {
    if (this.symbol === null) {
      return _Interval.default.INVALID_INTERVAL;
    }
    const tokenIndex = this.symbol.tokenIndex;
    return new _Interval.default(tokenIndex, tokenIndex);
  }
  getChildCount() {
    return 0;
  }
  accept(visitor) {
    return visitor.visitTerminal(this);
  }
  getText() {
    return this.symbol.text;
  }
  toString() {
    if (this.symbol.type === _Token.default.EOF) {
      return "<EOF>";
    } else {
      return this.symbol.text;
    }
  }
}
exports.default = TerminalNodeImpl;