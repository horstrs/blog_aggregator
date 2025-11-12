import { db } from "..";
import { Feed, feeds } from "../schema";
import { eq, inArray, sql } from "drizzle-orm";

export async function createFeed(name: string, url: string, userId: string) {
  const [result] = await db.insert(feeds).values({
    name: name,
    url: url,
    userId: userId
  }).returning();
  return result;
}

export async function getFeeds() {
  return await db.select().from(feeds);
}

export async function getFeedByUrl(url: string) {
  const [result] = await db.select().from(feeds).where(eq(feeds.url, url));
  return result;
}

export async function makrFeedFetched(feedId: string) {
  const [result] = await db.update(feeds)
    .set({
      updatedAt: sql`NOW()`,
      lastFetchedAt: sql`NOW()`,
    })
    .where(eq(feeds.id, feedId));
  return result;
}

export async function getNextFeedToFetch(idList: string[]) {
  const [result] = await db
    .select()
    .from(feeds)
    .where(inArray(feeds.id, idList))
    .orderBy(sql`${feeds.lastFetchedAt} desc nulls first`)
    .limit(1);
  return result;
}