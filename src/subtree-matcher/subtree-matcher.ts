import traverse from "@babel/traverse";
import { Expression, File } from "@babel/types";

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
