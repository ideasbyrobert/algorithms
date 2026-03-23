class StaticPageGenerator {
  constructor(markdownParser, htmlRenderer, pageTemplate, assetPathResolver) {
    this.markdownParser = markdownParser;
    this.htmlRenderer = htmlRenderer;
    this.pageTemplate = pageTemplate;
    this.assetPathResolver = assetPathResolver;
  }

  generate(markdown, outputFilePath) {
    const blocks = this.markdownParser.parse(markdown);
    const title = this.findTitle(blocks);
    const content = this.htmlRenderer.render(blocks);
    const assets = this.assetPathResolver.resolve(outputFilePath);
    return this.pageTemplate.render(title, content, assets);
  }

  findTitle(blocks) {
    const heading = blocks.find((block) => block.type === 'h1');
    return heading ? heading.text : 'Document';
  }
}

module.exports = StaticPageGenerator;
