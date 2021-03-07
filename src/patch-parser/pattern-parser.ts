import { Expression } from "@babel/types";

import { makeExpressionAST } from "../ast-builder/ast-builder";

const removeASTLocation = (ast: any) => {
    if (Array.isArray(ast)) {
        ast.forEach((a) => removeASTLocation(a));
    } else if (typeof ast === "object") {
        delete ast["loc"];
        delete ast["start"];
        delete ast["end"];
        const values = Object.values(ast).filter(
            (v) => Array.isArray(v) || typeof v === "object"
        );
        removeASTLocation(values);
    }
};

export function makePatternAST(code: string): Expression {
    let patternAST = makeExpressionAST(code);
    removeASTLocation(patternAST);
    delete patternAST["comments"];
    delete patternAST["errors"];

    return patternAST;
}
