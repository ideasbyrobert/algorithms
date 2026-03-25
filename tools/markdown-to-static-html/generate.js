const fs = require('fs')
const path = require('path')
const HtmlEscaper = require('./HtmlEscaper')
const InlineFormatter = require('./InlineFormatter')
const MarkdownParser = require('./MarkdownParser')
const HtmlRenderer = require('./HtmlRenderer')
const AssetPathResolver = require('./AssetPathResolver')
const PageTemplate = require('./PageTemplate')
const StaticPageGenerator = require('./StaticPageGenerator')
const DocumentPageMetadataFactory = require('./seo/DocumentPageMetadataFactory')
const SeoHeadRenderer = require('./seo/SeoHeadRenderer')

const markdownPath = process.argv[2]
const outputPathArgument = process.argv[3]

if (!markdownPath) 
{
  throw new Error('A markdown file path is required.')
}

const absoluteMarkdownPath = path.resolve(markdownPath)
const absoluteOutputPath = resolveOutputPath(absoluteMarkdownPath, outputPathArgument)
const markdown = fs.readFileSync(absoluteMarkdownPath, 'utf8')
const projectRoot = path.resolve(__dirname, '..', '..')
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

process.stdout.write(staticPageGenerator.generate(markdown, absoluteOutputPath))

function resolveOutputPath(markdownFilePath, outputPath) 
{
  if (outputPath) 
  {
    return path.resolve(outputPath)
  }

  return markdownFilePath.replace(/\.md$/i, '.html')
}
