//import { createUser } from "src/db/queries/users.js";
import { createUser, getUserByName, resetUsers } from "../db/queries/users.js";
import { setUser } from "../config.js";

export async function handlerLogin(cmdName: string, ...args: string[]): Promise<void> {
  const [userName, others] = splitInput(args, cmdName);
  if (!userName || others) {
    throw new Error("Login command expects exactly one argument")
  }
  const existingUser = await getUserByName(userName)
  if (existingUser){
    throw new Error(`User ${userName} not found`)
  }
  setUser(userName);
  console.log(`User ${userName} has been set`)
}

export async function handlerRegister(cmdName: string, ...args: string[]): Promise<void> {
  const [newName, others] = splitInput(args, cmdName);
  if (!newName || others) {
    throw new Error("Register command expects exactly one argument")
  }
  const newUser = await createUser(newName);
  if(!newUser){
    throw new Error("Error when creating the user");
  }
  setUser(newName);
  console.log(`User ${newName} was created:`);
  console.log(newUser);
}

export async function handlerReset(cmdName: string, ...args: string[]): Promise<void> {
  await resetUsers();
}

function splitInput(receivedArgs: string[], cmdName: string): string[] {
  
  const [arg, _] = receivedArgs;
  if (!arg){
    console.log(`You need to provide at least one argument for command ${cmdName}.`);
    process.exit(1);
  }
  return [arg, _];
}
