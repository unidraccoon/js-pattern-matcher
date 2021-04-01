import { ObjectExpression, Statement } from "@babel/types";

import { makeCodeAST } from "../ast-builder/ast-builder";

export function makePatternAST(code: string): Statement[] | ObjectExpression {
    let patternAST = makeCodeAST(code);

    if (
        patternAST.program.body[0].type == "ExpressionStatement" &&
        patternAST.program.body[0].expression.type == "ObjectExpression"
    ) {
        return patternAST.program.body[0].expression;
    }
    return patternAST.program.body;
}
