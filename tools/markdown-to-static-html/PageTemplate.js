class PageTemplate {
  render(title, content, assets) {
    return [
      '<!DOCTYPE html>',
      '<html lang="en">',
      '<head>',
      '  <meta charset="UTF-8" />',
      '  <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover" />',
      '  <title>' + title + '</title>',
      '  <link rel="stylesheet" href="' + assets.stylesheetPath + '" />',
      '  <script src="' + assets.mathJaxConfigPath + '"></script>',
      '  <script src="' + assets.mathJaxLoaderPath + '" data-cdn-source="' + assets.mathJaxCdnPath + '" data-local-source="' + assets.mathJaxLocalPath + '"></script>',
      '</head>',
      '<body>',
      '  <main>',
      '    <article>' + content + '</article>',
      '  </main>',
      '</body>',
      '</html>',
      ''
    ].join('\n');
  }
}

module.exports = PageTemplate;
