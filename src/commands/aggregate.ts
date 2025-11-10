import { fetchFeed } from "../lib/rss.js"


export async function handlerAgg(cmdName: string, ...args: string[]): Promise<void> {
  /*const [linkToFetch, others] = splitInput(args, cmdName);
  if (!linkToFetch || others) {
    throw new Error("Agg command expects exactly one argument")
  }*/
  const feedData = await fetchFeed("https://www.wagslane.dev/index.xml");
  const feedDataStr = JSON.stringify(feedData, null, 2);
  
  console.log(feedDataStr);  
}

/*function splitInput(receivedArgs: string[], cmdName: string): string[] {
  const [arg, _] = receivedArgs;
  if (!arg) {
    console.log(`You need to provide at least one argument for command ${cmdName}.`);
    process.exit(1);
  }
  return [arg, _];
}*/

