import type { UserCommandHandler, CommandHandler } from "./commands";
import { readConfig } from "src/config.js";
import { getUserByName } from "../lib/db/queries/users.js";

export function middlewareLoggedIn(handler: UserCommandHandler): CommandHandler {
  return async (cmdName, ...args): Promise<void> => {
    const config = readConfig();
    const userName = config.currentUserName;
    const user = await getUserByName(userName);
     if (!user) {
      throw new Error(`User ${userName} not found`);
     }
     return await handler(cmdName, user, ...args);
    }
}