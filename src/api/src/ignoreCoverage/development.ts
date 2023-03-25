import {Parser} from "../";
import {SpecialFields} from "./exampleDataClumps/java";


async function main() {
  console.log('Start test');
  let parser = new Parser();
  console.log('Parser created');
  parser.addFileContentToParse('test.java', SpecialFields);
  console.log('File added');
  let result = parser.parse();
  console.log('File parsed');
  console.log(result);

  // Ignore categoryMatches

}

main();
