const path = require('path')
const HtmlEscaper = require('../../HtmlEscaper')
const InlineFormatter = require('../../InlineFormatter')
const MarkdownParser = require('../../MarkdownParser')
const HtmlRenderer = require('../../HtmlRenderer')
const AssetPathResolver = require('../../AssetPathResolver')
const PageTemplate = require('../../PageTemplate')
const StaticPageGenerator = require('../../StaticPageGenerator')

const projectRoot = path.resolve(__dirname, '../../../..')

function createToolchain()
{
  const htmlEscaper = new HtmlEscaper()
  const inlineFormatter = new InlineFormatter(htmlEscaper)
  const markdownParser = new MarkdownParser()
  const htmlRenderer = new HtmlRenderer(htmlEscaper, inlineFormatter)
  const assetPathResolver = new AssetPathResolver(projectRoot)
  const pageTemplate = new PageTemplate(htmlEscaper)
  const staticPageGenerator = new StaticPageGenerator(
    markdownParser,
    htmlRenderer,
    pageTemplate,
    assetPathResolver
  )

  return {
    htmlEscaper,
    inlineFormatter,
    markdownParser,
    htmlRenderer,
    assetPathResolver,
    pageTemplate,
    staticPageGenerator,
    projectRoot
  }
}

module.exports = createToolchain
