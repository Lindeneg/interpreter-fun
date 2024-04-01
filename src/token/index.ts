export enum TokenEnum {
    ILLEGAL,
    EOF,
    IDENT,
    INT,
    ASSIGN,
    PLUS,
    MINUS,
    BANG,
    ASTERISK,
    SLASH,
    LT,
    GT,
    COMMA,
    SEMICOLON,
    LPAREN,
    RPAREN,
    LBRACE,
    RBRACE,
    FUNCTION,
    LET,
}

export type Token = {
    type: TokenEnum;
    literal: string;
};

const keywords = new Map<string, TokenEnum>([
    ["fn", TokenEnum.FUNCTION],
    ["let", TokenEnum.LET],
]);

export const tokenEnumFromIdent = (ident: string): TokenEnum => {
    return keywords.get(ident) ?? TokenEnum.IDENT;
};

export const newToken = (tokenType: TokenEnum, char: number): Token => ({
    type: tokenType,
    literal: String.fromCharCode(char),
});
