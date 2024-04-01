import Parser from "@/parser";
import Lexer from "@/lexer";
import { ExpressionStatement, Identifer, LetStatement } from "@/ast";

describe("parser test suite", () => {
    test("parse let statements", () => {
        const input = `
let x = 5;
let y = 10;
let foobar = 838383;
`;
        const lex = new Lexer(input);
        const parser = new Parser(lex);
        const program = parser.parseProgram();

        expect(hasParserErrors(parser)).toBe(false);
        expect(program.statements.length).toBe(3);

        const tests = [["x"], ["y"], ["foobar"]];

        for (let i = 0; i < tests.length; i++) {
            const expectedName = tests[i][0];
            const stmt = program.statements[i];
            expect(stmt.tokenLiteral()).toBe("let");
            const letStmt = stmt as LetStatement;
            expect(letStmt.name.value).toBe(expectedName);
            expect(letStmt.name.tokenLiteral()).toBe(expectedName);
        }
    });

    test("parse return statements", () => {
        const input = `
return 5;
return 10;
return 838383;
`;
        const lex = new Lexer(input);
        const parser = new Parser(lex);
        const program = parser.parseProgram();

        expect(hasParserErrors(parser)).toBe(false);
        expect(program.statements.length).toBe(3);

        const tests = [["x"], ["y"], ["foobar"]];

        for (let i = 0; i < tests.length; i++) {
            const stmt = program.statements[i];
            expect(stmt.tokenLiteral()).toBe("return");
        }
    });

    test("identifier expression", () => {
        const input = "foobar;";
        const lex = new Lexer(input);
        const parser = new Parser(lex);
        const program = parser.parseProgram();
        expect(hasParserErrors(parser)).toBe(false);
        expect(program.statements.length).toBe(1);

        const stmt = program.statements[0] as ExpressionStatement;
        expect(stmt.expression).not.toBe(null);

        const ident = stmt.expression as Identifer;
        expect(ident.value).toBe("foobar");
        expect(ident.tokenLiteral()).toBe("foobar");
    });
});

const hasParserErrors = (p: Parser): boolean => {
    if (p.errors.length === 0) {
        return false;
    }
    console.log("parser has " + p.errors.length + " errors");
    for (const err of p.errors) {
        console.log("parser error: " + err);
    }
    return true;
};
