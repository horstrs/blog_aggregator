Gator is an RSS feed aggre**gator** is a guided project for practicing basics of HTTP commands and DB using drizzle.
To store the feeds and users, this project uses a Postgres DB. The access URL is stored in a JSON config file name .gatorconfig.json in your home directory. This config file needs two fields:
{
  "db_url": "postgres://<your_user>:@localhost:5432/gator?sslmode=disable",
  "current_user_name": ""
}

To run the program, first install it with npm i. Then, you can use npm run start <Command> [arguments]. The available commands are:

  * "reset" | Clear all database tables
  * "login" | <user_name> - Sets current user to an already existing user
  * "register" | <user_name> - Creates a user in the database and set it as the active user
  * "users" | Lists all existing users
  * "feeds" | Lists all registered feeds, from all users

The commands bellow require that a valid user is logged in (meaning, the user name is in the .gatorconfig.JSON file). This can be set with the login command
  * "addfeed" | <feed_name> <feed_URL> - Add a feed to the table of feeds that we can fetch from
  * "follow" | <feed_name> <feed_URL> - Current user starts following the given Feed, so it's a feed that can be scraped when the active user runs agg
  * "following" | Lists all feeds the current user is following
  * "unfollow" | <feed_name> <feed_URL> - Current user stops following the given Feed.

  * "agg" | <request_intreval> - Start scrape loop. Fetch data from Feeds at every <request_interval>. Request interval must be "1h 30m 15s" or "3500ms"
  * "browse" | <optional_posts_limit> - Read the latest <optional_posts_limit> from the Posts table for the current user. Default limit is 2;
