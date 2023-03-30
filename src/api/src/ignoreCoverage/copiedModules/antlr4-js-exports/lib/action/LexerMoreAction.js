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
 * Implements the {@code more} lexer action by calling {@link Lexer//more}.
 *
 * <p>The {@code more} command does not have any parameters, so this action is
 * implemented as a singleton instance exposed by {@link //INSTANCE}.</p>
 */
class LexerMoreAction extends _LexerAction.default {
  constructor() {
    super(_LexerActionType.default.MORE);
  }

  /**
   * <p>This action is implemented by calling {@link Lexer//popMode}.</p>
   */
  execute(lexer) {
    lexer.more();
  }
  toString() {
    return "more";
  }
}
exports.default = LexerMoreAction;
LexerMoreAction.INSTANCE = new LexerMoreAction();