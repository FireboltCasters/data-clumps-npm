"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _HashCode = _interopRequireDefault(require("../misc/HashCode.js"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
/* Copyright (c) 2012-2022 The ANTLR Project Contributors. All rights reserved.
 * Use is of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

/* Copyright (c) 2012-2022 The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

class LexerAction {
  constructor(action) {
    this.actionType = action;
    this.isPositionDependent = false;
  }
  hashCode() {
    const hash = new _HashCode.default();
    this.updateHashCode(hash);
    return hash.finish();
  }
  updateHashCode(hash) {
    hash.update(this.actionType);
  }
  equals(other) {
    return this === other;
  }
}
exports.default = LexerAction;