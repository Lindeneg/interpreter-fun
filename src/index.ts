import { startREPL } from "@/repl";

if (require.main === module) {
    startREPL(process.stdin, process.stdout);
}
