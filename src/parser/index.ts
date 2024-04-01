import Lexer from "@/lexer";
import { LetStatement, Program, type Statement } from "@/ast";
import { newToken, defaultToken, type Token, TokenEnum } from "@/token";

class Parser {
    public errors: string[] = [];

    #lex: Lexer;
    #curToken: Token = defaultToken();
    #peekToken: Token = defaultToken();

    constructor(lex: Lexer) {
        this.#lex = lex;
        // read two tokens so both cur and peek are set
        this.#nextToken();
        this.#nextToken();
    }

    public parseProgram(): Program {
        const program = new Program();
        while (this.#curToken.type != TokenEnum.EOF) {
            const stmt = this.#parseStatement();
            if (stmt != null) {
                program.statements.push(stmt);
            }
            this.#nextToken();
        }
        return program;
    }

    #nextToken(): void {
        this.#curToken = this.#peekToken;
        this.#peekToken = this.#lex.nextToken();
    }

    #parseStatement(): Statement | null {
        switch (this.#curToken.type) {
            case TokenEnum.LET:
                return this.#parseLetStatement();
            default:
                return null;
        }
    }

    #parseLetStatement(): LetStatement | null {
        const stmt = new LetStatement(this.#curToken);
        if (!this.#expectPeek(TokenEnum.IDENT)) {
            return null;
        }
        stmt.name.token = this.#curToken;
        stmt.name.value = this.#curToken.literal;
        if (!this.#expectPeek(TokenEnum.ASSIGN)) {
            return null;
        }
        while (!this.#curTokenIs(TokenEnum.SEMICOLON)) {
            this.#nextToken();
        }
        return stmt;
    }

    #curTokenIs(t: TokenEnum): boolean {
        return this.#curToken.type === t;
    }

    #peekTokenIs(t: TokenEnum): boolean {
        return this.#peekToken.type === t;
    }

    #expectPeek(t: TokenEnum): boolean {
        if (this.#peekTokenIs(t)) {
            this.#nextToken();
            return true;
        }
        this.#peekError(t);
        return false;
    }

    #peekError(t: TokenEnum): void {
        this.errors.push(
            `expected next token.type to be '${t}' but got '${this.#peekToken.type}'`
        );
    }
}

export default Parser;
