"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _Token = _interopRequireDefault(require("../Token.js"));
var _ATNConfig = _interopRequireDefault(require("./ATNConfig.js"));
var _IntervalSet = _interopRequireDefault(require("../misc/IntervalSet.js"));
var _RuleStopState = _interopRequireDefault(require("../state/RuleStopState.js"));
var _RuleTransition = _interopRequireDefault(require("../transition/RuleTransition.js"));
var _NotSetTransition = _interopRequireDefault(require("../transition/NotSetTransition.js"));
var _WildcardTransition = _interopRequireDefault(require("../transition/WildcardTransition.js"));
var _AbstractPredicateTransition = _interopRequireDefault(require("./AbstractPredicateTransition.js"));
var _PredictionContextUtils = require("../context/PredictionContextUtils.js");
var _PredictionContext = _interopRequireDefault(require("../context/PredictionContext.js"));
var _SingletonPredictionContext = _interopRequireDefault(require("../context/SingletonPredictionContext.js"));
var _BitSet = _interopRequireDefault(require("../misc/BitSet.js"));
var _HashSet = _interopRequireDefault(require("../misc/HashSet.js"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
/* Copyright (c) 2012-2022 The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

class LL1Analyzer {
  constructor(atn) {
    this.atn = atn;
  }

  /**
   * Calculates the SLL(1) expected lookahead set for each outgoing transition
   * of an {@link ATNState}. The returned array has one element for each
   * outgoing transition in {@code s}. If the closure from transition
   * <em>i</em> leads to a semantic predicate before matching a symbol, the
   * element at index <em>i</em> of the result will be {@code null}.
   *
   * @param s the ATN state
   * @return the expected symbols for each outgoing transition of {@code s}.
   */
  getDecisionLookahead(s) {
    if (s === null) {
      return null;
    }
    const count = s.transitions.length;
    const look = [];
    for (let alt = 0; alt < count; alt++) {
      look[alt] = new _IntervalSet.default();
      const lookBusy = new _HashSet.default();
      const seeThruPreds = false; // fail to get lookahead upon pred
      this._LOOK(s.transition(alt).target, null, _PredictionContext.default.EMPTY, look[alt], lookBusy, new _BitSet.default(), seeThruPreds, false);
      // Wipe out lookahead for this alternative if we found nothing
      // or we had a predicate when we !seeThruPreds
      if (look[alt].length === 0 || look[alt].contains(LL1Analyzer.HIT_PRED)) {
        look[alt] = null;
      }
    }
    return look;
  }

  /**
   * Compute set of tokens that can follow {@code s} in the ATN in the
   * specified {@code ctx}.
   *
   * <p>If {@code ctx} is {@code null} and the end of the rule containing
   * {@code s} is reached, {@link Token//EPSILON} is added to the result set.
   * If {@code ctx} is not {@code null} and the end of the outermost rule is
   * reached, {@link Token//EOF} is added to the result set.</p>
   *
   * @param s the ATN state
   * @param stopState the ATN state to stop at. This can be a
   * {@link BlockEndState} to detect epsilon paths through a closure.
   * @param ctx the complete parser context, or {@code null} if the context
   * should be ignored
   *
   * @return The set of tokens that can follow {@code s} in the ATN in the
   * specified {@code ctx}.
   */
  LOOK(s, stopState, ctx) {
    const r = new _IntervalSet.default();
    const seeThruPreds = true; // ignore preds; get all lookahead
    ctx = ctx || null;
    const lookContext = ctx !== null ? (0, _PredictionContextUtils.predictionContextFromRuleContext)(s.atn, ctx) : null;
    this._LOOK(s, stopState, lookContext, r, new _HashSet.default(), new _BitSet.default(), seeThruPreds, true);
    return r;
  }

  /**
   * Compute set of tokens that can follow {@code s} in the ATN in the
   * specified {@code ctx}.
   *
   * <p>If {@code ctx} is {@code null} and {@code stopState} or the end of the
   * rule containing {@code s} is reached, {@link Token//EPSILON} is added to
   * the result set. If {@code ctx} is not {@code null} and {@code addEOF} is
   * {@code true} and {@code stopState} or the end of the outermost rule is
   * reached, {@link Token//EOF} is added to the result set.</p>
   *
   * @param s the ATN state.
   * @param stopState the ATN state to stop at. This can be a
   * {@link BlockEndState} to detect epsilon paths through a closure.
   * @param ctx The outer context, or {@code null} if the outer context should
   * not be used.
   * @param look The result lookahead set.
   * @param lookBusy A set used for preventing epsilon closures in the ATN
   * from causing a stack overflow. Outside code should pass
   * {@code new CustomizedSet<ATNConfig>} for this argument.
   * @param calledRuleStack A set used for preventing left recursion in the
   * ATN from causing a stack overflow. Outside code should pass
   * {@code new BitSet()} for this argument.
   * @param seeThruPreds {@code true} to true semantic predicates as
   * implicitly {@code true} and "see through them", otherwise {@code false}
   * to treat semantic predicates as opaque and add {@link //HIT_PRED} to the
   * result if one is encountered.
   * @param addEOF Add {@link Token//EOF} to the result if the end of the
   * outermost context is reached. This parameter has no effect if {@code ctx}
   * is {@code null}.
   */
  _LOOK(s, stopState, ctx, look, lookBusy, calledRuleStack, seeThruPreds, addEOF) {
    const c = new _ATNConfig.default({
      state: s,
      alt: 0,
      context: ctx
    }, null);
    if (lookBusy.has(c)) {
      return;
    }
    lookBusy.add(c);
    if (s === stopState) {
      if (ctx === null) {
        look.addOne(_Token.default.EPSILON);
        return;
      } else if (ctx.isEmpty() && addEOF) {
        look.addOne(_Token.default.EOF);
        return;
      }
    }
    if (s instanceof _RuleStopState.default) {
      if (ctx === null) {
        look.addOne(_Token.default.EPSILON);
        return;
      } else if (ctx.isEmpty() && addEOF) {
        look.addOne(_Token.default.EOF);
        return;
      }
      if (ctx !== _PredictionContext.default.EMPTY) {
        const removed = calledRuleStack.has(s.ruleIndex);
        try {
          calledRuleStack.remove(s.ruleIndex);
          // run thru all possible stack tops in ctx
          for (let i = 0; i < ctx.length; i++) {
            const returnState = this.atn.states[ctx.getReturnState(i)];
            this._LOOK(returnState, stopState, ctx.getParent(i), look, lookBusy, calledRuleStack, seeThruPreds, addEOF);
          }
        } finally {
          if (removed) {
            calledRuleStack.add(s.ruleIndex);
          }
        }
        return;
      }
    }
    for (let j = 0; j < s.transitions.length; j++) {
      const t = s.transitions[j];
      if (t.constructor === _RuleTransition.default) {
        if (calledRuleStack.has(t.target.ruleIndex)) {
          continue;
        }
        const newContext = _SingletonPredictionContext.default.create(ctx, t.followState.stateNumber);
        try {
          calledRuleStack.add(t.target.ruleIndex);
          this._LOOK(t.target, stopState, newContext, look, lookBusy, calledRuleStack, seeThruPreds, addEOF);
        } finally {
          calledRuleStack.remove(t.target.ruleIndex);
        }
      } else if (t instanceof _AbstractPredicateTransition.default) {
        if (seeThruPreds) {
          this._LOOK(t.target, stopState, ctx, look, lookBusy, calledRuleStack, seeThruPreds, addEOF);
        } else {
          look.addOne(LL1Analyzer.HIT_PRED);
        }
      } else if (t.isEpsilon) {
        this._LOOK(t.target, stopState, ctx, look, lookBusy, calledRuleStack, seeThruPreds, addEOF);
      } else if (t.constructor === _WildcardTransition.default) {
        look.addRange(_Token.default.MIN_USER_TOKEN_TYPE, this.atn.maxTokenType);
      } else {
        let set = t.label;
        if (set !== null) {
          if (t instanceof _NotSetTransition.default) {
            set = set.complement(_Token.default.MIN_USER_TOKEN_TYPE, this.atn.maxTokenType);
          }
          look.addSet(set);
        }
      }
    }
  }
}

/**
 * Special value added to the lookahead sets to indicate that we hit
 * a predicate during analysis if {@code seeThruPreds==false}.
 */
exports.default = LL1Analyzer;
LL1Analyzer.HIT_PRED = _Token.default.INVALID_TYPE;