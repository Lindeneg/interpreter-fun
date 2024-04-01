import {
    newToken,
    tokenEnumFromIdent,
    ASCII,
    TokenEnum,
    type Token,
} from "@/token";

const isLetter = (ch: number): boolean => {
    return (
        ch === ASCII[TokenEnum.UNDERSCORE] ||
        (ASCII[TokenEnum.a] <= ch && ch <= ASCII[TokenEnum.z]) ||
        (ASCII[TokenEnum.A] <= ch && ch <= ASCII[TokenEnum.Z])
    );
};

const isDigit = (ch: number): boolean => {
    return ch >= ASCII[TokenEnum.ZERO] && ch <= ASCII[TokenEnum.NINE];
};

class Lexer {
    #input: string;
    #position: number;
    #readPosition: number;
    #char: number;

    constructor(input: string) {
        this.#input = input;
        this.#position = 0;
        this.#readPosition = 0;
        this.#char = 0;

        this.#readChar();
    }

    public nextToken(): Token {
        let token: Token = newToken(TokenEnum.ILLEGAL, this.#char);
        this.#skipWhitespace();
        switch (this.#char) {
            case ASCII[TokenEnum.EOF]:
                token = newToken(TokenEnum.EOF, this.#char);
                break;
            case ASCII[TokenEnum.BANG]:
                token = newToken(TokenEnum.BANG, this.#char);
                break;
            case ASCII[TokenEnum.LPAREN]:
                token = newToken(TokenEnum.LPAREN, this.#char);
                break;
            case ASCII[TokenEnum.RPAREN]:
                token = newToken(TokenEnum.RPAREN, this.#char);
                break;
            case ASCII[TokenEnum.ASTERISK]:
                token = newToken(TokenEnum.ASTERISK, this.#char);
                break;
            case ASCII[TokenEnum.PLUS]:
                token = newToken(TokenEnum.PLUS, this.#char);
                break;
            case ASCII[TokenEnum.COMMA]:
                token = newToken(TokenEnum.COMMA, this.#char);
                break;
            case ASCII[TokenEnum.MINUS]:
                token = newToken(TokenEnum.MINUS, this.#char);
                break;
            case ASCII[TokenEnum.SLASH]:
                token = newToken(TokenEnum.SLASH, this.#char);
                break;
            case ASCII[TokenEnum.SEMICOLON]:
                token = newToken(TokenEnum.SEMICOLON, this.#char);
                break;
            case ASCII[TokenEnum.LT]:
                token = newToken(TokenEnum.LT, this.#char);
                break;
            case ASCII[TokenEnum.ASSIGN]:
                if (this.#peekChar() == ASCII[TokenEnum.ASSIGN]) {
                }
                token = newToken(TokenEnum.ASSIGN, this.#char);
                break;
            case ASCII[TokenEnum.GT]:
                token = newToken(TokenEnum.GT, this.#char);
                break;
            case ASCII[TokenEnum.LBRACE]:
                token = newToken(TokenEnum.LBRACE, this.#char);
                break;
            case ASCII[TokenEnum.RBRACE]:
                token = newToken(TokenEnum.RBRACE, this.#char);
                break;
            default:
                if (isLetter(this.#char)) {
                    token.literal = this.#readIdent();
                    token.type = tokenEnumFromIdent(token.literal);
                    return token;
                } else if (isDigit(this.#char)) {
                    token.type = TokenEnum.INT;
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
            this.#char = ASCII[TokenEnum.EOF];
        } else {
            this.#char = this.#input[this.#readPosition].charCodeAt(0);
        }
        this.#position = this.#readPosition;
        this.#readPosition += 1;
    }

    #readDigit(): string {
        const start = this.#position;
        while (isDigit(this.#char)) {
            this.#readChar();
        }
        return this.#input.slice(start, this.#position);
    }

    #readIdent(): string {
        const start = this.#position;
        while (isLetter(this.#char)) {
            this.#readChar();
        }
        return this.#input.slice(start, this.#position);
    }

    #peekChar(): number {
        if (this.#readPosition >= this.#input.length) {
            return ASCII[TokenEnum.EOF];
        }
        return this.#input[this.#readPosition].charCodeAt(0);
    }

    #skipWhitespace(): void {
        while (
            this.#char === ASCII[TokenEnum.TAB] ||
            this.#char === ASCII[TokenEnum.NEWLINE] ||
            this.#char === ASCII[TokenEnum.CARRIAGE] ||
            this.#char === ASCII[TokenEnum.SPACE]
        ) {
            this.#readChar();
        }
    }
}

export default Lexer;
