# SEO Checklist

This repository publishes the GitHub Pages site at:

- `https://ideasbyrobert.github.io/algorithms/`

Discovery endpoints:

- Sitemap: `https://ideasbyrobert.github.io/algorithms/sitemap.xml`
- Robots: `https://ideasbyrobert.github.io/algorithms/robots.txt`

## Google Search Console

Recommended property for this GitHub Pages site:

- URL-prefix property: `https://ideasbyrobert.github.io/algorithms/`

Suggested flow:

1. Open Google Search Console and add the URL-prefix property above.
2. Verify ownership.
   Because this is GitHub Pages, the easiest methods are usually:
   - HTML `<meta>` tag on the homepage, or
   - HTML file upload at the site root.
3. After verification, open the `Sitemaps` report and submit:
   - `https://ideasbyrobert.github.io/algorithms/sitemap.xml`

## Bing Webmaster Tools

Recommended site URL:

- `https://ideasbyrobert.github.io/algorithms/`

Suggested flow:

1. Add the site in Bing Webmaster Tools.
2. Complete the ownership verification flow offered in the portal.
   On GitHub Pages, HTML file or meta-tag verification is usually the simplest.
3. In the Bing Webmaster Tools sitemap area, submit:
   - `https://ideasbyrobert.github.io/algorithms/sitemap.xml`

## IndexNow

Optional next step for faster Bing-family discovery:

1. Generate an IndexNow key.
2. Host the UTF-8 key file on the site.
3. Submit changed URLs to IndexNow.

I have not wired IndexNow into this repo yet, because it requires a real key.

## Notes

- `robots.txt` already advertises the sitemap.
- Submitting a sitemap is a discovery hint, not an indexing guarantee.
- If you get Google or Bing verification tokens and want them wired into the site, add them next to the SEO pipeline rather than editing pages by hand.

## Official References

- Google: [Build and submit a sitemap](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap)
- Google: [Verify your site ownership](https://support.google.com/webmasters/answer/9008080)
- Google: [How to use Search Console](https://developers.google.com/search/docs/monitor-debug/search-console-start)
- Bing: [Bing Webmaster Tools](https://www.bing.com/webmasters/)
- Bing: [How to add IndexNow to your website](https://www.bing.com/indexnow/IndexNowView/IndexNowGetStartedView)
- Bing: [Why IndexNow](https://www.bing.com/indexnow)
