import { useEffect, useState } from "preact/hooks";

export default function Home() {
  const [feeds, setFeeds] = useState(() => {
    if (typeof window !== "undefined") {
      const savedFeeds = localStorage.getItem("feeds");
      return savedFeeds ? JSON.parse(savedFeeds) : [];
    }
    return [];
  });

  const [articles, setArticles] = useState([]);
  const [selectedArticle, setSelectedArticle] = useState<
    { title: string; content: string } | null
  >(null);
  const [selectedFeed, setSelectedFeed] = useState<
    { title: string; url: string } | null
  >(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("feeds", JSON.stringify(feeds));
    }
  }, [feeds]);

  const addFeed = async () => {
    const feedUrl = prompt("Enter the RSS feed URL:");

    if (feedUrl) {
      try {
        const response = await fetch(
          `/api/feed?url=${encodeURIComponent(feedUrl)}`,
        );

        if (response.ok) {
          const newFeed = await response.json();
          setFeeds([...feeds, newFeed]);
        } else {
          alert("Failed to add feed");
        }
      } catch (error) {
        console.error("Error adding feed:", error);
        alert("An error occurred while adding the feed");
      }
    }
  };

  const fetchArticles = async (feedUrl: string) => {
    try {
      const response = await fetch(
        `/api/feed?url=${encodeURIComponent(feedUrl)}`,
      );
      if (response.ok) {
        const data = await response.json();
        if (data.entries && Array.isArray(data.entries)) {
          const articles = data.entries.sort((
            a: { updated: string },
            b: { updated: string },
          ) => new Date(b.updated).getTime() - new Date(a.updated).getTime());
          setArticles(articles);
        } else {
          console.error("Fetched data.entries is not an array");
          alert("Failed to fetch articles: Data format is incorrect");
        }
      } else {
        alert("Failed to fetch articles");
      }
    } catch (error) {
      console.error("Error fetching articles:", error);
      alert("An error occurred while fetching the articles");
    }
  };

  const handleFeedClick = async (feed: { title: string; url: string }) => {
    setSelectedFeed(feed);
    await fetchArticles(feed.url);
  };

  const handleTitleClick = async () => {
    if (selectedFeed) {
      setIsRefreshing(true);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      await fetchArticles(selectedFeed.url);
      setIsRefreshing(false);
    }
  };

  const truncateSummary = (summary: string) => {
    return summary.length > 50 ? summary.substring(0, 50) + "..." : summary;
  };

  return (
    <div className="flex flex-col gap-2 px-4 pt-5 size-full">
      <div
        id="header"
        className="flex flex-row justify-center items-center p-4 w-full"
      >
        <h1
          className={`text-2xl font-serif italic cursor-pointer ${
            isRefreshing ? "animate-bounce" : ""
          }`}
          onClick={handleTitleClick}
          title="Refresh"
        >
          Feeder
        </h1>
      </div>

      <div
        id="dash"
        className="flex flex-col md:flex-row items-center justify-center gap-2 overflow-hidden rounded-xl h-[200vh] lg:h-[85vh]"
      >
        <div className="h-full w-full md:w-max flex flex-col justify-between items-center p-4 bg-white dark:bg-zinc-900">
          <div className="flex flex-col gap-1 overflow-hidden rounded-xl items-center justify-center w-full max-w-64 md:w-max">
            {feeds.map((
              { title, icon, url }: {
                title: string;
                icon: string;
                url: string;
              },
              index: number,
            ) => (
              <div
                key={index}
                className="flex flex-row gap-3 items-center justify-center py-4 px-6 bg-gray-100 dark:bg-zinc-800 w-full hover:bg-gray-200 transition-colors dark:hover:bg-zinc-700 cursor-pointer"
                onClick={() => handleFeedClick({ title, url })}
              >
                {icon && icon !== "No Icon"
                  ? (
                    <img
                      src={icon}
                      width="32"
                      height="32"
                      alt="RSS icon"
                      className="rounded-full"
                      onError={(e) => {
                        e.currentTarget.style.display = "none";
                        const nextElement = e.currentTarget.nextElementSibling;
                        if (nextElement && nextElement instanceof HTMLElement) {
                          nextElement.style.display = "block";
                        }
                      }}
                    />
                  )
                  : (
                    <div
                      style={{
                        backgroundColor: `#${
                          Math.floor(Math.random() * 16777215).toString(16)
                        }`,
                      }}
                      className="w-8 h-8 rounded-full"
                    />
                  )}
                <p className="font-bold text-lg">{title}</p>
              </div>
            ))}
          </div>
          <div
            onClick={addFeed}
            className="flex flex-row gap-3 items-center justify-center py-4 px-6 bg-gray-100 dark:bg-zinc-800 w-full rounded-xl hover:bg-gray-200 transition-colors dark:hover:bg-zinc-700 cursor-pointer"
          >
            <p className="font-bold text-lg">Add Feed</p>
          </div>
        </div>
        <div className="h-[80%] lg:h-full w-full md:w-[36rem] gap-2 flex flex-col justify-start items-stretch overflow-y-auto">
          {selectedFeed
            ? (
              articles.map((
                { title, summary, updated, content }: {
                  title: string;
                  summary: string;
                  updated: string;
                  content: { _: string };
                },
                index: number,
              ) => (
                <div
                  className={`flex flex-col gap-2 items-start justify-center py-4 px-6 hover:bg-gray-100 transition-colors dark:hover:bg-zinc-800 cursor-pointer ${
                    selectedArticle?.title === title
                      ? "bg-gray-100 dark:bg-zinc-800"
                      : "bg-white dark:bg-zinc-900"
                  }`}
                  key={index}
                  onClick={() =>
                    setSelectedArticle({ title, content: content._ })}
                >
                  <p className="font-bold text-xl">{title}</p>
                  <p className="font-normal text-md">
                    {truncateSummary(summary)}
                  </p>
                  <div className="flex flex-row justify-between w-full items-center">
                    <p className="font-normal text-sm">
                      {new Date(updated).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))
            )
            : (
              <p className="text-center text-lg">
                Click on a feed from the left <br></br> {"<--"}
              </p>
            )}
        </div>
        <div
          id="content"
          className="h-full w-full gap-3 flex flex-col bg-white dark:bg-zinc-900 p-4 md:p-9 overflow-y-auto md:overflow-hidden"
        >
          {selectedArticle
            ? (
              <>
                <h2 className="font-bold text-2xl">{selectedArticle.title}</h2>
                <div
                  className="overflow-y-auto h-full w-full"
                  dangerouslySetInnerHTML={{ __html: selectedArticle.content }}
                />
              </>
            )
            : <p>Select an article to read</p>}
        </div>
      </div>
    </div>
  );
}
