"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _SemanticContext = _interopRequireDefault(require("./SemanticContext.js"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
/* Copyright (c) 2012-2022 The ANTLR Project Contributors. All rights reserved.
 * Use is of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

class PrecedencePredicate extends _SemanticContext.default {
  constructor(precedence) {
    super();
    this.precedence = precedence === undefined ? 0 : precedence;
  }
  evaluate(parser, outerContext) {
    return parser.precpred(outerContext, this.precedence);
  }
  evalPrecedence(parser, outerContext) {
    if (parser.precpred(outerContext, this.precedence)) {
      return _SemanticContext.default.NONE;
    } else {
      return null;
    }
  }
  compareTo(other) {
    return this.precedence - other.precedence;
  }
  updateHashCode(hash) {
    hash.update(this.precedence);
  }
  equals(other) {
    if (this === other) {
      return true;
    } else if (!(other instanceof PrecedencePredicate)) {
      return false;
    } else {
      return this.precedence === other.precedence;
    }
  }
  toString() {
    return "{" + this.precedence + ">=prec}?";
  }
}

// HORRIBLE workaround circular import, avoiding dynamic import
exports.default = PrecedencePredicate;
_SemanticContext.default.PrecedencePredicate = PrecedencePredicate;