<div align="center">
    <h1>Feeder</h1>
    <p>A simple web application (with an API) for reading RSS/Atom feeds.</p>
</div>

## API

The API is available at `/api/feed`.

### How it works

First, you will need to provide the URL of the feed you want to read. For
example, let's say you want to read Vanilla OS' Blog using their Atom feed,
which is available at:

```
https://vanillaos.org/feed.xml
```

You can access the feed by making a GET request to the API endpoint with the
`url` query parameter set to the feed URL:

```
/api/feed?url=https://vanillaos.org/feed.xml
```

The API will return the feed data in JSON format, which will make the feed into
an easier-to-read format for your application. The JSON object will contain the
following properties:

- `feedInfo`: Information about the feed itself, such as the `title` and `icon`.
- `entries`: An array of entries in the feed, each containing the `title`,
  `link`, `updated`, and `content`. Inside the `content` object, you will find
  the content itself under "\_" key. And the `type` key (which can be either
  "text" or "html", that will tell you how to interpret the content) as well as
  the `base` key (which will tell you the base URL of the content), will be
  available under the `$` key.

This way, you can easily display the feed data in your application.

### Example

You can try the API by making a GET request to the following URL:

```
https://feeder.gxbs.dev/api/feed?url=https://vanillaos.org/feed.xml
```

