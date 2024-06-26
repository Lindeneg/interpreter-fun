import { exit } from "process";
import { createInterface } from "readline";
import Lexer from "@/lexer";
import { TokenKind } from "@/token";

const PROMPT = ">> ";

export const startREPL = (
    readStream: NodeJS.ReadableStream,
    writeStream: NodeJS.WritableStream
) => {
    console.log("Welcome to interpreter-fun! Enter some commands..");

    const rl = createInterface({
        input: readStream,
        output: writeStream,
    });

    rl.setPrompt(PROMPT);
    rl.prompt();
    rl.on("line", (line) => {
        const lex = new Lexer(line);
        let token = lex.nextToken();
        while (token.kind != TokenKind.EOF) {
            console.log(token);
            token = lex.nextToken();
        }
        rl.prompt();
    });
    rl.on("close", () => {
        exit(0);
    });
};
