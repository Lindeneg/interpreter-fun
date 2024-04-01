export enum TokenEnum {
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
    [TokenEnum.EOF]: 0,
    [TokenEnum.TAB]: 9,
    [TokenEnum.NEWLINE]: 10,
    [TokenEnum.CARRIAGE]: 13,
    [TokenEnum.SPACE]: 32,
    [TokenEnum.BANG]: 33,
    [TokenEnum.LPAREN]: 40,
    [TokenEnum.RPAREN]: 41,
    [TokenEnum.ASTERISK]: 42,
    [TokenEnum.PLUS]: 43,
    [TokenEnum.COMMA]: 44,
    [TokenEnum.MINUS]: 45,
    [TokenEnum.SLASH]: 47,
    [TokenEnum.ZERO]: 48,
    [TokenEnum.NINE]: 57,
    [TokenEnum.SEMICOLON]: 59,
    [TokenEnum.LT]: 60,
    [TokenEnum.ASSIGN]: 61,
    [TokenEnum.GT]: 62,
    [TokenEnum.A]: 65,
    [TokenEnum.Z]: 90,
    [TokenEnum.UNDERSCORE]: 95,
    [TokenEnum.a]: 97,
    [TokenEnum.z]: 122,
    [TokenEnum.LBRACE]: 123,
    [TokenEnum.RBRACE]: 125,
} as const;

export type Token = {
    type: TokenEnum;
    literal: string;
};

export const defaultToken = (): Token => ({
    type: TokenEnum.ILLEGAL,
    literal: "",
});

const keywords = new Map<string, TokenEnum>([
    ["fn", TokenEnum.FUNCTION],
    ["let", TokenEnum.LET],
    ["true", TokenEnum.TRUE],
    ["false", TokenEnum.FALSE],
    ["if", TokenEnum.IF],
    ["else", TokenEnum.ELSE],
    ["return", TokenEnum.RETURN],
]);

export const tokenEnumFromIdent = (ident: string): TokenEnum => {
    return keywords.get(ident) ?? TokenEnum.IDENT;
};

export const newToken = (tokenType: TokenEnum, char: number): Token =>
    newTokenStr(tokenType, String.fromCharCode(char));

export const newTokenStr = (tokenType: TokenEnum, literal: string): Token => ({
    type: tokenType,
    literal,
});
