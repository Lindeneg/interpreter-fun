import Parser from ".";
import Lexer from "@/lexer";
import { LetStatement } from "@/ast";

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
});