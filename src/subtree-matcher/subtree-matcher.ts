import traverse from "@babel/traverse";
import { Expression, File } from "@babel/types";
import * as fs from "fs";

// import { makeCodeAST } from "../ast-builder/ast-builder";
// import { makePatternAST } from "../patch-parser/pattern-parser";

function matchAST(patternAST: Expression, codeSubtree: Expression): boolean {
    for (var p in patternAST) {
        if (patternAST.hasOwnProperty(p) !== codeSubtree.hasOwnProperty(p)) {
            return false;
        }
        switch (typeof patternAST[p]) {
            case "object":
                if (!matchAST(patternAST[p], codeSubtree[p])) {
                    return false;
                }
                break;
            default:
                if (patternAST[p] != codeSubtree[p]) {
                    return false;
                }
        }
    }
    return true;
}

export function patternMatcher(codeAST: File, patternAST: Expression): any[] {
    let foundSubtrees: string[] = [];
    traverse(codeAST, {
        enter(path) {
            if (path.node.type == patternAST.type) {
                if (matchAST(patternAST, path.node)) {
                    foundSubtrees.push(path.node);
                }
            }
        },
    });
    return foundSubtrees;
}

// let codeAST: File = makeCodeAST("fetch({url: '/example'})");
// let patternAST: Expression = makePatternAST("{url: '/example'}");

// fs.writeFileSync("test/data/matcher-objexpr.txt", JSON.stringify([patternMatcher(codeAST, patternAST)], null, 4));
