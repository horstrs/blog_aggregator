import { User } from "../lib/db/schema.js";

export type CommandHandler = (cmdName: string, ...args: string[]) => Promise<void>;
export type CommandsRegistry = Record<string,CommandHandler>
export type UserCommandHandler = (
  cmdName: string,
  user: User,
  ...args: string[]
) => Promise<void>;


export function registerCommand(registry: CommandsRegistry, cmdName: string, handler: CommandHandler) {
  return registry[cmdName] = handler;
}

export async function runCommand(registry: CommandsRegistry, cmdName: string, ...args: string[]): Promise<void> {
  const handler = registry[cmdName];
  if (!handler){
    throw new Error(`Command ${cmdName} not found in registry.`);
  }
  await handler(cmdName, ...args);
}
