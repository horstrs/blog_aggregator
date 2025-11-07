import { setUser } from "../config.js";

export function handlerLogin(cmdName: string, ...args: string[]) {
  if (!args || args.length != 1) {
    throw new Error("login command expects exactly one argument")
  }
  setUser(args[0]);
  console.log(`User ${args[0]} has been set.`)
}