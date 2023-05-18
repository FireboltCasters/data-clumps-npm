"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _LL1Analyzer = _interopRequireDefault(require("./LL1Analyzer.js"));
var _IntervalSet = _interopRequireDefault(require("../misc/IntervalSet.js"));
var _Token = _interopRequireDefault(require("../Token.js"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
/* Copyright (c) 2012-2022 The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

class ATN {
  constructor(grammarType, maxTokenType) {
    /**
     * Used for runtime deserialization of ATNs from strings
     * The type of the ATN.
    */
    this.grammarType = grammarType;
    // The maximum value for any symbol recognized by a transition in the ATN.
    this.maxTokenType = maxTokenType;
    this.states = [];
    /**
     * Each subrule/rule is a decision point and we must track them so we
     * can go back later and build DFA predictors for them.  This includes
     * all the rules, subrules, optional blocks, ()+, ()* etc...
     */
    this.decisionToState = [];
    // Maps from rule index to starting state number.
    this.ruleToStartState = [];
    // Maps from rule index to stop state number.
    this.ruleToStopState = null;
    this.modeNameToStartState = {};
    /**
     * For lexer ATNs, this maps the rule index to the resulting token type.
     * For parser ATNs, this maps the rule index to the generated bypass token
     * type if the {@link ATNDeserializationOptions//isGenerateRuleBypassTransitions}
     * deserialization option was specified; otherwise, this is {@code null}
     */
    this.ruleToTokenType = null;
    /**
     * For lexer ATNs, this is an array of {@link LexerAction} objects which may
     * be referenced by action transitions in the ATN
     */
    this.lexerActions = null;
    this.modeToStartState = [];
  }

  /**
   * Compute the set of valid tokens that can occur starting in state {@code s}.
   * If {@code ctx} is null, the set of tokens will not include what can follow
   * the rule surrounding {@code s}. In other words, the set will be
   * restricted to tokens reachable staying within {@code s}'s rule
   */
  nextTokensInContext(s, ctx) {
    const anal = new _LL1Analyzer.default(this);
    return anal.LOOK(s, null, ctx);
  }

  /**
   * Compute the set of valid tokens that can occur starting in {@code s} and
   * staying in same rule. {@link Token//EPSILON} is in set if we reach end of
   * rule
   */
  nextTokensNoContext(s) {
    if (s.nextTokenWithinRule !== null) {
      return s.nextTokenWithinRule;
    }
    s.nextTokenWithinRule = this.nextTokensInContext(s, null);
    s.nextTokenWithinRule.readOnly = true;
    return s.nextTokenWithinRule;
  }
  nextTokens(s, ctx) {
    if (ctx === undefined) {
      return this.nextTokensNoContext(s);
    } else {
      return this.nextTokensInContext(s, ctx);
    }
  }
  addState(state) {
    if (state !== null) {
      state.atn = this;
      state.stateNumber = this.states.length;
    }
    this.states.push(state);
  }
  removeState(state) {
    this.states[state.stateNumber] = null; // just free mem, don't shift states in list
  }

  defineDecisionState(s) {
    this.decisionToState.push(s);
    s.decision = this.decisionToState.length - 1;
    return s.decision;
  }
  getDecisionState(decision) {
    if (this.decisionToState.length === 0) {
      return null;
    } else {
      return this.decisionToState[decision];
    }
  }

  /**
   * Computes the set of input symbols which could follow ATN state number
   * {@code stateNumber} in the specified full {@code context}. This method
   * considers the complete parser context, but does not evaluate semantic
   * predicates (i.e. all predicates encountered during the calculation are
   * assumed true). If a path in the ATN exists from the starting state to the
   * {@link RuleStopState} of the outermost context without matching any
   * symbols, {@link Token//EOF} is added to the returned set.
   *
   * <p>If {@code context} is {@code null}, it is treated as
   * {@link ParserRuleContext//EMPTY}.</p>
   *
   * @param stateNumber the ATN state number
   * @param ctx the full parse context
   *
   * @return {IntervalSet} The set of potentially valid input symbols which could follow the
   * specified state in the specified context.
   *
   * @throws IllegalArgumentException if the ATN does not contain a state with
   * number {@code stateNumber}
   */
  getExpectedTokens(stateNumber, ctx) {
    if (stateNumber < 0 || stateNumber >= this.states.length) {
      throw "Invalid state number.";
    }
    const s = this.states[stateNumber];
    let following = this.nextTokens(s);
    if (!following.contains(_Token.default.EPSILON)) {
      return following;
    }
    const expected = new _IntervalSet.default();
    expected.addSet(following);
    expected.removeOne(_Token.default.EPSILON);
    while (ctx !== null && ctx.invokingState >= 0 && following.contains(_Token.default.EPSILON)) {
      const invokingState = this.states[ctx.invokingState];
      const rt = invokingState.transitions[0];
      following = this.nextTokens(rt.followState);
      expected.addSet(following);
      expected.removeOne(_Token.default.EPSILON);
      ctx = ctx.parentCtx;
    }
    if (following.contains(_Token.default.EPSILON)) {
      expected.addOne(_Token.default.EOF);
    }
    return expected;
  }
}
exports.default = ATN;
ATN.INVALID_ALT_NUMBER = 0;