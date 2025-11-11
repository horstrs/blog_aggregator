import { createFeed, getFeedByUrl, getFeeds } from "../lib/db/queries/feeds.js";
import { readConfig } from "../config.js";
import { getUserById, getUserByName } from "../lib/db/queries/users.js";
import { Feed, User } from "../lib/db/schema.js";
import { createFeedFollow, getFeedFollowsByUserId } from "../lib/db/queries/feedFollow.js";

export async function handlerAddFeed(cmdName: string, user: User, ...args: string[]): Promise<void> {
  const [name, url] = splitInput(args, cmdName);

  const createdFeed = await createFeed(name, url, user.id);
  if(!createdFeed) {
    throw new Error("Error when creating the feed");
  }
  await createFeedFollow(user.id, createdFeed.id);
  printFeed(createdFeed, user);
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

export async function handlerFollow(cmdName: string, user: User, ...args: string[]): Promise<void> {
  if(!args[0]){
    throw new Error("Expected one URL to follow");
  }
  const feedToFollow = await getFeedByUrl(args[0]);
  
  const newFollow = await createFeedFollow(user.id, feedToFollow.id);
  console.log(newFollow);
}

export async function handlerFollowing(cmdName: string, user: User, ...args: string[]): Promise<void> {
  const feedsFollowing = await getFeedFollowsByUserId(user.id);
  for (const feed of feedsFollowing){
    console.log(feed.feedName);
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