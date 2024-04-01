import Lexer from "@/lexer";
import {
    Program,
    LetStatement,
    ReturnStatement,
    ExpressionStatement,
    Identifer,
    type Statement,
    type Expression,
} from "@/ast";
import { defaultToken, type Token, TokenEnum } from "@/token";

enum PrecedenceEnum {
    _,
    LOWEST,
    EQUALS,
    LESSGREATER,
    SUM,
    PRODUCT,
    PREFIX,
    CALL,
}

type prefixParseFn = () => Expression;
type infixParseFn = (expr: Expression) => Expression;

class Parser {
    public errors: string[] = [];

    #lex: Lexer;
    #curToken: Token = defaultToken();
    #peekToken: Token = defaultToken();
    #prefixParseFns = new Map<TokenEnum, prefixParseFn>();
    #infixParseFns = new Map<TokenEnum, infixParseFn>();

    constructor(lex: Lexer) {
        this.#lex = lex;
        this.#nextToken();
        this.#nextToken();

        this.#prefixParseFns.set(TokenEnum.IDENT, this.#parseIdentifier);
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
            case TokenEnum.RETURN:
                return this.#parseReturnStatement();
            default:
                return this.#parseExpressionStatement();
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

    #parseReturnStatement(): ReturnStatement | null {
        const stmt = new ReturnStatement(this.#curToken);
        this.#nextToken();
        while (!this.#curTokenIs(TokenEnum.SEMICOLON)) {
            this.#nextToken();
        }
        return stmt;
    }

    #parseExpressionStatement(): ExpressionStatement {
        const stmt = new ExpressionStatement(this.#curToken);
        stmt.expression = this.#parseExpression(PrecedenceEnum.LOWEST);
        if (this.#peekTokenIs(TokenEnum.SEMICOLON)) {
            this.#nextToken();
        }
        return stmt;
    }

    #parseExpression(precedence: PrecedenceEnum): Expression | null {
        const prefix = this.#prefixParseFns.get(this.#curToken.type);
        if (!prefix) return null;
        const leftExp = prefix();
        return leftExp;
    }

    // used in callback, need correct this context. javascript.. what a language..
    #parseIdentifier = (): Expression => {
        return new Identifer(this.#curToken, this.#curToken.literal);
    };

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
