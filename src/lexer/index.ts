import {
    newToken,
    tokenEnumFromIdent,
    ASCII,
    TokenKind,
    type Token,
} from "@/token";

const isLetter = (ch: number): boolean => {
    return (
        ch === ASCII[TokenKind.UNDERSCORE] ||
        (ASCII[TokenKind.a] <= ch && ch <= ASCII[TokenKind.z]) ||
        (ASCII[TokenKind.A] <= ch && ch <= ASCII[TokenKind.Z])
    );
};

const isDigit = (ch: number): boolean => {
    return ch >= ASCII[TokenKind.ZERO] && ch <= ASCII[TokenKind.NINE];
};

const stringToASCII = (s: string): number[] => {
    return [...s].map((c) => c.charCodeAt(0));
};

const stringFromASCII = (a: number[]): string => {
    return a.reduce((acc, cur) => {
        acc += String.fromCharCode(cur);
        return acc;
    }, "");
};

class Lexer {
    #input: number[];
    #position: number;
    #readPosition: number;
    #char: number;

    constructor(input: string) {
        this.#input = stringToASCII(input);
        this.#position = 0;
        this.#readPosition = 0;
        this.#char = 0;

        this.#readChar();
    }

    public nextToken(): Token {
        let token: Token = newToken(TokenKind.ILLEGAL, this.#char);
        this.#skipWhitespace();
        switch (this.#char) {
            case ASCII[TokenKind.EOF]:
                token = newToken(TokenKind.EOF, this.#char);
                break;
            case ASCII[TokenKind.BANG]:
                if (this.#peekChar() === ASCII[TokenKind.ASSIGN]) {
                    token.kind = TokenKind.NOT_EQ;
                    token.literal = "!=";
                    this.#readChar();
                } else {
                    token = newToken(TokenKind.BANG, this.#char);
                }
                break;
            case ASCII[TokenKind.LPAREN]:
                token = newToken(TokenKind.LPAREN, this.#char);
                break;
            case ASCII[TokenKind.RPAREN]:
                token = newToken(TokenKind.RPAREN, this.#char);
                break;
            case ASCII[TokenKind.ASTERISK]:
                token = newToken(TokenKind.ASTERISK, this.#char);
                break;
            case ASCII[TokenKind.PLUS]:
                token = newToken(TokenKind.PLUS, this.#char);
                break;
            case ASCII[TokenKind.COMMA]:
                token = newToken(TokenKind.COMMA, this.#char);
                break;
            case ASCII[TokenKind.MINUS]:
                token = newToken(TokenKind.MINUS, this.#char);
                break;
            case ASCII[TokenKind.SLASH]:
                token = newToken(TokenKind.SLASH, this.#char);
                break;
            case ASCII[TokenKind.SEMICOLON]:
                token = newToken(TokenKind.SEMICOLON, this.#char);
                break;
            case ASCII[TokenKind.LT]:
                token = newToken(TokenKind.LT, this.#char);
                break;
            case ASCII[TokenKind.ASSIGN]:
                if (this.#peekChar() === ASCII[TokenKind.ASSIGN]) {
                    token.kind = TokenKind.EQ;
                    token.literal = "==";
                    this.#readChar();
                } else {
                    token = newToken(TokenKind.ASSIGN, this.#char);
                }
                break;
            case ASCII[TokenKind.GT]:
                token = newToken(TokenKind.GT, this.#char);
                break;
            case ASCII[TokenKind.LBRACE]:
                token = newToken(TokenKind.LBRACE, this.#char);
                break;
            case ASCII[TokenKind.RBRACE]:
                token = newToken(TokenKind.RBRACE, this.#char);
                break;
            default:
                if (isLetter(this.#char)) {
                    token.literal = this.#readIdent();
                    token.kind = tokenEnumFromIdent(token.literal);
                    return token;
                } else if (isDigit(this.#char)) {
                    token.kind = TokenKind.INT;
                    token.literal = this.#readDigit();
                    return token;
                }
                break;
        }
        this.#readChar();
        return token;
    }

    #readChar() {
        if (this.#readPosition >= this.#input.length) {
            this.#char = ASCII[TokenKind.EOF];
        } else {
            this.#char = this.#input[this.#readPosition];
        }
        this.#position = this.#readPosition;
        this.#readPosition += 1;
    }

    #readDigit(): string {
        const start = this.#position;
        while (isDigit(this.#char)) {
            this.#readChar();
        }
        return stringFromASCII(this.#input.slice(start, this.#position));
    }

    #readIdent(): string {
        const start = this.#position;
        while (isLetter(this.#char)) {
            this.#readChar();
        }
        return stringFromASCII(this.#input.slice(start, this.#position));
    }

    #peekChar(): number {
        if (this.#readPosition >= this.#input.length) {
            return ASCII[TokenKind.EOF];
        }
        return this.#input[this.#readPosition];
    }

    #skipWhitespace(): void {
        while (
            this.#char === ASCII[TokenKind.TAB] ||
            this.#char === ASCII[TokenKind.NEWLINE] ||
            this.#char === ASCII[TokenKind.CARRIAGE] ||
            this.#char === ASCII[TokenKind.SPACE]
        ) {
            this.#readChar();
        }
    }
}

export default Lexer;
