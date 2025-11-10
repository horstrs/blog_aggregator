import { createFeed, getFeeds } from "../lib/db/queries/feeds.js";
import { readConfig } from "../config.js";
import { getUserById, getUserByName } from "../lib/db/queries/users.js";
import { Feed, feeds, User } from "../lib/db/schema.js";

export async function handlerAddFeed(cmdName: string, ...args: string[]): Promise<void> {
  const [name, url] = splitInput(args, cmdName);
  const currentUser = await getUserByName(readConfig().currentUserName);

  const createdFeed = await createFeed(name, url, currentUser.id);
  if(!createdFeed) {
    throw new Error("Error when creating the feed");
  }
  printFeed(createdFeed, currentUser);
}

export async function handlerListFeeds(cmdName: string, ...args: string[]): Promise<void> {
  const allFeeds = await getFeeds();
  if (allFeeds.length === 0) {
    console.log("No feeds found");
    return;
  }
  console.log(`Found ${allFeeds.length}:`)
  for (const feed of allFeeds) {
    const user = await getUserById(feed.userId);
    printFeed(feed, user);
    console.log("============================");
  }
}

function splitInput(receivedArgs: string[], cmdName: string): string[] {
  
  const [name, url, _] = receivedArgs;
  if (!name || !url) {
    console.log(`You need to provide a name and a URL for command ${cmdName} and nothing else.`);
    process.exit(1);
  }
  return [name, url];
}

function printFeed(feed: Feed, user: User){
  console.log(`* ID:          ${feed.id}`);
  console.log(`* Created:     ${feed.createdAt}`);
  console.log(`* Updated:     ${feed.updatedAt}`);
  console.log(`* Name:        ${feed.name}`);
  console.log(`* URL:         ${feed.url}`);
  console.log(`* User:        ${user.name}`);
}