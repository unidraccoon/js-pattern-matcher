#!/usr/bin/env node

import * as fs from "fs";
import yargs = require("yargs/yargs");

import { parsePatch, Patch } from "./patch-parser/patch-parser";
import { makeCodeAST } from "./ast-builder/ast-builder";
import { patternMatcher } from "./subtree-matcher/subtree-matcher";
import { makePatternAST } from "./patch-parser/pattern-parser";

const argv = yargs(process.argv.slice(2))
    .usage("Usage: $0 --file [JavaScript file path] --patch [Patch file path]")
    .options({
        patch: { type: "string" },
        file: { type: "string" },
    })
    .demandOption(["patch", "file"]).argv;

let patch: Patch = parsePatch(argv.patch);

let codeAST = makeCodeAST(fs.readFileSync(argv.file, "utf8"));
let patternAST = makePatternAST(patch.pattern);

patternMatcher(codeAST, patternAST, patch.predicate);
