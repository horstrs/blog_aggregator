import { createFeed, getFeedByUrl, getFeeds } from "../lib/db/queries/feeds.js";
import { readConfig } from "../config.js";
import { getUserById, getUserByName } from "../lib/db/queries/users.js";
import { Feed, User } from "../lib/db/schema.js";
import { createFeedFollow, getFeedFollowsByUserId } from "../lib/db/queries/feedFollow.js";

export async function handlerAddFeed(cmdName: string, ...args: string[]): Promise<void> {
  const [name, url] = splitInput(args, cmdName);
  const currentUser = await getUserByName(readConfig().currentUserName);

  const createdFeed = await createFeed(name, url, currentUser.id);
  if(!createdFeed) {
    throw new Error("Error when creating the feed");
  }
  await createFeedFollow(currentUser.id, createdFeed.id);
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

export async function handlerFollow(cmdName: string, ...args: string[]): Promise<void> {
  if(!args[0]){
    throw new Error("Expected one URL to follow");
  }
  const feedToFollow = await getFeedByUrl(args[0]);
  const currentUser = await getUserByName(readConfig().currentUserName);
  
  const newFollow = await createFeedFollow(currentUser.id, feedToFollow.id);
  console.log(newFollow);
}

export async function handlerFollowing(cmdName: string, ...args: string[]): Promise<void> {
  const currentUser = await getUserByName(readConfig().currentUserName);
  const feedsFollowing = await getFeedFollowsByUserId(currentUser.id);
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