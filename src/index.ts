import type { CommandsRegistry } from "./commands/commands.js";
import { registerCommand, runCommand } from "./commands/commands.js";
import { handlerLogin } from "./commands/users.js";

function main() {
  
  const comRegistry:CommandsRegistry = {};
  registerCommand(comRegistry, "login", handlerLogin);
  const [command, arg] = processInput(process.argv);
  runCommand(comRegistry, command, arg);
}

function processInput(receivedArgs: string[]): string[] {
  const [_, __, command, arg, ___] = receivedArgs;
  if (!command || !arg){
    console.log(`You need to provide a command with at least one argument.`);
    process.exit(1);
  }
  return [command, arg];
}

main();