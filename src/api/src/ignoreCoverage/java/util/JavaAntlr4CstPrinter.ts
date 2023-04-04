import JavaParser from "./JavaParser";
import {antlr4} from "../../util/MyAntlr4";
import JavaParserListener from "./JavaParserListener";

export class JavaAntlr4CstPrinter extends JavaParserListener{

    // define static method
    static print(ctx, key) {
        console.log("++++++++++++++++")
        console.log("key: " + key)
        let listener = new JavaAntlr4CstPrinter();
        let ast = listener.buildAST(ctx, JavaParser.ruleNames);
        console.log(JSON.stringify(ast, null, 2));
        console.log("++++++++++++++++")
    }

    buildAST(tree, ruleNames) {
        ruleNames = ruleNames || null;

        let s = antlr4.tree.Trees.getNodeText(tree, ruleNames);

        //s = antlr4.Utils.escapeWhitespace(s, false); // not found in package?
        // Copied from: http://www.java2s.com/example/java-src/pkg/org/antlr/v4/runtime/misc/utils-2e23f.html#f40721497e78566bc6b5e57f2ddd6558
        function escapeWhitespace(s, escapeSpaces) {
            let buf = '';
            for (let i = 0; i < s.length; i++) {
                let c = s.charAt(i);
                if (c === ' ' && escapeSpaces) {
                    buf += '\u00B7';
                } else if (c === '\t') {
                    buf += '\\t';
                } else if (c === '\n') {
                    buf += '\\n';
                } else if (c === '\r') {
                    buf += '\\r';
                } else {
                    buf += c;
                }
            }
            return buf;
        }
        s = escapeWhitespace(s, false);


        const c = tree.getChildCount();

        if (c === 0) {
            return s;
        }

        const res = {
            type: s, node: tree.constructor.name, children: undefined
        };

        if (c > 0) {
            s = this.buildAST(tree.getChild(0), ruleNames);
            // @ts-ignore
            res.children = [...(res.children || []), s];
        }

        for (let i = 1; i < c; i++) {
            s = this.buildAST(tree.getChild(i), ruleNames);
            // @ts-ignore
            res.children = [...(res.children || []), s];
        }

        return res;
    }
}
