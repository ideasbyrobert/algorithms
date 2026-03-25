const path = require('path')
const HtmlEscaper = require('../../HtmlEscaper')
const InlineFormatter = require('../../InlineFormatter')
const MarkdownParser = require('../../MarkdownParser')
const HtmlRenderer = require('../../HtmlRenderer')
const AssetPathResolver = require('../../AssetPathResolver')
const PageTemplate = require('../../PageTemplate')
const StaticPageGenerator = require('../../StaticPageGenerator')
const DocumentPageMetadataFactory = require('../../seo/DocumentPageMetadataFactory')
const SeoHeadRenderer = require('../../seo/SeoHeadRenderer')

const projectRoot = path.resolve(__dirname, '../../../..')

function createToolchain()
{
  const htmlEscaper = new HtmlEscaper()
  const inlineFormatter = new InlineFormatter(htmlEscaper)
  const markdownParser = new MarkdownParser()
  const htmlRenderer = new HtmlRenderer(htmlEscaper, inlineFormatter)
  const assetPathResolver = new AssetPathResolver(projectRoot)
  const pageMetadataFactory = new DocumentPageMetadataFactory(projectRoot)
  const seoHeadRenderer = new SeoHeadRenderer(htmlEscaper)
  const pageTemplate = new PageTemplate(htmlEscaper, seoHeadRenderer)
  const staticPageGenerator = new StaticPageGenerator(
    markdownParser,
    htmlRenderer,
    pageTemplate,
    assetPathResolver,
    pageMetadataFactory
  )

  return {
    htmlEscaper,
    inlineFormatter,
    markdownParser,
    htmlRenderer,
    assetPathResolver,
    pageMetadataFactory,
    pageTemplate,
    seoHeadRenderer,
    staticPageGenerator,
    projectRoot
  }
}

module.exports = createToolchain
