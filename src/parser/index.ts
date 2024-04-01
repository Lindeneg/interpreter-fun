import Lexer from "@/lexer";
import {
    Program,
    LetStatement,
    ReturnStatement,
    ExpressionStatement,
    Identifier,
    IntegerLiteral,
    PrefixExpression,
    InfixExpression,
    type Statement,
    type Expression,
} from "@/ast";
import { defaultToken, type Token, TokenKind } from "@/token";

enum PrecedenceKind {
    _,
    LOWEST,
    EQUALS,
    LESSGREATER,
    SUM,
    PRODUCT,
    PREFIX,
    CALL,
}

const precedences = new Map<TokenKind, PrecedenceKind>([
    [TokenKind.EQ, PrecedenceKind.EQUALS],
    [TokenKind.NOT_EQ, PrecedenceKind.EQUALS],
    [TokenKind.LT, PrecedenceKind.LESSGREATER],
    [TokenKind.GT, PrecedenceKind.LESSGREATER],
    [TokenKind.PLUS, PrecedenceKind.SUM],
    [TokenKind.MINUS, PrecedenceKind.SUM],
    [TokenKind.SLASH, PrecedenceKind.PRODUCT],
    [TokenKind.ASTERISK, PrecedenceKind.PRODUCT],
]);

type prefixParseFn = () => Expression | null;
type infixParseFn = (expr: Expression) => Expression | null;

class Parser {
    public errors: string[] = [];

    #lex: Lexer;
    #curToken: Token = defaultToken();
    #peekToken: Token = defaultToken();
    #prefixParseFns = new Map<TokenKind, prefixParseFn>();
    #infixParseFns = new Map<TokenKind, infixParseFn>();

    constructor(lex: Lexer) {
        this.#registerPrecedenceParsers();

        this.#lex = lex;
        this.#nextToken();
        this.#nextToken();
    }

    public parseProgram(): Program {
        const program = new Program();
        while (this.#curToken.kind != TokenKind.EOF) {
            const stmt = this.#parseStatement();
            if (stmt !== null) {
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
        switch (this.#curToken.kind) {
            case TokenKind.LET:
                return this.#parseLetStatement();
            case TokenKind.RETURN:
                return this.#parseReturnStatement();
            default:
                return this.#parseExpressionStatement();
        }
    }

    #parseLetStatement(): LetStatement | null {
        const stmt = new LetStatement(this.#curToken);
        if (!this.#expectPeek(TokenKind.IDENT)) {
            return null;
        }
        stmt.name.token = this.#curToken;
        stmt.name.value = this.#curToken.literal;
        if (!this.#expectPeek(TokenKind.ASSIGN)) {
            return null;
        }
        while (!this.#curTokenIs(TokenKind.SEMICOLON)) {
            this.#nextToken();
        }
        return stmt;
    }

    #parseReturnStatement(): ReturnStatement | null {
        const stmt = new ReturnStatement(this.#curToken);
        this.#nextToken();
        while (!this.#curTokenIs(TokenKind.SEMICOLON)) {
            this.#nextToken();
        }
        return stmt;
    }

    #parseExpressionStatement(): ExpressionStatement {
        const stmt = new ExpressionStatement(this.#curToken);
        stmt.expression = this.#parseExpression(PrecedenceKind.LOWEST);
        if (this.#peekTokenIs(TokenKind.SEMICOLON)) {
            this.#nextToken();
        }
        return stmt;
    }

    #parseExpression(precedence: PrecedenceKind): Expression | null {
        const prefix = this.#prefixParseFns.get(this.#curToken.kind);
        if (!prefix) {
            this.errors.push(
                `no prefix parse fn found for '${this.#curToken.kind}'`
            );
            return null;
        }
        let leftExp = prefix();

        if (leftExp === null) return null;

        while (
            !this.#peekTokenIs(TokenKind.SEMICOLON) &&
            precedence < this.#peekPrecedence()
        ) {
            const infix = this.#infixParseFns.get(this.#peekToken.kind);
            if (!infix) return leftExp;
            this.#nextToken();
            const tmp = infix(leftExp);
            if (tmp === null) {
                return null;
            }
            leftExp = tmp;
        }

        return leftExp;
    }

    #curPrecedence(): PrecedenceKind {
        return precedences.get(this.#curToken.kind) ?? PrecedenceKind.LOWEST;
    }

    #peekPrecedence(): PrecedenceKind {
        return precedences.get(this.#peekToken.kind) ?? PrecedenceKind.LOWEST;
    }

    #curTokenIs(t: TokenKind): boolean {
        return this.#curToken.kind === t;
    }

    #peekTokenIs(t: TokenKind): boolean {
        return this.#peekToken.kind === t;
    }

    #expectPeek(t: TokenKind): boolean {
        if (this.#peekTokenIs(t)) {
            this.#nextToken();
            return true;
        }
        this.#peekError(t);
        return false;
    }

    #peekError(t: TokenKind): void {
        this.errors.push(
            `expected next token.type to be '${t}' but got '${this.#peekToken.kind}'`
        );
    }

    #registerPrecedenceParsers() {
        this.#prefixParseFns.set(TokenKind.IDENT, this.#parseIdentifier);
        this.#prefixParseFns.set(TokenKind.INT, this.#parseIntegerLiteral);
        this.#prefixParseFns.set(TokenKind.BANG, this.#parsePrefixExpression);
        this.#prefixParseFns.set(TokenKind.MINUS, this.#parsePrefixExpression);

        this.#infixParseFns.set(TokenKind.PLUS, this.#parseInfixExpression);
        this.#infixParseFns.set(TokenKind.MINUS, this.#parseInfixExpression);
        this.#infixParseFns.set(TokenKind.SLASH, this.#parseInfixExpression);
        this.#infixParseFns.set(TokenKind.ASTERISK, this.#parseInfixExpression);
        this.#infixParseFns.set(TokenKind.EQ, this.#parseInfixExpression);
        this.#infixParseFns.set(TokenKind.NOT_EQ, this.#parseInfixExpression);
        this.#infixParseFns.set(TokenKind.LT, this.#parseInfixExpression);
        this.#infixParseFns.set(TokenKind.GT, this.#parseInfixExpression);
    }

    // below methods uses arrow fns to set needed 'this' context. javascript sigh..
    #parseIntegerLiteral = (): Expression | null => {
        const value = Number.parseInt(this.#curToken.literal, 10);
        if (Number.isNaN(value)) {
            this.errors.push(
                `could not parse ${this.#curToken.literal} as integer`
            );
            return null;
        }
        return new IntegerLiteral(this.#curToken, value);
    };

    #parseIdentifier = (): Expression => {
        return new Identifier(this.#curToken, this.#curToken.literal);
    };

    #parsePrefixExpression = (): Expression | null => {
        const expr = new PrefixExpression(this.#curToken);
        expr.operator = this.#curToken.literal;
        this.#nextToken();
        expr.right = this.#parseExpression(PrecedenceKind.PREFIX);
        return expr;
    };

    #parseInfixExpression = (left: Expression): Expression | null => {
        const expr = new InfixExpression(this.#curToken);
        expr.operator = this.#curToken.literal;
        expr.left = left;
        const precedence = this.#curPrecedence();
        this.#nextToken();
        expr.right = this.#parseExpression(precedence);
        return expr;
    };
}

export default Parser;
