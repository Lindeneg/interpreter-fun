import Parser from "@/parser";
import Lexer from "@/lexer";
import {
    ExpressionStatement,
    Identifier,
    Expression,
    LetStatement,
    IntegerLiteral,
    PrefixExpression,
    InfixExpression,
} from "@/ast";

describe("parser test suite", () => {
    test("parse let statements", () => {
        const { program } = newProgram(`
let x = 5;
let y = 10;
let foobar = 838383;
`);
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
        const { program } = newProgram(`
return 5;
return 10;
return 838383;
`);
        expect(program.statements.length).toBe(3);

        const tests = [["x"], ["y"], ["foobar"]];

        for (let i = 0; i < tests.length; i++) {
            const stmt = program.statements[i];
            expect(stmt.tokenLiteral()).toBe("return");
        }
    });

    test("identifier expression", () => {
        const { program } = newProgram("foobar");
        expect(program.statements.length).toBe(1);

        const stmt = program.statements[0] as ExpressionStatement;
        expect(stmt.expression).not.toBe(null);

        const ident = stmt.expression as Identifier;
        expect(ident.value).toBe("foobar");
        expect(ident.tokenLiteral()).toBe("foobar");
    });

    test("integer literal expression", () => {
        const { program } = newProgram("5");
        expect(program.statements.length).toBe(1);

        const stmt = program.statements[0] as ExpressionStatement;
        expect(stmt.expression).not.toBe(null);

        const literal = stmt.expression as IntegerLiteral;
        expect(literal.value).toBe(5);
        expect(literal.tokenLiteral()).toBe("5");
    });

    test("prefix expressions", () => {
        const tests = [
            ["!5;", "!", 5],
            ["-15;", "-", 15],
        ] as const;
        for (const [input, operator, value] of tests) {
            const { program } = newProgram(input);
            expect(program.statements.length).toBe(1);

            const stmt = program.statements[0] as ExpressionStatement;
            expect(stmt.expression).not.toBe(null);

            const expr = stmt.expression as PrefixExpression;
            expect(expr).not.toBe(null);
            expect(expr.operator).toBe(operator);

            testIntegerLiteral(expr.right, value);
        }
    });

    test("infix expressions", () => {
        const tests = [
            ["5 + 5;", 5, "+", 5],
            ["5 - 5;", 5, "-", 5],
            ["5 * 5;", 5, "*", 5],
            ["5 / 5;", 5, "/", 5],
            ["5 > 5;", 5, ">", 5],
            ["5 < 5;", 5, "<", 5],
            ["5 == 5;", 5, "==", 5],
            ["5 != 5;", 5, "!=", 5],
        ] as const;
        for (const [input, leftVal, operator, rightVal] of tests) {
            const { program } = newProgram(input);
            expect(program.statements.length).toBe(1);

            const stmt = program.statements[0] as ExpressionStatement;
            expect(stmt.expression).not.toBe(null);

            const expr = stmt.expression as InfixExpression;
            expect(expr).not.toBe(null);

            testIntegerLiteral(expr.left, leftVal);
            expect(expr.operator).toBe(operator);
            testIntegerLiteral(expr.right, rightVal);
        }
    });

    test("operator precedence", () => {
        const tests = [
            ["-a * b", "((-a) * b)"],
            ["!-a", "(!(-a))"],
            ["a + b + c", "((a + b) + c)"],
            ["a + b - c", "((a + b) - c)"],
            ["a * b * c", "((a * b) * c)"],
            ["a * b / c", "((a * b) / c)"],
            ["a + b / c", "(a + (b / c))"],
            ["a + b * c + d / e - f", "(((a + (b * c)) + (d / e)) - f)"],
            ["3 + 4; -5 * 5", "(3 + 4)((-5) * 5)"],
            ["5 > 4 == 3 < 4", "((5 > 4) == (3 < 4))"],
            ["5 < 4 != 3 > 4", "((5 < 4) != (3 > 4))"],
            [
                "3 + 4 * 5 == 3 * 1 + 4 * 5",
                "((3 + (4 * 5)) == ((3 * 1) + (4 * 5)))",
            ],
        ] as const;
        for (const [input, expected] of tests) {
            const { program } = newProgram(input);
            const actual = program.toString();
            expect(actual).toBe(expected);
        }
    });
});

const testIntegerLiteral = (expr: Expression | null, value: number) => {
    const int = expr as IntegerLiteral;
    expect(int).not.toBe(null);
    expect(int.value).toBe(value);
    expect(int.tokenLiteral()).toBe(value.toString());
};

const newProgram = (input: string) => {
    const lex = new Lexer(input);
    const parser = new Parser(lex);
    const program = parser.parseProgram();
    expect(hasParserErrors(parser)).toBe(false);
    return { lex, parser, program };
};

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
