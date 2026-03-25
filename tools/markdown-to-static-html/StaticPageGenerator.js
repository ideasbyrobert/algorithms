class StaticPageGenerator 
{
  constructor(
    markdownParser,
    htmlRenderer,
    pageTemplate,
    assetPathResolver,
    pageMetadataFactory = null
  ) 
  {
    this.markdownParser = markdownParser
    this.htmlRenderer = htmlRenderer
    this.pageTemplate = pageTemplate
    this.assetPathResolver = assetPathResolver
    this.pageMetadataFactory = pageMetadataFactory
  }

  generate(markdown, outputFilePath) 
  {
    const blocks = this.markdownParser.parse(markdown)
    const title = this.findTitle(blocks)
    const content = this.htmlRenderer.render(blocks)
    const assets = this.assetPathResolver.resolve(outputFilePath)
    const pageMetadata = this.pageMetadataFactory
      ? this.pageMetadataFactory.create(blocks, outputFilePath, title)
      : null

    return this.pageTemplate.render(title, content, assets, pageMetadata)
  }

  findTitle(blocks) 
  {
    const heading = blocks.find((block) => block.type === 'h1')
    return heading ? heading.text : 'Document'
  }
}

module.exports = StaticPageGenerator
