import * as parser from "@babel/parser";
import { File, Expression } from "@babel/types";

export function makeCodeAST(code: string): File {
    let ast: File;
    try {
        ast = parser.parse(code);
        return ast;
    } catch {
        console.log("Error: can't parse JavaScript code!");
        process.exit(1);
    }
}

export function makeExpressionAST(code: string): Expression {
    let ast: Expression;
    try {
        ast = parser.parseExpression(code);
        return ast;
    } catch {
        console.log("Error: can't parse JavaScript expression!");
        process.exit(1);
    }
}
