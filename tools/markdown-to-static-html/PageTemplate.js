class PageTemplate 
{
  constructor(htmlEscaper, seoHeadRenderer = null) 
  {
    this.htmlEscaper = htmlEscaper
    this.seoHeadRenderer = seoHeadRenderer
  }

  render(title, content, assets, pageMetadata = null) 
  {
    const escapedTitle = this.htmlEscaper.escape(title)
    const seoHead = this.seoHeadRenderer ? this.seoHeadRenderer.render(pageMetadata) : ''
    const viewportMeta =
      '  <meta name="viewport" content="' +
      'width=device-width, initial-scale=1.0, viewport-fit=cover" />'
    const mathJaxLoaderScript =
      '  <script src="' +
      assets.mathJaxLoaderPath +
      '" data-cdn-source="' +
      assets.mathJaxCdnPath +
      '" data-local-source="' +
      assets.mathJaxLocalPath +
      '"></script>'

    return [
      '<!DOCTYPE html>',
      '<html lang="en">',
      '<head>',
      '  <meta charset="UTF-8" />',
      viewportMeta,
      '  <title>' + escapedTitle + '</title>',
      seoHead,
      '  <link rel="stylesheet" href="' + assets.stylesheetPath + '" />',
      '  <script src="' + assets.mathJaxConfigPath + '"></script>',
      mathJaxLoaderScript,
      '</head>',
      '<body>',
      '  <main>',
      '    <article>' + content + '</article>',
      '  </main>',
      '</body>',
      '</html>',
      ''
    ].join('\n')
  }
}

module.exports = PageTemplate
