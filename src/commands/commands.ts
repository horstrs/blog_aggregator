export type CommandHandler = (cmdName: string, ...args: string[]) => void;
export type CommandsRegistry = Record<string,CommandHandler>

export function registerCommand(registry: CommandsRegistry, cmdName: string, handler: CommandHandler) {
  return registry[cmdName] = handler;
}

export function runCommand(registry: CommandsRegistry, cmdName: string, ...args: string[]): void {
  const handler = registry[cmdName];
  if (!handler){
    throw new Error(`Command ${cmdName} not found in registry.`);
  }
  handler(cmdName, ...args);
}
