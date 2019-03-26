# HAR-Remix

HAR-Remix allows the offline serving of HTTP Archive (HAR) files.

Many browsers (Chrome, Firefox) provide archive files that contain everything needed to load a page offline without accessing external resources. This is necessary for obtaining a high p-value (confidence) in the delta between code in master and code you‘re seeking to introduce into the codebase. Depending upon assets or external resources like images, tracking, advertisements, stylesheets, script files, icons, etc. is unpredictable and muddies the result of the site’s performance. What we want to see is how the site, having to download no content, can consistently be loaded and its load's performance evaluated and logged for further representation.

Through the use of the HAR Remix tool, we can serve HAR files as offline pages and evaluate them.

# Basic Implementation

Easily serve HAR archive with loose matching and alterations.

You can save a HAR archive with content from the Network tab of Chrome by right clicking the recorded responses.

```js
import HARRemix from "har-remix";
import * as url from "url";

let harRemix = new HARRemix({
  keyForArchiveEntry(entry) {
    let { request, response } = entry;
    let { status } = response;
    if (status >= 200 && status < 300 && request.method !== "OPTIONS") {
      return request.method + url.parse(request.url).path;
    }
  },

  keyForServerRequest(req) {
    return req.method + req.url;
  },

  textFor(entry, key, text) {
    if (key === "GET/") {
      return text.replace(/my-cdn.com/, "localhost:6789");
    }
    return text;
  }
});

harRemix.loadArchive("my-site.com.har");

harRemix.createServer().listen(6789);
```
