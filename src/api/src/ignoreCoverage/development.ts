//import * as antlr4 from "antlr4-js-exports"
import {ParserAntlr4} from "./ParserAntlr4";

const antlr4 = require('antlr4-js-exports');

async function main() {
  console.log('Start test 2');
  let parsed = ParserAntlr4.parse('test');
    console.log('End test 2');
    console.log(parsed);
}

main();
