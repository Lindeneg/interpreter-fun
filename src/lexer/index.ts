import { newToken, tokenEnumFromIdent, TokenEnum, type Token } from "@/token";

const isLetter = (ch: number): boolean => {
    // _ || a <-> z || A <-> Z
    return ch === 95 || (97 <= ch && ch <= 122) || (65 <= ch && ch <= 90);
};

const isDigit = (ch: number): boolean => {
    return ch >= 48 && ch <= 57;
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
            case 0:
                token = newToken(TokenEnum.EOF, this.#char);
                break;
            case 33:
                token = newToken(TokenEnum.BANG, this.#char);
                break;
            case 40:
                token = newToken(TokenEnum.LPAREN, this.#char);
                break;
            case 41:
                token = newToken(TokenEnum.RPAREN, this.#char);
                break;
            case 42:
                token = newToken(TokenEnum.ASTERISK, this.#char);
                break;
            case 43:
                token = newToken(TokenEnum.PLUS, this.#char);
                break;
            case 44:
                token = newToken(TokenEnum.COMMA, this.#char);
                break;
            case 45:
                token = newToken(TokenEnum.MINUS, this.#char);
                break;
            case 47:
                token = newToken(TokenEnum.SLASH, this.#char);
                break;
            case 59:
                token = newToken(TokenEnum.SEMICOLON, this.#char);
                break;
            case 60:
                token = newToken(TokenEnum.LT, this.#char);
                break;
            case 61:
                token = newToken(TokenEnum.ASSIGN, this.#char);
                break;
            case 62:
                token = newToken(TokenEnum.GT, this.#char);
                break;
            case 123:
                token = newToken(TokenEnum.LBRACE, this.#char);
                break;
            case 125:
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
            this.#char = 0;
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

    #skipWhitespace(): void {
        // "\t" || "\n" || "\r" || " "
        while (
            this.#char === 9 ||
            this.#char === 10 ||
            this.#char === 13 ||
            this.#char === 32
        ) {
            this.#readChar();
        }
    }
}

export default Lexer;
