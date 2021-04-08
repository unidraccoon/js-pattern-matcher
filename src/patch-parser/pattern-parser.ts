import { Expression, Statement } from "@babel/types";

import { makeCodeAST } from "../ast-builder/ast-builder";

export function makePatternAST(code: string): Statement[] | Expression {
    let patternAST = makeCodeAST(code);

    if (
        patternAST.program.body.length == 1 &&
        patternAST.program.body[0].type == "ExpressionStatement"
    ) {
        return patternAST.program.body[0].expression;
    }

    return patternAST.program.body;
}
