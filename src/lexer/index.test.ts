import Lexer from ".";
import { TokenEnum } from "@/token";

describe("can lex tokens", () => {
    const input = `let five = 5;
let ten = 10;

let add = fn(x, y) {
    x + y;
};

let result = add(five, ten);
!-/*5;
5 < 10 > 5;
`;
    const lexer = new Lexer(input);
    test.each([
        [TokenEnum.LET, "let"],
        [TokenEnum.IDENT, "five"],
        [TokenEnum.ASSIGN, "="],
        [TokenEnum.INT, "5"],
        [TokenEnum.SEMICOLON, ";"],
        [TokenEnum.LET, "let"],
        [TokenEnum.IDENT, "ten"],
        [TokenEnum.ASSIGN, "="],
        [TokenEnum.INT, "10"],
        [TokenEnum.SEMICOLON, ";"],
        [TokenEnum.LET, "let"],
        [TokenEnum.IDENT, "add"],
        [TokenEnum.ASSIGN, "="],
        [TokenEnum.FUNCTION, "fn"],
        [TokenEnum.LPAREN, "("],
        [TokenEnum.IDENT, "x"],
        [TokenEnum.COMMA, ","],
        [TokenEnum.IDENT, "y"],
        [TokenEnum.RPAREN, ")"],
        [TokenEnum.LBRACE, "{"],
        [TokenEnum.IDENT, "x"],
        [TokenEnum.PLUS, "+"],
        [TokenEnum.IDENT, "y"],
        [TokenEnum.SEMICOLON, ";"],
        [TokenEnum.RBRACE, "}"],
        [TokenEnum.SEMICOLON, ";"],
        [TokenEnum.LET, "let"],
        [TokenEnum.IDENT, "result"],
        [TokenEnum.ASSIGN, "="],
        [TokenEnum.IDENT, "add"],
        [TokenEnum.LPAREN, "("],
        [TokenEnum.IDENT, "five"],
        [TokenEnum.COMMA, ","],
        [TokenEnum.IDENT, "ten"],
        [TokenEnum.RPAREN, ")"],
        [TokenEnum.SEMICOLON, ";"],
        [TokenEnum.BANG, "!"],
        [TokenEnum.MINUS, "-"],
        [TokenEnum.SLASH, "/"],
        [TokenEnum.ASTERISK, "*"],
        [TokenEnum.INT, "5"],
        [TokenEnum.SEMICOLON, ";"],
        [TokenEnum.INT, "5"],
        [TokenEnum.LT, "<"],
        [TokenEnum.INT, "10"],
        [TokenEnum.GT, ">"],
        [TokenEnum.INT, "5"],
        [TokenEnum.SEMICOLON, ";"],
        [TokenEnum.EOF, "\x00"],
    ])("parsing (%s '%s')", (expectedType, expectedLiteral) => {
        const token = lexer.nextToken();
        expect(token.type).toEqual(expectedType);
        expect(token.literal).toEqual(expectedLiteral);
    });
});
