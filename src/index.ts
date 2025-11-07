import type { CommandsRegistry } from "./commands/commands.js";
import { registerCommand, runCommand } from "./commands/commands.js";
import { handlerLogin, handlerRegister, handlerReset } from "./commands/users.js";

async function main() {
  
  const comRegistry:CommandsRegistry = {};
  registerCommand(comRegistry, "login", handlerLogin);
  registerCommand(comRegistry, "register", handlerRegister);
  registerCommand(comRegistry, "reset", handlerReset);
  const [command, args] = processInput(process.argv);
  try {
    await runCommand(comRegistry, command, args);
  } catch (err) {
    console.log("eeee laia");
    console.log((err as Error).message);
    process.exit(1);
  }
  process.exit(0);
}

function processInput(receivedArgs: string[]): string[] {
  const [_, __, command, args] = receivedArgs;
  if (!command){
    console.log('You need to provide a command.');
    process.exit(1);
  }
  return [command, args];
}

main();