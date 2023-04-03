//import antlr4 from 'antlr4-js-exports';

// this somehow works?
import antlr4 from '../copiedModules/antlr4-js-exports/es/index.web';

//import antlr4 from "antlr4"; // this should have worked for 4.8.0 but antlr4/atn/ATNDeserializer.js:155
//     var temp = data.split("").map(adjust); TypeError: data.split is not a function


// export antlr4 as named export
export { antlr4 };
