import { getFeedFollowsByUserId } from "../lib/db/queries/feedFollow.js";
import { User } from "../lib/db/schema.js";
import { fetchFeed } from "../lib/rss.js"
import { getNextFeedToFetch, makrFeedFetched } from "../lib/db/queries/feeds.js";
import { parseDuration } from "../lib/time.js";


export async function handlerAgg(cmdName: string, user: User, ...args: string[]): Promise<void> {
  
  const timeArg = args[0];
  if(!timeArg){
    throw new Error("You need to provide an interval for reads");
  }
  const timeBetweenReqs = parseDuration(timeArg);
  if (!timeBetweenReqs) {
    throw new Error(
      `invalid duration ${timeArg} - use format 1h 30m 15s or 3500ms`
    );
  }
  console.log(`Collecting feeds every ${timeArg}`);

  scrapeFeeds(user).catch(handleError);

  const interval = setInterval(() => {
    scrapeFeeds(user).catch(handleError);
  }, timeBetweenReqs);
  await new Promise<void>((resolve) => {
    process.on("SIGINT", () => {
      console.log("Shutting down feed aggregator...");
      clearInterval(interval);
      resolve()
    });
  });
}


async function scrapeFeeds(user: User) {
  const feedFollowList = await getFeedFollowsByUserId(user.id)
  if (!feedFollowList || feedFollowList.length === 0) {
    throw new Error(`user ${user.name} has no follows. UserID: ${user.id}`);
  }
  const feedFollowIds = feedFollowList.map(followList => followList.feedId)
  const nextFeedToFetch = await getNextFeedToFetch(feedFollowIds);
  if (!nextFeedToFetch) {
    console.log("No new feeds to fetch");
    return;
  }
  console.log("Found a feed to fetch");
  await makrFeedFetched(nextFeedToFetch.id);
  const feedData = await fetchFeed(nextFeedToFetch.url);
  console.log(`Feed ${feedData.channel.title} collected, ${feedData.channel.item.length} posts found`);
  for (const item of feedData.channel.item) {
    console.log(item.title);
  }
}

function handleError(err: unknown) {
  console.error(
    `Error scraping feeds: ${err instanceof Error ? err.message : err}`,
  );
}