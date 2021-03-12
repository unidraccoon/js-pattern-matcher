import { Expression, File } from "@babel/types";
import { expect } from "chai";
import * as fs from "fs";

import { makeCodeAST } from "../src/ast-builder/ast-builder";
import { makePatternAST } from "../src/patch-parser/pattern-parser";
import { patternMatcher } from "../src/subtree-matcher/subtree-matcher";
// if you used the '@types/mocha' method to install mocha type definitions, uncomment the following line
// import 'mocha';

describe("Matcher tests", () => {
    it("should return one subtree - CallExpression", () => {
        let codeAST: File = makeCodeAST("let a=3; router.get('/events')");
        let patternAST: Expression = makePatternAST("router.get('/events')");

        const result = JSON.stringify(
            [patternMatcher(codeAST, patternAST)],
            null,
            4
        );
        let expected = fs.readFileSync(
            "./test/data/matcher-callexpr.txt",
            "utf8"
        );
        expect(result).to.equal(expected);
    });

    it("should return one subtree - ObjectExpression", () => {
        let codeAST: File = makeCodeAST("fetch({url: '/example'})");
        let patternAST: Expression = makePatternAST("{url: '/example'}");

        const result = JSON.stringify(
            [patternMatcher(codeAST, patternAST)],
            null,
            4
        );
        let expected = fs.readFileSync(
            "./test/data/matcher-objexpr.txt",
            "utf8"
        );
        expect(result).to.equal(expected);
    });

    it("should return one subtree - CallExpression with metavariable", () => {
        let codeAST: File = makeCodeAST("let a=3; r.get('/events')");
        let patternAST: Expression = makePatternAST(
            "router/**/.get('/events')"
        );

        const result = JSON.stringify(
            patternMatcher(codeAST, patternAST),
            null,
            4
        );
        let expected = fs.readFileSync(
            "./test/data/matcher-callexpr-meta.txt",
            "utf8"
        );
        expect(result).to.equal(expected);
    });

    it("should return no one subtree - CallExpression", () => {
        let codeAST: File = makeCodeAST("let a=3; r.get('/events')");
        let patternAST: Expression = makePatternAST("router.get('/events')");

        const result = JSON.stringify(
            patternMatcher(codeAST, patternAST),
            null,
            4
        );
        let expected = "[]";
        expect(result).to.equal(expected);
    });
});
