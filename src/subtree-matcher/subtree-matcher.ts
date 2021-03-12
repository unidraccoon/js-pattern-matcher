import traverse from "@babel/traverse";
import { Expression, File } from "@babel/types";
import * as fs from "fs";

import { makeCodeAST } from "../ast-builder/ast-builder";
import { makePatternAST } from "../patch-parser/pattern-parser";

function matchAST(patternAST: Expression, codeSubtreeAST: Expression): boolean {
    for (var p in patternAST) {
        if (patternAST[p] != undefined && codeSubtreeAST[p] == undefined) {
            return false;
        }
        switch (typeof patternAST[p]) {
            case "object":
                if (!matchAST(patternAST[p], codeSubtreeAST[p])) {
                    return false;
                }
                break;
            default:
                if (patternAST[p] != codeSubtreeAST[p]) {
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

let codeAST: File = makeCodeAST("let a=3; r.get('/events')");
let patternAST: Expression = makePatternAST("router.get('/events')");

console.log(patternMatcher(codeAST, patternAST));

// console.log(JSON.stringify(patternAST, null, 4));

// fs.writeFileSync("test/data/matcher-callexpr-meta.txt", JSON.stringify(patternMatcher(codeAST, patternAST), null, 4));
