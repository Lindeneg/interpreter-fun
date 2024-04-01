import { Program, LetStatement, Identifer } from "@/ast";
import { TokenEnum, newTokenStr } from "@/token";

describe("ast test suite", () => {
    test("test toString", () => {
        const program = new Program();
        const letStmt = new LetStatement();
        letStmt.name = new Identifer(
            newTokenStr(TokenEnum.IDENT, "myVar"),
            "myVar"
        );
        letStmt.value = new Identifer(
            newTokenStr(TokenEnum.IDENT, "anotherVar"),
            "anotherVar"
        );
        program.statements.push(letStmt);

        expect(program.toString()).toEqual("let myVar = anotherVar;");
    });
});
