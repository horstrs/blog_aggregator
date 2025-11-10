import type { CommandsRegistry } from "./commands/commands.js";
import { registerCommand, runCommand } from "./commands/commands.js";
import { handlerAgg } from "./commands/aggregate.js";
import { handlerListUsers, handlerLogin, handlerRegister, handlerReset } from "./commands/users.js";
import { handlerAddFeed, handlerListFeeds, handlerFollow, handlerFollowing } from "./commands/feeds.js";

async function main() {
  
  const comRegistry:CommandsRegistry = {};
  registerCommand(comRegistry, "login", handlerLogin);
  registerCommand(comRegistry, "register", handlerRegister);
  registerCommand(comRegistry, "reset", handlerReset);
  registerCommand(comRegistry, "users", handlerListUsers);
  registerCommand(comRegistry, "agg", handlerAgg);
  registerCommand(comRegistry, "addfeed", handlerAddFeed);
  registerCommand(comRegistry, "feeds", handlerListFeeds);
  registerCommand(comRegistry, "follow", handlerFollow);
  registerCommand(comRegistry, "following", handlerFollowing);
  const [command, ...args] = processInput(process.argv);
  try {
    await runCommand(comRegistry, command, ...args);
  } catch (err) {
    console.log((err as Error).message);
    process.exit(1);
  }
  process.exit(0);
}

function processInput(receivedArgs: string[]): string[] {
  const [_, __, command, ...args] = receivedArgs;
  if (!command){
    console.log('You need to provide a command.');
    process.exit(1);
  }
  return [command, ...args];
}

main();