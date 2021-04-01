import * as vm from "vm";
import traverse from "@babel/traverse";
import { File } from "@babel/types";
import { makePatternAST } from "../patch-parser/pattern-parser";
import { makeCodeAST } from "../ast-builder/ast-builder";

const NOT_MATCHED = new Set([
    "loc",
    "start",
    "end",
    "extra",
    "id",
    "alternate",
    "leadingComments",
    "trailingComments",
    "innerComments"
]);

const COMMENT_TYPES = ["CommentBlock", "CommentLine"];

type matchType = "Statements" | "ObjectExpression";

class Matcher {
    patternAST: any;
    codeSubtreeAST: any;
    isMatch: boolean;

    metavariables: object;

    constructor(patternAST: any, codeSubtreeAST: any, type: matchType) {
        this.patternAST = patternAST;
        this.codeSubtreeAST = codeSubtreeAST;
        this.metavariables = {
            console: {
                log: (...args) => {
                    console.log(...args);
                },
            },
            exit: (exitCode: number) => {
                process.exit(exitCode);
            },
        };
        this.isMatch = false;

        if (type == "ObjectExpression") {
            this.isMatch = this.matchAST(patternAST, codeSubtreeAST);
        } else if (type == "Statements") {
            for (let i in patternAST) {
                if (!this.matchAST(patternAST[i], codeSubtreeAST[i])) {
                    this.isMatch = false;
                    break;
                } else {
                    this.isMatch = true;
                }
            }
        }
    }

    matchAST(patternAST: any, codeSubtreeAST: any): boolean {
        if (
            patternAST.type == "Identifier" &&
            patternAST.name.startsWith("$$")
        ) {
            this.metavariables[patternAST.name] = codeSubtreeAST;
            return true;
        }

        if (patternAST.arguments?.length != codeSubtreeAST.arguments?.length) {
            return false;
        }

        for (var p in patternAST) {
            if (NOT_MATCHED.has(p)) continue;

            if (patternAST[p] != undefined && codeSubtreeAST[p] == undefined) {
                return false;
            }

            switch (typeof patternAST[p]) {
                case "object":
                    if (!this.matchAST(patternAST[p], codeSubtreeAST[p])) {
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
}

export function patternMatcher(
    codeAST: File,
    patternAST: any,
    predicate: string
) {
    let foundSubtrees: string[] = [];
    if (Object.keys(patternAST).includes("type")) {
        traverse(codeAST, {
            enter(path) {
                if (path.node.type == patternAST.type) {
                    let matcher: Matcher = new Matcher(
                        patternAST,
                        path.node,
                        "ObjectExpression"
                    );
                    if (matcher.isMatch) {
                        vm.createContext(matcher.metavariables);
                        foundSubtrees.push(
                            vm.runInContext(predicate, matcher.metavariables)
                        );
                    }
                }
            },
        });
        return foundSubtrees;
    } else {
        traverse(codeAST, {
            enter(path) {
                if (path.node.body?.length == patternAST.length) {
                    let matcher: Matcher = new Matcher(
                        patternAST,
                        path.node.body,
                        "ObjectExpression"
                    );
                    if (matcher.isMatch) {
                        vm.createContext(matcher.metavariables);
                        foundSubtrees.push(
                            vm.runInContext(predicate, matcher.metavariables)
                        );
                    }
                }
            },
        });
    }
}
