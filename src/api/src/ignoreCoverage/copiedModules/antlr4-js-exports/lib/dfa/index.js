"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _DFA = _interopRequireDefault(require("./DFA.js"));
var _DFASerializer = _interopRequireDefault(require("./DFASerializer.js"));
var _LexerDFASerializer = _interopRequireDefault(require("./LexerDFASerializer.js"));
var _PredPrediction = _interopRequireDefault(require("./PredPrediction.js"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
/* Copyright (c) 2012-2022 The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */
var _default = {
  DFA: _DFA.default,
  DFASerializer: _DFASerializer.default,
  LexerDFASerializer: _LexerDFASerializer.default,
  PredPrediction: _PredPrediction.default
};
exports.default = _default;