import { Expression } from "@babel/types";
// import traverse from "@babel/traverse";

import { makeExpressionAST } from "../ast-builder/ast-builder";

const removeASTNodes = (ast: any) => {
    if (Array.isArray(ast)) {
        ast.forEach((a) => removeASTNodes(a));
    } else if (typeof ast === "object") {
        delete ast["loc"];
        delete ast["start"];
        delete ast["end"];
        delete ast["leadingComments"];
        if (ast["trailingComments"] != undefined) {
            ast["type"] == "ObjectProperty"
                ? delete ast["value"]
                : delete ast["name"];
            delete ast["trailingComments"];
        }
        const values = Object.values(ast).filter(
            (v) => Array.isArray(v) || typeof v === "object"
        );
        removeASTNodes(values);
    }
};

export function makePatternAST(code: string): Expression {
    let patternAST = makeExpressionAST(code);
    removeASTNodes(patternAST);
    delete patternAST["comments"];
    delete patternAST["errors"];

    return patternAST;
}
