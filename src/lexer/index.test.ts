import Lexer from "@/lexer";
import { TokenKind } from "@/token";

describe("can lex tokens", () => {
    const input = `let five = 5;
let ten = 10;

let add = fn(x, y) {
    x + y;
};

let result = add(five, ten);
!-/*5;
5 < 10 > 5;

if (5 < 10) {
    return true;
} else {
    return false;
}

10 == 10;
10 != 9;
`;
    const lexer = new Lexer(input);
    test.each([
        [TokenKind.LET, "let"],
        [TokenKind.IDENT, "five"],
        [TokenKind.ASSIGN, "="],
        [TokenKind.INT, "5"],
        [TokenKind.SEMICOLON, ";"],
        [TokenKind.LET, "let"],
        [TokenKind.IDENT, "ten"],
        [TokenKind.ASSIGN, "="],
        [TokenKind.INT, "10"],
        [TokenKind.SEMICOLON, ";"],
        [TokenKind.LET, "let"],
        [TokenKind.IDENT, "add"],
        [TokenKind.ASSIGN, "="],
        [TokenKind.FUNCTION, "fn"],
        [TokenKind.LPAREN, "("],
        [TokenKind.IDENT, "x"],
        [TokenKind.COMMA, ","],
        [TokenKind.IDENT, "y"],
        [TokenKind.RPAREN, ")"],
        [TokenKind.LBRACE, "{"],
        [TokenKind.IDENT, "x"],
        [TokenKind.PLUS, "+"],
        [TokenKind.IDENT, "y"],
        [TokenKind.SEMICOLON, ";"],
        [TokenKind.RBRACE, "}"],
        [TokenKind.SEMICOLON, ";"],
        [TokenKind.LET, "let"],
        [TokenKind.IDENT, "result"],
        [TokenKind.ASSIGN, "="],
        [TokenKind.IDENT, "add"],
        [TokenKind.LPAREN, "("],
        [TokenKind.IDENT, "five"],
        [TokenKind.COMMA, ","],
        [TokenKind.IDENT, "ten"],
        [TokenKind.RPAREN, ")"],
        [TokenKind.SEMICOLON, ";"],
        [TokenKind.BANG, "!"],
        [TokenKind.MINUS, "-"],
        [TokenKind.SLASH, "/"],
        [TokenKind.ASTERISK, "*"],
        [TokenKind.INT, "5"],
        [TokenKind.SEMICOLON, ";"],
        [TokenKind.INT, "5"],
        [TokenKind.LT, "<"],
        [TokenKind.INT, "10"],
        [TokenKind.GT, ">"],
        [TokenKind.INT, "5"],
        [TokenKind.SEMICOLON, ";"],
        [TokenKind.IF, "if"],
        [TokenKind.LPAREN, "("],
        [TokenKind.INT, "5"],
        [TokenKind.LT, "<"],
        [TokenKind.INT, "10"],
        [TokenKind.RPAREN, ")"],
        [TokenKind.LBRACE, "{"],
        [TokenKind.RETURN, "return"],
        [TokenKind.TRUE, "true"],
        [TokenKind.SEMICOLON, ";"],
        [TokenKind.RBRACE, "}"],
        [TokenKind.ELSE, "else"],
        [TokenKind.LBRACE, "{"],
        [TokenKind.RETURN, "return"],
        [TokenKind.FALSE, "false"],
        [TokenKind.SEMICOLON, ";"],
        [TokenKind.RBRACE, "}"],
        [TokenKind.INT, "10"],
        [TokenKind.EQ, "=="],
        [TokenKind.INT, "10"],
        [TokenKind.SEMICOLON, ";"],
        [TokenKind.INT, "10"],
        [TokenKind.NOT_EQ, "!="],
        [TokenKind.INT, "9"],
        [TokenKind.SEMICOLON, ";"],
        [TokenKind.EOF, "\x00"],
    ])("parsing (%s '%s')", (expectedType, expectedLiteral) => {
        const actualToken = lexer.nextToken();
        expect(actualToken.kind).toEqual(expectedType);
        expect(actualToken.literal).toEqual(expectedLiteral);
    });
});
