//import * as antlr4 from "antlr4-js-exports"
import {JavaParserAntlr4} from "./java/JavaParserAntlr4";

async function main() {

  let input = `
public class Fields1 {
    private String normalString;
    private ArrayList<String> arrayListWithString;
    private ArrayList<Integer> arrayListWithIntegerObject;
    private Map<ArrayList<String>, Integer> mapWithArrayListOfStringAndInteger;
}
`
  let parsed = JavaParserAntlr4.parse(input);
}

main();
