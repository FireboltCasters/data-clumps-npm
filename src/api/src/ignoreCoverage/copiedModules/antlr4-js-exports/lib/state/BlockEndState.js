"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _ATNState = _interopRequireDefault(require("./ATNState.js"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
/* Copyright (c) 2012-2022 The ANTLR Project Contributors. All rights reserved.
 * Use is of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

/**
 * Terminal node of a simple {@code (a|b|c)} block
 */
class BlockEndState extends _ATNState.default {
  constructor() {
    super();
    this.stateType = _ATNState.default.BLOCK_END;
    this.startState = null;
    return this;
  }
}
exports.default = BlockEndState;