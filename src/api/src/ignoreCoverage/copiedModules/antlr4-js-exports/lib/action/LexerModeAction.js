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
 * Implements the {@code mode} lexer action by calling {@link Lexer//mode} with
 * the assigned mode
 */
class LexerModeAction extends _LexerAction.default {
  constructor(mode) {
    super(_LexerActionType.default.MODE);
    this.mode = mode;
  }

  /**
   * <p>This action is implemented by calling {@link Lexer//mode} with the
   * value provided by {@link //getMode}.</p>
   */
  execute(lexer) {
    lexer.mode(this.mode);
  }
  updateHashCode(hash) {
    hash.update(this.actionType, this.mode);
  }
  equals(other) {
    if (this === other) {
      return true;
    } else if (!(other instanceof LexerModeAction)) {
      return false;
    } else {
      return this.mode === other.mode;
    }
  }
  toString() {
    return "mode(" + this.mode + ")";
  }
}
exports.default = LexerModeAction;