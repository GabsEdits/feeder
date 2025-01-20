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

This will return the feed data for Vanilla OS' Blog in JSON format.

### Development

To run the API locally, you will need to have Deno installed on your machine,
and the Git repository cloned.

The API is started automatically when you run the following command:

```sh
deno task start
```

Both the webapp and the API will be available at `http://localhost:8000`.

## Webapp

The webapp is available at `/`. You can access it by visiting the root URL of
the application.

### How it works

The webapp allows you to read feeds by providing the URL of the feed you want to
read.

At first, you will see the welcome screen, where you will have to enter the URL
of the first feed you want to read. You will also see a "Use Sample Feed"
button, which will allow you to load a sample feed for testing purposes, which
is the Vanilla OS' Blog feed.

After you enter the feed URL and click the "Next" button, the webapp will load
the feed data, and will cache it in the browser's local storage. This way, you
can easily switch between feeds without having to reload the page.

You will next be redirected to the dashboard, where you will see the feed being
displayed. You can click on the feed title to see the posts, and then click on
whichever post you want to read.

There is also a "Add Feed" button in the bottom of the first column, which will
allow you to add another feed to the dashboard.

Clicking on the title, will refresh the feeds, insuring that you have the latest
content.

### Development

The development process is the same as for the API. You can run the webapp
locally by running the following command:

```sh
deno task start
```

And to build the webapp, you can run the following command:

```sh
deno task build
```

The webapp will be available at `http://localhost:8000`.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE.txt) file
for more information.
