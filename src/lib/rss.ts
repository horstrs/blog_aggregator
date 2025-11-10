import { XMLParser } from "fast-xml-parser";

export type RSSFeed = {
  channel: {
    title: string;
    link: string;
    description: string;
    item: RSSItem[];
  };
};

export type RSSItem = {
  title: string;
  link: string;
  description: string;
  pubDate: string;
};

export async function fetchFeed(feedURL: string) {
  const response = await fetch(feedURL, {
    headers: { "User-Agent": "gator" }
  });
  if (!response.ok) {
    throw new Error(`HTTP error. Status: ${response.status}`);
  }

  const text = await response.text();
  const xmlParser = new XMLParser();
  const parsedXML = xmlParser.parse(text);
  return extractRSS(parsedXML.rss);
}

function extractRSS(parsedXML: any): RSSFeed {
  verifyAllChannelFields(parsedXML);
  const itemList:RSSItem[] = [];
  for (const item of parsedXML.channel.item){
    const newItem = verifyAndConvertItemFields(item);
    if (newItem){
      itemList.push(newItem);
    }
  }
  if(itemList.length === 0){
    throw new Error("Parsed XML has no valid item inside channel")
  }
  return {
    channel: {
      title: parsedXML.channel.title,
      link: parsedXML.channel.link,
      description: parsedXML.channel.description,
      item: itemList
    }
  }
}

function verifyAllChannelFields(parsedXML: any) {
  if (!parsedXML.channel) {
    throw new Error("Parsed XML does not have channel field");
  }
  if (!parsedXML.channel.title) { 
    throw new Error("Parsed XML does not have title field inside channel");
  }
  if (!parsedXML.channel.link) { 
    throw new Error("Parsed XML does not have link field inside channel");
  }
  if (!parsedXML.channel.description) { 
    throw new Error("Parsed XML does not have description field inside channel");
  }
  if (!parsedXML.channel.item) { 
    throw new Error("Parsed XML does not have description field inside channel");
  }
  if (!Array.isArray(parsedXML.channel.item)) { 
    throw new Error("Item field inside channel is not an Array");
  }
}

function verifyAndConvertItemFields(parsedItem: any): undefined | RSSItem {
  if (!parsedItem.title) { 
    return undefined;
  }
  if (!parsedItem.link) { 
    return undefined;
  }
  if (!parsedItem.description) { 
    return undefined;
  }
  if (!parsedItem.pubDate) { 
    return undefined;
  }
  return {
    title: parsedItem.title,
    link: parsedItem.link,
    description: parsedItem.description,
    pubDate: parsedItem.pubDate,
  }
}