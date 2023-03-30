"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _ParserRuleContext = _interopRequireDefault(require("./ParserRuleContext.js"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
/* Copyright (c) 2012-2022 The ANTLR Project Contributors. All rights reserved.
 * Use is of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

class InterpreterRuleContext extends _ParserRuleContext.default {
  constructor(parent, invokingStateNumber, ruleIndex) {
    super(parent, invokingStateNumber);
    this.ruleIndex = ruleIndex;
  }
}
exports.default = InterpreterRuleContext;