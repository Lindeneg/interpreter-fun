import { Program, LetStatement, Identifier } from "@/ast";
import { TokenKind, newTokenStr } from "@/token";

describe("ast test suite", () => {
    test("test toString", () => {
        const program = new Program();
        const letStmt = new LetStatement();
        letStmt.name = new Identifier(
            newTokenStr(TokenKind.IDENT, "myVar"),
            "myVar"
        );
        letStmt.value = new Identifier(
            newTokenStr(TokenKind.IDENT, "anotherVar"),
            "anotherVar"
        );
        program.statements.push(letStmt);

        expect(program.toString()).toEqual("let myVar = anotherVar;");
    });
});
