"use strict";
//const chevrotain = require("chevrotain");
import * as chevrotain from "chevrotain";
//const { allTokens } = require("./tokens");
import { allTokens } from "./tokens";
//const { getSkipValidations } = require("./utils");
import { getSkipValidations } from "./utils";

const Lexer = chevrotain.Lexer;
const JavaLexer = new Lexer(allTokens, {
  ensureOptimizations: true,
  skipValidations: getSkipValidations()
});

//module.exports = JavaLexer;

export {
  JavaLexer
};
