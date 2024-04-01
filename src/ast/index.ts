import { TokenEnum, defaultToken, newTokenStr, type Token } from "@/token";

export interface ASTNode {
    tokenLiteral(): string;
    toString(): string;
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

    public expressionNode(): void {}

    public tokenLiteral(): string {
        return this.token.literal;
    }

    public toString(): string {
        return this.value;
    }
}

export class LetStatement implements Statement {
    token: Token;
    name: Identifer;
    value: Expression | null = null;

    constructor(token: Token = newTokenStr(TokenEnum.LET, "let")) {
        this.token = token;
        this.name = new Identifer();
    }

    public statementNode(): void {}

    public tokenLiteral(): string {
        return this.token.literal;
    }

    public toString(): string {
        let str = `${this.tokenLiteral()} ${this.name.toString()} = `;
        if (this.value !== null) {
            str += this.value.toString();
        }
        str += ";";
        return str;
    }
}

export class ReturnStatement implements Statement {
    token: Token;
    returnValue: Expression | null = null;

    constructor(token: Token = newTokenStr(TokenEnum.RETURN, "return")) {
        this.token = token;
    }

    public statementNode(): void {}

    public tokenLiteral(): string {
        return this.token.literal;
    }

    public toString(): string {
        let str = `${this.tokenLiteral()} `;
        if (this.returnValue !== null) {
            str += this.returnValue.toString();
        }
        str += ";";
        return str;
    }
}

export class ExpressionStatement implements Statement {
    token: Token;
    expression: Expression | null = null;

    constructor(token: Token) {
        this.token = token;
    }

    public statementNode(): void {}

    public tokenLiteral(): string {
        return this.token.literal;
    }

    public toString(): string {
        if (this.expression !== null) {
            return this.expression.toString();
        }
        return "";
    }
}

export class Program implements ASTNode {
    public statements: Statement[];

    constructor() {
        this.statements = [];
    }

    public tokenLiteral(): string {
        if (this.statements.length > 0) {
            return this.statements[0].tokenLiteral();
        }
        return "";
    }

    public toString(): string {
        let str = "";
        for (const stmt of this.statements) {
            str += stmt.toString();
        }
        return str;
    }
}
