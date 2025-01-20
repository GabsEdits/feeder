import { useEffect, useState } from "preact/hooks";

export default function Welcome() {
  const [loading, setLoading] = useState(false);
  const [loadingText, setLoadingText] = useState("Loading the posts");
  const [feedUrl, setFeedUrl] = useState(localStorage.getItem("feedUrl") || "");
  const [showHome, setShowHome] = useState(false);

  useEffect(() => {
    const feeds = JSON.parse(localStorage.getItem("feeds") || "[]");
    if (feeds.length > 0) {
      globalThis.location.href = "/dash";
    }
  }, []);

  useEffect(() => {
    if (loading) {
      const texts = [
        "Loading the posts",
        "Fetching the feed",
        "Analyzing the content",
        "Reading the articles",
        "Processing the data",
        "Loading the content",
        "Almost there...",
      ];
      let index = 0;
      const interval = setInterval(() => {
        index = (index + 1) % texts.length;
        setLoadingText(texts[index]);
      }, 200);

      const timeout = setTimeout(async () => {
        try {
          const response = await fetch(
            `/api/feed?url=${encodeURIComponent(feedUrl)}`,
          );
          const data = await response.json();
          if (data.error) throw new Error(data.error);

          const { title, icon } = data.feedInfo;

          const feeds = JSON.parse(localStorage.getItem("feeds") || "[]");
          feeds.push({ title, url: feedUrl, icon });
          localStorage.setItem("feeds", JSON.stringify(feeds));
          localStorage.setItem("feedUrl", feedUrl);
          setShowHome(true);
          globalThis.location.href = "/dash";
        } catch (_error) {
          alert("Failed to load the feed. Please try again.");
        } finally {
          setLoading(false);
        }
      }, 500);

      return () => {
        clearInterval(interval);
        clearTimeout(timeout);
      };
    }
  }, [loading]);

  return (
    <div class="flex flex-col gap-2 justify-center p-4">
      <h1 class="flex flex-col font-serif text-4xl items-center justify-center">
        Welcome to
        <span class="italic text-6xl">Feeder</span>
        <span class="text-base">Clean and simple RSS reader</span>
      </h1>
      <div class="flex flex-col gap-6 items-center">
        {!loading && !showHome
          ? (
            <>
              <p class="text-lg text-center">Start by adding a new feed</p>
              <input
                id="feed-url-input"
                class="px-6 py-3 w-full max-w-md rounded-lg bg-zinc-100 dark:bg-zinc-900"
                type="url"
                placeholder="Feed URL"
                value={feedUrl}
                onInput={(e) =>
                  setFeedUrl((e.target as HTMLInputElement).value)}
              />

              <hr class="w-full max-w-md border-gray-200 dark:border-gray-700" />

              <div class="w-full max-w-md flex flex-row place-items-end justify-end gap-2">
                <button
                  class="px-6 py-3 rounded-lg bg-zinc-100 dark:bg-zinc-900"
                  onClick={() => {
                    const inputElement = document.getElementById(
                      "feed-url-input",
                    ) as HTMLInputElement;

                    if (inputElement) {
                      inputElement.value = "https://vanillaos.org/feed.xml";
                      setFeedUrl(inputElement.value);
                    }
                  }}
                >
                  Use Sample Feed
                </button>
                <button
                  class="px-6 py-3 rounded-lg bg-black text-white dark:bg-white dark:text-black"
                  onClick={() => setLoading(true)}
                  disabled={!feedUrl}
                >
                  Next &rarr;
                </button>
              </div>
            </>
          )
          : loading
          ? (
            <div class="flex flex-col items-center justify-center flex-grow">
              <span class="material-symbols-outlined animate-spin text-8xl">
                progress_activity
              </span>
              <p class="text-lg mt-4">{loadingText}</p>
            </div>
          )
          : null}
      </div>
    </div>
  );
}
