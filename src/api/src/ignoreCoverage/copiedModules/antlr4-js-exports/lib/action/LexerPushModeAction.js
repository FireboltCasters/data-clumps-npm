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
 * Implements the {@code pushMode} lexer action by calling
 * {@link Lexer//pushMode} with the assigned mode
 */
class LexerPushModeAction extends _LexerAction.default {
  constructor(mode) {
    super(_LexerActionType.default.PUSH_MODE);
    this.mode = mode;
  }

  /**
   * <p>This action is implemented by calling {@link Lexer//pushMode} with the
   * value provided by {@link //getMode}.</p>
   */
  execute(lexer) {
    lexer.pushMode(this.mode);
  }
  updateHashCode(hash) {
    hash.update(this.actionType, this.mode);
  }
  equals(other) {
    if (this === other) {
      return true;
    } else if (!(other instanceof LexerPushModeAction)) {
      return false;
    } else {
      return this.mode === other.mode;
    }
  }
  toString() {
    return "pushMode(" + this.mode + ")";
  }
}
exports.default = LexerPushModeAction;