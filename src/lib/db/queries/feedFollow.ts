import { db } from "..";
import { feedFollows, feeds, users } from "../schema";
import { eq } from "drizzle-orm";

export async function createFeedFollow(userId: string, feedId: string){
  const [newFeedFollow] = await db.insert(feedFollows).values({userId, feedId}).returning();
  return await db.select(
    { id: feedFollows.id,
      createdAt: feedFollows.createdAt,
      updatedAt: feedFollows.updatedAt,
      userId: feedFollows.userId,
      feedId: feedFollows.feedId,
      userName: users.name,
      feedName: feeds.name
    }
   ).from(feedFollows)
    .where(eq(feedFollows.id, newFeedFollow.id))
    .innerJoin(users, eq(users.id, newFeedFollow.userId))
    .innerJoin(feeds, eq(feeds.id, newFeedFollow.feedId));
}

export async function getFeedFollowsByUserId(userId: string){
  return await db.select(
    { id: feedFollows.id,
      createdAt: feedFollows.createdAt,
      updatedAt: feedFollows.updatedAt,
      userId: feedFollows.userId,
      feedId: feedFollows.feedId,
      userName: users.name,
      feedName: feeds.name
    }
  ).from(feedFollows)
    .where(eq(feedFollows.userId, userId))
    .innerJoin(users, eq(users.id, feedFollows.userId))
    .innerJoin(feeds, eq(feeds.id, feedFollows.feedId));
};