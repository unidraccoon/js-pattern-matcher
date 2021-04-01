// import * as fs from "fs";
// import { makePatternAST } from "./patch-parser/pattern-parser";
// import { patternMatcher } from "./subtree-matcher/subtree-matcher";
// import { makeCodeAST } from "./ast-builder/ast-builder";

// let patchFile = fs.readFileSync("patch.txt", "utf8");
// let pattern = patchFile.slice(0, patchFile.indexOf("---"));

// let patternAST = makePatternAST(pattern);
// let codeAST = makeCodeAST("router.get('/events')");

// console.log(patternMatcher(codeAST, patternAST));
