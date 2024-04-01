export enum TokenEnum {
    ILLEGAL,
    EOF,
    // Identifiers and literals
    IDENT,
    INT,
    // Operators and (in)equality
    ASSIGN,
    PLUS,
    MINUS,
    BANG,
    ASTERISK,
    SLASH,
    LT,
    GT,
    EQ,
    NOT_EQ,
    // Delimiters
    COMMA,
    SEMICOLON,
    // Scope
    LPAREN,
    RPAREN,
    LBRACE,
    RBRACE,
    // Keywords
    FUNCTION,
    LET,
    TRUE,
    FALSE,
    IF,
    ELSE,
    RETURN,
    // Whitespace
    TAB,
    NEWLINE,
    CARRIAGE,
    SPACE,
    // Misc
    UNDERSCORE,
    a,
    A,
    z,
    Z,
    ZERO,
    NINE,
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

export const newToken = (tokenType: TokenEnum, char: number): Token => ({
    type: tokenType,
    literal: String.fromCharCode(char),
});
