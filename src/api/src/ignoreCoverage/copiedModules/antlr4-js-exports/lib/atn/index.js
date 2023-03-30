"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _ATN = _interopRequireDefault(require("./ATN.js"));
var _ATNDeserializer = _interopRequireDefault(require("./ATNDeserializer.js"));
var _LexerATNSimulator = _interopRequireDefault(require("./LexerATNSimulator.js"));
var _ParserATNSimulator = _interopRequireDefault(require("./ParserATNSimulator.js"));
var _PredictionMode = _interopRequireDefault(require("./PredictionMode.js"));
var _PredictionContextCache = _interopRequireDefault(require("./PredictionContextCache.js"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
/* Copyright (c) 2012-2022 The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */
var _default = {
  ATN: _ATN.default,
  ATNDeserializer: _ATNDeserializer.default,
  LexerATNSimulator: _LexerATNSimulator.default,
  ParserATNSimulator: _ParserATNSimulator.default,
  PredictionMode: _PredictionMode.default,
  PredictionContextCache: _PredictionContextCache.default
};
exports.default = _default;