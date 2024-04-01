export enum TokenKind {
    ILLEGAL = "ILLEGAL",
    EOF = "EOF",
    // Identifiers and literals
    IDENT = "IDENT",
    INT = "INT",
    // Operators and (in)equality
    ASSIGN = "ASSIGN",
    PLUS = "PLUS",
    MINUS = "MINUS",
    BANG = "BANG",
    ASTERISK = "ASTERISK",
    SLASH = "SLASH",
    LT = "LT",
    GT = "GT",
    EQ = "EQ",
    NOT_EQ = "NOT_EQ",
    // Delimiters
    COMMA = "COMMA",
    SEMICOLON = "SEMICOLON",
    // Scope
    LPAREN = "LPAREN",
    RPAREN = "RPAREN",
    LBRACE = "LBRACE",
    RBRACE = "RBRACE",
    // Keywords
    FUNCTION = "FUNCTION",
    LET = "LET",
    TRUE = "TRUE",
    FALSE = "FALSE",
    IF = "IF",
    ELSE = "ELSE",
    RETURN = "RETURN",
    // Whitespace
    TAB = "TAB",
    NEWLINE = "NEWLINE",
    CARRIAGE = "CARRIAGE",
    SPACE = "SPACE",
    // Misc
    UNDERSCORE = "UNDERSCORE",
    a = "a",
    A = "A",
    z = "z",
    Z = "Z",
    ZERO = "0",
    NINE = "9",
}

export const ASCII = {
    [TokenKind.EOF]: 0,
    [TokenKind.TAB]: 9,
    [TokenKind.NEWLINE]: 10,
    [TokenKind.CARRIAGE]: 13,
    [TokenKind.SPACE]: 32,
    [TokenKind.BANG]: 33,
    [TokenKind.LPAREN]: 40,
    [TokenKind.RPAREN]: 41,
    [TokenKind.ASTERISK]: 42,
    [TokenKind.PLUS]: 43,
    [TokenKind.COMMA]: 44,
    [TokenKind.MINUS]: 45,
    [TokenKind.SLASH]: 47,
    [TokenKind.ZERO]: 48,
    [TokenKind.NINE]: 57,
    [TokenKind.SEMICOLON]: 59,
    [TokenKind.LT]: 60,
    [TokenKind.ASSIGN]: 61,
    [TokenKind.GT]: 62,
    [TokenKind.A]: 65,
    [TokenKind.Z]: 90,
    [TokenKind.UNDERSCORE]: 95,
    [TokenKind.a]: 97,
    [TokenKind.z]: 122,
    [TokenKind.LBRACE]: 123,
    [TokenKind.RBRACE]: 125,
} as const;

export type Token = {
    kind: TokenKind;
    literal: string;
};

export const defaultToken = (): Token => ({
    kind: TokenKind.ILLEGAL,
    literal: "",
});

const keywords = new Map<string, TokenKind>([
    ["fn", TokenKind.FUNCTION],
    ["let", TokenKind.LET],
    ["true", TokenKind.TRUE],
    ["false", TokenKind.FALSE],
    ["if", TokenKind.IF],
    ["else", TokenKind.ELSE],
    ["return", TokenKind.RETURN],
]);

export const tokenEnumFromIdent = (ident: string): TokenKind => {
    return keywords.get(ident) ?? TokenKind.IDENT;
};

export const newToken = (tokenType: TokenKind, char: number): Token =>
    newTokenStr(tokenType, String.fromCharCode(char));

export const newTokenStr = (tokenType: TokenKind, literal: string): Token => ({
    kind: tokenType,
    literal,
});
