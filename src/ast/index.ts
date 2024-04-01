import { defaultToken, type Token } from "@/token";

export interface ASTNode {
    tokenLiteral(): string;
}

export interface Statement extends ASTNode {
    statementNode(): void;
}

export interface Expression extends ASTNode {
    expressionNode(): void;
}

export class Identifer implements Expression {
    token: Token;
    value: string;

    constructor(token: Token = defaultToken(), value: string = "") {
        this.token = token;
        this.value = value;
    }

    expressionNode(): void {}

    tokenLiteral(): string {
        return this.token.literal;
    }
}

export class LetStatement implements Statement {
    token: Token;
    name: Identifer;
    //value: Expression;

    constructor(token: Token) {
        this.token = token;
        this.name = new Identifer();
    }

    statementNode(): void {}

    tokenLiteral(): string {
        return this.token.literal;
    }
}

export class Program implements ASTNode {
    public statements: Statement[];

    constructor() {
        this.statements = [];
    }

    tokenLiteral(): string {
        if (this.statements.length > 0) {
            return this.statements[0].tokenLiteral();
        }
        return "";
    }
}
