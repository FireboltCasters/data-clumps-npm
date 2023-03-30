"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _Token = _interopRequireDefault(require("../Token.js"));
var _ATN = _interopRequireDefault(require("./ATN.js"));
var _ATNType = _interopRequireDefault(require("./ATNType.js"));
var _ATNState = _interopRequireDefault(require("../state/ATNState.js"));
var _BasicState = _interopRequireDefault(require("../state/BasicState.js"));
var _DecisionState = _interopRequireDefault(require("../state/DecisionState.js"));
var _BlockStartState = _interopRequireDefault(require("../state/BlockStartState.js"));
var _BlockEndState = _interopRequireDefault(require("../state/BlockEndState.js"));
var _LoopEndState = _interopRequireDefault(require("../state/LoopEndState.js"));
var _RuleStartState = _interopRequireDefault(require("../state/RuleStartState.js"));
var _RuleStopState = _interopRequireDefault(require("../state/RuleStopState.js"));
var _TokensStartState = _interopRequireDefault(require("../state/TokensStartState.js"));
var _PlusLoopbackState = _interopRequireDefault(require("../state/PlusLoopbackState.js"));
var _StarLoopbackState = _interopRequireDefault(require("../state/StarLoopbackState.js"));
var _StarLoopEntryState = _interopRequireDefault(require("../state/StarLoopEntryState.js"));
var _PlusBlockStartState = _interopRequireDefault(require("../state/PlusBlockStartState.js"));
var _StarBlockStartState = _interopRequireDefault(require("../state/StarBlockStartState.js"));
var _BasicBlockStartState = _interopRequireDefault(require("../state/BasicBlockStartState.js"));
var _Transition = _interopRequireDefault(require("../transition/Transition.js"));
var _AtomTransition = _interopRequireDefault(require("../transition/AtomTransition.js"));
var _SetTransition = _interopRequireDefault(require("../transition/SetTransition.js"));
var _NotSetTransition = _interopRequireDefault(require("../transition/NotSetTransition.js"));
var _RuleTransition = _interopRequireDefault(require("../transition/RuleTransition.js"));
var _RangeTransition = _interopRequireDefault(require("../transition/RangeTransition.js"));
var _ActionTransition = _interopRequireDefault(require("../transition/ActionTransition.js"));
var _EpsilonTransition = _interopRequireDefault(require("../transition/EpsilonTransition.js"));
var _WildcardTransition = _interopRequireDefault(require("../transition/WildcardTransition.js"));
var _PredicateTransition = _interopRequireDefault(require("../transition/PredicateTransition.js"));
var _PrecedencePredicateTransition = _interopRequireDefault(require("../transition/PrecedencePredicateTransition.js"));
var _IntervalSet = _interopRequireDefault(require("../misc/IntervalSet.js"));
var _ATNDeserializationOptions = _interopRequireDefault(require("./ATNDeserializationOptions.js"));
var _LexerActionType = _interopRequireDefault(require("./LexerActionType.js"));
var _LexerSkipAction = _interopRequireDefault(require("../action/LexerSkipAction.js"));
var _LexerChannelAction = _interopRequireDefault(require("../action/LexerChannelAction.js"));
var _LexerCustomAction = _interopRequireDefault(require("../action/LexerCustomAction.js"));
var _LexerMoreAction = _interopRequireDefault(require("../action/LexerMoreAction.js"));
var _LexerTypeAction = _interopRequireDefault(require("../action/LexerTypeAction.js"));
var _LexerPushModeAction = _interopRequireDefault(require("../action/LexerPushModeAction.js"));
var _LexerPopModeAction = _interopRequireDefault(require("../action/LexerPopModeAction.js"));
var _LexerModeAction = _interopRequireDefault(require("../action/LexerModeAction.js"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
/* Copyright (c) 2012-2022 The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

const SERIALIZED_VERSION = 4;
function initArray(length, value) {
  const tmp = [];
  tmp[length - 1] = value;
  return tmp.map(function (i) {
    return value;
  });
}
class ATNDeserializer {
  constructor(options) {
    if (options === undefined || options === null) {
      options = _ATNDeserializationOptions.default.defaultOptions;
    }
    this.deserializationOptions = options;
    this.stateFactories = null;
    this.actionFactories = null;
  }
  deserialize(data) {
    const legacy = this.reset(data);
    this.checkVersion(legacy);
    if (legacy) this.skipUUID();
    const atn = this.readATN();
    this.readStates(atn, legacy);
    this.readRules(atn, legacy);
    this.readModes(atn);
    const sets = [];
    this.readSets(atn, sets, this.readInt.bind(this));
    if (legacy) this.readSets(atn, sets, this.readInt32.bind(this));
    this.readEdges(atn, sets);
    this.readDecisions(atn);
    this.readLexerActions(atn, legacy);
    this.markPrecedenceDecisions(atn);
    this.verifyATN(atn);
    if (this.deserializationOptions.generateRuleBypassTransitions && atn.grammarType === _ATNType.default.PARSER) {
      this.generateRuleBypassTransitions(atn);
      // re-verify after modification
      this.verifyATN(atn);
    }
    return atn;
  }
  reset(data) {
    const version = data.charCodeAt ? data.charCodeAt(0) : data[0];
    if (version === SERIALIZED_VERSION - 1) {
      const adjust = function (c) {
        const v = c.charCodeAt(0);
        return v > 1 ? v - 2 : v + 65534;
      };
      const temp = data.split("").map(adjust);
      // don't adjust the first value since that's the version number
      temp[0] = data.charCodeAt(0);
      this.data = temp;
      this.pos = 0;
      return true;
    } else {
      this.data = data;
      this.pos = 0;
      return false;
    }
  }
  skipUUID() {
    let count = 0;
    while (count++ < 8) this.readInt();
  }
  checkVersion(legacy) {
    const version = this.readInt();
    if (!legacy && version !== SERIALIZED_VERSION) {
      throw "Could not deserialize ATN with version " + version + " (expected " + SERIALIZED_VERSION + ").";
    }
  }
  readATN() {
    const grammarType = this.readInt();
    const maxTokenType = this.readInt();
    return new _ATN.default(grammarType, maxTokenType);
  }
  readStates(atn, legacy) {
    let j, pair, stateNumber;
    const loopBackStateNumbers = [];
    const endStateNumbers = [];
    const nstates = this.readInt();
    for (let i = 0; i < nstates; i++) {
      const stype = this.readInt();
      // ignore bad type of states
      if (stype === _ATNState.default.INVALID_TYPE) {
        atn.addState(null);
        continue;
      }
      let ruleIndex = this.readInt();
      if (legacy && ruleIndex === 0xFFFF) {
        ruleIndex = -1;
      }
      const s = this.stateFactory(stype, ruleIndex);
      if (stype === _ATNState.default.LOOP_END) {
        // special case
        const loopBackStateNumber = this.readInt();
        loopBackStateNumbers.push([s, loopBackStateNumber]);
      } else if (s instanceof _BlockStartState.default) {
        const endStateNumber = this.readInt();
        endStateNumbers.push([s, endStateNumber]);
      }
      atn.addState(s);
    }
    // delay the assignment of loop back and end states until we know all the
    // state instances have been initialized
    for (j = 0; j < loopBackStateNumbers.length; j++) {
      pair = loopBackStateNumbers[j];
      pair[0].loopBackState = atn.states[pair[1]];
    }
    for (j = 0; j < endStateNumbers.length; j++) {
      pair = endStateNumbers[j];
      pair[0].endState = atn.states[pair[1]];
    }
    let numNonGreedyStates = this.readInt();
    for (j = 0; j < numNonGreedyStates; j++) {
      stateNumber = this.readInt();
      atn.states[stateNumber].nonGreedy = true;
    }
    let numPrecedenceStates = this.readInt();
    for (j = 0; j < numPrecedenceStates; j++) {
      stateNumber = this.readInt();
      atn.states[stateNumber].isPrecedenceRule = true;
    }
  }
  readRules(atn, legacy) {
    let i;
    const nrules = this.readInt();
    if (atn.grammarType === _ATNType.default.LEXER) {
      atn.ruleToTokenType = initArray(nrules, 0);
    }
    atn.ruleToStartState = initArray(nrules, 0);
    for (i = 0; i < nrules; i++) {
      const s = this.readInt();
      atn.ruleToStartState[i] = atn.states[s];
      if (atn.grammarType === _ATNType.default.LEXER) {
        let tokenType = this.readInt();
        if (legacy && tokenType === 0xFFFF) {
          tokenType = _Token.default.EOF;
        }
        atn.ruleToTokenType[i] = tokenType;
      }
    }
    atn.ruleToStopState = initArray(nrules, 0);
    for (i = 0; i < atn.states.length; i++) {
      const state = atn.states[i];
      if (!(state instanceof _RuleStopState.default)) {
        continue;
      }
      atn.ruleToStopState[state.ruleIndex] = state;
      atn.ruleToStartState[state.ruleIndex].stopState = state;
    }
  }
  readModes(atn) {
    const nmodes = this.readInt();
    for (let i = 0; i < nmodes; i++) {
      let s = this.readInt();
      atn.modeToStartState.push(atn.states[s]);
    }
  }
  readSets(atn, sets, reader) {
    const m = this.readInt();
    for (let i = 0; i < m; i++) {
      const iset = new _IntervalSet.default();
      sets.push(iset);
      const n = this.readInt();
      const containsEof = this.readInt();
      if (containsEof !== 0) {
        iset.addOne(-1);
      }
      for (let j = 0; j < n; j++) {
        const i1 = reader();
        const i2 = reader();
        iset.addRange(i1, i2);
      }
    }
  }
  readEdges(atn, sets) {
    let i, j, state, trans, target;
    const nedges = this.readInt();
    for (i = 0; i < nedges; i++) {
      const src = this.readInt();
      const trg = this.readInt();
      const ttype = this.readInt();
      const arg1 = this.readInt();
      const arg2 = this.readInt();
      const arg3 = this.readInt();
      trans = this.edgeFactory(atn, ttype, src, trg, arg1, arg2, arg3, sets);
      const srcState = atn.states[src];
      srcState.addTransition(trans);
    }
    // edges for rule stop states can be derived, so they aren't serialized
    for (i = 0; i < atn.states.length; i++) {
      state = atn.states[i];
      for (j = 0; j < state.transitions.length; j++) {
        const t = state.transitions[j];
        if (!(t instanceof _RuleTransition.default)) {
          continue;
        }
        let outermostPrecedenceReturn = -1;
        if (atn.ruleToStartState[t.target.ruleIndex].isPrecedenceRule) {
          if (t.precedence === 0) {
            outermostPrecedenceReturn = t.target.ruleIndex;
          }
        }
        trans = new _EpsilonTransition.default(t.followState, outermostPrecedenceReturn);
        atn.ruleToStopState[t.target.ruleIndex].addTransition(trans);
      }
    }
    for (i = 0; i < atn.states.length; i++) {
      state = atn.states[i];
      if (state instanceof _BlockStartState.default) {
        // we need to know the end state to set its start state
        if (state.endState === null) {
          throw "IllegalState";
        }
        // block end states can only be associated to a single block start
        // state
        if (state.endState.startState !== null) {
          throw "IllegalState";
        }
        state.endState.startState = state;
      }
      if (state instanceof _PlusLoopbackState.default) {
        for (j = 0; j < state.transitions.length; j++) {
          target = state.transitions[j].target;
          if (target instanceof _PlusBlockStartState.default) {
            target.loopBackState = state;
          }
        }
      } else if (state instanceof _StarLoopbackState.default) {
        for (j = 0; j < state.transitions.length; j++) {
          target = state.transitions[j].target;
          if (target instanceof _StarLoopEntryState.default) {
            target.loopBackState = state;
          }
        }
      }
    }
  }
  readDecisions(atn) {
    const ndecisions = this.readInt();
    for (let i = 0; i < ndecisions; i++) {
      const s = this.readInt();
      const decState = atn.states[s];
      atn.decisionToState.push(decState);
      decState.decision = i;
    }
  }
  readLexerActions(atn, legacy) {
    if (atn.grammarType === _ATNType.default.LEXER) {
      const count = this.readInt();
      atn.lexerActions = initArray(count, null);
      for (let i = 0; i < count; i++) {
        const actionType = this.readInt();
        let data1 = this.readInt();
        if (legacy && data1 === 0xFFFF) {
          data1 = -1;
        }
        let data2 = this.readInt();
        if (legacy && data2 === 0xFFFF) {
          data2 = -1;
        }
        atn.lexerActions[i] = this.lexerActionFactory(actionType, data1, data2);
      }
    }
  }
  generateRuleBypassTransitions(atn) {
    let i;
    const count = atn.ruleToStartState.length;
    for (i = 0; i < count; i++) {
      atn.ruleToTokenType[i] = atn.maxTokenType + i + 1;
    }
    for (i = 0; i < count; i++) {
      this.generateRuleBypassTransition(atn, i);
    }
  }
  generateRuleBypassTransition(atn, idx) {
    let i, state;
    const bypassStart = new _BasicBlockStartState.default();
    bypassStart.ruleIndex = idx;
    atn.addState(bypassStart);
    const bypassStop = new _BlockEndState.default();
    bypassStop.ruleIndex = idx;
    atn.addState(bypassStop);
    bypassStart.endState = bypassStop;
    atn.defineDecisionState(bypassStart);
    bypassStop.startState = bypassStart;
    let excludeTransition = null;
    let endState = null;
    if (atn.ruleToStartState[idx].isPrecedenceRule) {
      // wrap from the beginning of the rule to the StarLoopEntryState
      endState = null;
      for (i = 0; i < atn.states.length; i++) {
        state = atn.states[i];
        if (this.stateIsEndStateFor(state, idx)) {
          endState = state;
          excludeTransition = state.loopBackState.transitions[0];
          break;
        }
      }
      if (excludeTransition === null) {
        throw "Couldn't identify final state of the precedence rule prefix section.";
      }
    } else {
      endState = atn.ruleToStopState[idx];
    }

    // all non-excluded transitions that currently target end state need to
    // target blockEnd instead
    for (i = 0; i < atn.states.length; i++) {
      state = atn.states[i];
      for (let j = 0; j < state.transitions.length; j++) {
        const transition = state.transitions[j];
        if (transition === excludeTransition) {
          continue;
        }
        if (transition.target === endState) {
          transition.target = bypassStop;
        }
      }
    }

    // all transitions leaving the rule start state need to leave blockStart
    // instead
    const ruleToStartState = atn.ruleToStartState[idx];
    const count = ruleToStartState.transitions.length;
    while (count > 0) {
      bypassStart.addTransition(ruleToStartState.transitions[count - 1]);
      ruleToStartState.transitions = ruleToStartState.transitions.slice(-1);
    }
    // link the new states
    atn.ruleToStartState[idx].addTransition(new _EpsilonTransition.default(bypassStart));
    bypassStop.addTransition(new _EpsilonTransition.default(endState));
    const matchState = new _BasicState.default();
    atn.addState(matchState);
    matchState.addTransition(new _AtomTransition.default(bypassStop, atn.ruleToTokenType[idx]));
    bypassStart.addTransition(new _EpsilonTransition.default(matchState));
  }
  stateIsEndStateFor(state, idx) {
    if (state.ruleIndex !== idx) {
      return null;
    }
    if (!(state instanceof _StarLoopEntryState.default)) {
      return null;
    }
    const maybeLoopEndState = state.transitions[state.transitions.length - 1].target;
    if (!(maybeLoopEndState instanceof _LoopEndState.default)) {
      return null;
    }
    if (maybeLoopEndState.epsilonOnlyTransitions && maybeLoopEndState.transitions[0].target instanceof _RuleStopState.default) {
      return state;
    } else {
      return null;
    }
  }

  /**
   * Analyze the {@link StarLoopEntryState} states in the specified ATN to set
   * the {@link StarLoopEntryState//isPrecedenceDecision} field to the
   * correct value.
   * @param atn The ATN.
   */
  markPrecedenceDecisions(atn) {
    for (let i = 0; i < atn.states.length; i++) {
      const state = atn.states[i];
      if (!(state instanceof _StarLoopEntryState.default)) {
        continue;
      }
      // We analyze the ATN to determine if this ATN decision state is the
      // decision for the closure block that determines whether a
      // precedence rule should continue or complete.
      if (atn.ruleToStartState[state.ruleIndex].isPrecedenceRule) {
        const maybeLoopEndState = state.transitions[state.transitions.length - 1].target;
        if (maybeLoopEndState instanceof _LoopEndState.default) {
          if (maybeLoopEndState.epsilonOnlyTransitions && maybeLoopEndState.transitions[0].target instanceof _RuleStopState.default) {
            state.isPrecedenceDecision = true;
          }
        }
      }
    }
  }
  verifyATN(atn) {
    if (!this.deserializationOptions.verifyATN) {
      return;
    }
    // verify assumptions
    for (let i = 0; i < atn.states.length; i++) {
      const state = atn.states[i];
      if (state === null) {
        continue;
      }
      this.checkCondition(state.epsilonOnlyTransitions || state.transitions.length <= 1);
      if (state instanceof _PlusBlockStartState.default) {
        this.checkCondition(state.loopBackState !== null);
      } else if (state instanceof _StarLoopEntryState.default) {
        this.checkCondition(state.loopBackState !== null);
        this.checkCondition(state.transitions.length === 2);
        if (state.transitions[0].target instanceof _StarBlockStartState.default) {
          this.checkCondition(state.transitions[1].target instanceof _LoopEndState.default);
          this.checkCondition(!state.nonGreedy);
        } else if (state.transitions[0].target instanceof _LoopEndState.default) {
          this.checkCondition(state.transitions[1].target instanceof _StarBlockStartState.default);
          this.checkCondition(state.nonGreedy);
        } else {
          throw "IllegalState";
        }
      } else if (state instanceof _StarLoopbackState.default) {
        this.checkCondition(state.transitions.length === 1);
        this.checkCondition(state.transitions[0].target instanceof _StarLoopEntryState.default);
      } else if (state instanceof _LoopEndState.default) {
        this.checkCondition(state.loopBackState !== null);
      } else if (state instanceof _RuleStartState.default) {
        this.checkCondition(state.stopState !== null);
      } else if (state instanceof _BlockStartState.default) {
        this.checkCondition(state.endState !== null);
      } else if (state instanceof _BlockEndState.default) {
        this.checkCondition(state.startState !== null);
      } else if (state instanceof _DecisionState.default) {
        this.checkCondition(state.transitions.length <= 1 || state.decision >= 0);
      } else {
        this.checkCondition(state.transitions.length <= 1 || state instanceof _RuleStopState.default);
      }
    }
  }
  checkCondition(condition, message) {
    if (!condition) {
      if (message === undefined || message === null) {
        message = "IllegalState";
      }
      throw message;
    }
  }
  readInt() {
    return this.data[this.pos++];
  }
  readInt32() {
    const low = this.readInt();
    const high = this.readInt();
    return low | high << 16;
  }
  edgeFactory(atn, type, src, trg, arg1, arg2, arg3, sets) {
    const target = atn.states[trg];
    switch (type) {
      case _Transition.default.EPSILON:
        return new _EpsilonTransition.default(target);
      case _Transition.default.RANGE:
        return arg3 !== 0 ? new _RangeTransition.default(target, _Token.default.EOF, arg2) : new _RangeTransition.default(target, arg1, arg2);
      case _Transition.default.RULE:
        return new _RuleTransition.default(atn.states[arg1], arg2, arg3, target);
      case _Transition.default.PREDICATE:
        return new _PredicateTransition.default(target, arg1, arg2, arg3 !== 0);
      case _Transition.default.PRECEDENCE:
        return new _PrecedencePredicateTransition.default(target, arg1);
      case _Transition.default.ATOM:
        return arg3 !== 0 ? new _AtomTransition.default(target, _Token.default.EOF) : new _AtomTransition.default(target, arg1);
      case _Transition.default.ACTION:
        return new _ActionTransition.default(target, arg1, arg2, arg3 !== 0);
      case _Transition.default.SET:
        return new _SetTransition.default(target, sets[arg1]);
      case _Transition.default.NOT_SET:
        return new _NotSetTransition.default(target, sets[arg1]);
      case _Transition.default.WILDCARD:
        return new _WildcardTransition.default(target);
      default:
        throw "The specified transition type: " + type + " is not valid.";
    }
  }
  stateFactory(type, ruleIndex) {
    if (this.stateFactories === null) {
      const sf = [];
      sf[_ATNState.default.INVALID_TYPE] = null;
      sf[_ATNState.default.BASIC] = () => new _BasicState.default();
      sf[_ATNState.default.RULE_START] = () => new _RuleStartState.default();
      sf[_ATNState.default.BLOCK_START] = () => new _BasicBlockStartState.default();
      sf[_ATNState.default.PLUS_BLOCK_START] = () => new _PlusBlockStartState.default();
      sf[_ATNState.default.STAR_BLOCK_START] = () => new _StarBlockStartState.default();
      sf[_ATNState.default.TOKEN_START] = () => new _TokensStartState.default();
      sf[_ATNState.default.RULE_STOP] = () => new _RuleStopState.default();
      sf[_ATNState.default.BLOCK_END] = () => new _BlockEndState.default();
      sf[_ATNState.default.STAR_LOOP_BACK] = () => new _StarLoopbackState.default();
      sf[_ATNState.default.STAR_LOOP_ENTRY] = () => new _StarLoopEntryState.default();
      sf[_ATNState.default.PLUS_LOOP_BACK] = () => new _PlusLoopbackState.default();
      sf[_ATNState.default.LOOP_END] = () => new _LoopEndState.default();
      this.stateFactories = sf;
    }
    if (type > this.stateFactories.length || this.stateFactories[type] === null) {
      throw "The specified state type " + type + " is not valid.";
    } else {
      const s = this.stateFactories[type]();
      if (s !== null) {
        s.ruleIndex = ruleIndex;
        return s;
      }
    }
  }
  lexerActionFactory(type, data1, data2) {
    if (this.actionFactories === null) {
      const af = [];
      af[_LexerActionType.default.CHANNEL] = (data1, data2) => new _LexerChannelAction.default(data1);
      af[_LexerActionType.default.CUSTOM] = (data1, data2) => new _LexerCustomAction.default(data1, data2);
      af[_LexerActionType.default.MODE] = (data1, data2) => new _LexerModeAction.default(data1);
      af[_LexerActionType.default.MORE] = (data1, data2) => _LexerMoreAction.default.INSTANCE;
      af[_LexerActionType.default.POP_MODE] = (data1, data2) => _LexerPopModeAction.default.INSTANCE;
      af[_LexerActionType.default.PUSH_MODE] = (data1, data2) => new _LexerPushModeAction.default(data1);
      af[_LexerActionType.default.SKIP] = (data1, data2) => _LexerSkipAction.default.INSTANCE;
      af[_LexerActionType.default.TYPE] = (data1, data2) => new _LexerTypeAction.default(data1);
      this.actionFactories = af;
    }
    if (type > this.actionFactories.length || this.actionFactories[type] === null) {
      throw "The specified lexer action type " + type + " is not valid.";
    } else {
      return this.actionFactories[type](data1, data2);
    }
  }
}
exports.default = ATNDeserializer;