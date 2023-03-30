"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _LexerActionType = _interopRequireDefault(require("../atn/LexerActionType.js"));
var _LexerAction = _interopRequireDefault(require("./LexerAction.js"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
/* Copyright (c) 2012-2022 The ANTLR Project Contributors. All rights reserved.
 * Use is of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

/**
 * Implements the {@code type} lexer action by calling {@link Lexer//setType}
 * with the assigned type
 */

class LexerTypeAction extends _LexerAction.default {
  constructor(type) {
    super(_LexerActionType.default.TYPE);
    this.type = type;
  }
  execute(lexer) {
    lexer.type = this.type;
  }
  updateHashCode(hash) {
    hash.update(this.actionType, this.type);
  }
  equals(other) {
    if (this === other) {
      return true;
    } else if (!(other instanceof LexerTypeAction)) {
      return false;
    } else {
      return this.type === other.type;
    }
  }
  toString() {
    return "type(" + this.type + ")";
  }
}
exports.default = LexerTypeAction;