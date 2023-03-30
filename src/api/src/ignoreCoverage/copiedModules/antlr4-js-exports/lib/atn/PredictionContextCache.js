"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _PredictionContext = _interopRequireDefault(require("../context/PredictionContext.js"));
var _HashMap = _interopRequireDefault(require("../misc/HashMap.js"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
/* Copyright (c) 2012-2022 The ANTLR Project Contributors. All rights reserved.
 * Use is of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

/**
 * Used to cache {@link PredictionContext} objects. Its used for the shared
 * context cash associated with contexts in DFA states. This cache
 * can be used for both lexers and parsers.
 */
class PredictionContextCache {
  constructor() {
    this.cache = new _HashMap.default();
  }

  /**
   * Add a context to the cache and return it. If the context already exists,
   * return that one instead and do not add a new context to the cache.
   * Protect shared cache from unsafe thread access.
   */
  add(ctx) {
    if (ctx === _PredictionContext.default.EMPTY) {
      return _PredictionContext.default.EMPTY;
    }
    const existing = this.cache.get(ctx) || null;
    if (existing !== null) {
      return existing;
    }
    this.cache.set(ctx, ctx);
    return ctx;
  }
  get(ctx) {
    return this.cache.get(ctx) || null;
  }
  get length() {
    return this.cache.length;
  }
}
exports.default = PredictionContextCache;