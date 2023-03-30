"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _DecisionState = _interopRequireDefault(require("./DecisionState.js"));
var _ATNState = _interopRequireDefault(require("./ATNState.js"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
/* Copyright (c) 2012-2022 The ANTLR Project Contributors. All rights reserved.
 * Use is of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

/**
 * The Tokens rule start state linking to each lexer rule start state
 */
class TokensStartState extends _DecisionState.default {
  constructor() {
    super();
    this.stateType = _ATNState.default.TOKEN_START;
    return this;
  }
}
exports.default = TokensStartState;