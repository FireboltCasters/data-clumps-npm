//import * as antlr4 from "antlr4-js-exports"
import {JavaParserAntlr4} from "./java/JavaParserAntlr4";

async function main() {
  console.log('Start test 2');
  let parsed = JavaParserAntlr4.parse('test');
}

main();
