class SeoHeadRenderer
{
  constructor(htmlEscaper)
  {
    this.htmlEscaper = htmlEscaper
  }

  render(metadata)
  {
    if (!metadata)
    {
      return ''
    }

    return [
      this.renderMeta('description', metadata.description),
      this.renderMeta('robots', 'index,follow,max-image-preview:large'),
      this.renderLink('canonical', metadata.canonicalUrl),
      this.renderProperty('og:locale', metadata.locale),
      this.renderProperty('og:type', metadata.openGraphType),
      this.renderProperty('og:site_name', metadata.siteName),
      this.renderProperty('og:title', metadata.title),
      this.renderProperty('og:description', metadata.description),
      this.renderProperty('og:url', metadata.canonicalUrl),
      this.renderMeta('twitter:card', metadata.twitterCard),
      this.renderMeta('twitter:title', metadata.title),
      this.renderMeta('twitter:description', metadata.description),
      this.renderJsonLd(metadata.structuredData)
    ].join('\n')
  }

  renderMeta(name, value)
  {
    return (
      '  <meta name="' +
      name +
      '" content="' +
      this.escapeAttribute(value) +
      '" />'
    )
  }

  renderProperty(name, value)
  {
    return (
      '  <meta property="' +
      name +
      '" content="' +
      this.escapeAttribute(value) +
      '" />'
    )
  }

  renderLink(rel, href)
  {
    return (
      '  <link rel="' +
      rel +
      '" href="' +
      this.escapeAttribute(href) +
      '" />'
    )
  }

  renderJsonLd(structuredData)
  {
    return (
      '  <script type="application/ld+json">' +
      this.renderStructuredData(structuredData) +
      '</script>'
    )
  }

  escapeAttribute(value)
  {
    return this.htmlEscaper.escape(String(value)).replace(/"/g, '&quot;')
  }

  renderStructuredData(structuredData)
  {
    return JSON.stringify(structuredData).replace(/</g, '\\u003c')
  }
}

module.exports = SeoHeadRenderer
