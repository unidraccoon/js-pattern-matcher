#!/usr/bin/env node

import * as fs from "fs";
import yargs = require("yargs/yargs");
import * as walk from "walkdir";

import { parsePatch, Patch } from "./patch-parser/patch-parser";
import { makeCodeAST } from "./ast-builder/ast-builder";
import { patternMatcher } from "./subtree-matcher/subtree-matcher";
import { makePatternAST } from "./patch-parser/pattern-parser";

const argv = yargs(process.argv.slice(2))
    .usage("Usage: $0 --file [JavaScript file path of folder] --patch [Patch file path]")
    .options({
        patch: { type: "string" },
        file: { type: "string" },
    })
    .demandOption(["patch", "file"]).argv;

let patch: Patch = parsePatch(argv.patch);
let patternAST = makePatternAST(patch.pattern);

if (argv.file.endsWith(".js")) {
    let codeAST = makeCodeAST(fs.readFileSync(argv.file, "utf8"));
    patternMatcher(codeAST, patternAST, patch.predicate);
} else {
    walk.sync(argv.file, function (path, stat) {
        if (path.endsWith(".js")) {
            let codeAST = makeCodeAST(fs.readFileSync(path, "utf8"));
            patternMatcher(codeAST, patternAST, patch.predicate);
        }
    });
}
