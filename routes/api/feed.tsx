import { Handlers } from "$fresh/server.ts";
import { parseStringPromise } from "npm:xml2js";

export const handler: Handlers = {
  async GET(req) {
    const url = new URL(req.url);
    const feedUrl = url.searchParams.get("url");

    if (!feedUrl) {
      return new Response(JSON.stringify({ error: "Feed URL is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    try {
      const feedResponse = await fetch(feedUrl);
      if (!feedResponse.ok) {
        throw new Error(`Failed to fetch feed: ${feedResponse.statusText}`);
      }

      const feedText = await feedResponse.text();

      const xmlDoc = await parseStringPromise(feedText, {
        explicitArray: false,
      });

      const feedInfo = {
        title: xmlDoc.feed?.title || xmlDoc.rss?.channel?.title || "No title",
        icon: xmlDoc.feed?.icon || xmlDoc.rss?.channel?.image?.url || "No icon",
      };

      let entries = [];
      if (xmlDoc.feed?.entry) {
        entries = xmlDoc.feed.entry.map((
          entry: {
            title?: string;
            link?: { href: string };
            updated?: string;
            summary?: string;
            content?: string;
          },
        ) => ({
          title: entry.title || "No title",
          link: entry.link?.href || "No link",
          updated: entry.updated || "No updated date",
          summary: entry.summary || "No summary",
          content: entry.content || "No content",
        }));
      } else if (xmlDoc.rss?.channel?.item) {
        entries = xmlDoc.rss.channel.item.map((
          item: {
            title?: string;
            link?: string;
            pubDate?: string;
            description?: string;
          },
        ) => ({
          title: item.title || "No title",
          link: item.link || "No link",
          updated: item.pubDate || "No publication date",
          summary: item.description || "No description",
        }));
      } else {
        throw new Error("Unsupported feed format or failed to parse the feed.");
      }

      const baseUrl = new URL(feedUrl);

      entries = entries.map(
        (entry: { content?: { _: string } | string; summary?: string }) => {
          if (typeof entry.content === "object" && entry.content._) {
            entry.content._ = entry.content._.replace(
              /src="([^"]+)"/g,
              (_match: string, p1: string) => {
                const imageUrl = new URL(p1, baseUrl).toString();
                return `src="${imageUrl}"`;
              },
            );
          }
          if (typeof entry.summary === "string") {
            entry.summary = entry.summary.replace(
              /src="([^"]+)"/g,
              (_match: string, p1: string) => {
                const imageUrl = new URL(p1, baseUrl).toString();
                return `src="${imageUrl}"`;
              },
            );
          }
          return entry;
        },
      );

      return new Response(JSON.stringify({ feedInfo, entries }, null, 2), {
        headers: { "Content-Type": "application/json" },
      });
    } catch (error: unknown) {
      return new Response(JSON.stringify({ error: (error as Error).message }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }
  },
};
