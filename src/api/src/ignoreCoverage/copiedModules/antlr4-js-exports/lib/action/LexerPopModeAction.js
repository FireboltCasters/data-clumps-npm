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
 * Implements the {@code popMode} lexer action by calling {@link Lexer//popMode}.
 *
 * <p>The {@code popMode} command does not have any parameters, so this action is
 * implemented as a singleton instance exposed by {@link //INSTANCE}.</p>
 */
class LexerPopModeAction extends _LexerAction.default {
  constructor() {
    super(_LexerActionType.default.POP_MODE);
  }

  /**
   * <p>This action is implemented by calling {@link Lexer//popMode}.</p>
   */
  execute(lexer) {
    lexer.popMode();
  }
  toString() {
    return "popMode";
  }
}
exports.default = LexerPopModeAction;
LexerPopModeAction.INSTANCE = new LexerPopModeAction();