class SitemapXmlRenderer
{
  constructor(siteMetadata)
  {
    this.siteMetadata = siteMetadata
  }

  render(paths)
  {
    const urlEntries = this.uniquePaths(paths).map((pagePath) =>
      this.renderUrlEntry(pagePath)
    )

    return [
      '<?xml version="1.0" encoding="UTF-8"?>',
      '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
      ...urlEntries,
      '</urlset>',
      ''
    ].join('\n')
  }

  uniquePaths(paths)
  {
    return Array.from(new Set(paths))
  }

  renderUrlEntry(pagePath)
  {
    return [
      '  <url>',
      '    <loc>' + this.escape(this.toAbsoluteUrl(pagePath)) + '</loc>',
      '  </url>'
    ].join('\n')
  }

  toAbsoluteUrl(pagePath)
  {
    return pagePath
      ? this.siteMetadata.baseUrl + '/' + pagePath
      : this.siteMetadata.homeUrl
  }

  escape(value)
  {
    return value
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
  }
}

module.exports = SitemapXmlRenderer
