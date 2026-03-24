const MarkdownParser = require('../../MarkdownParser')

function createMarkdownParser()
{
  return new MarkdownParser()
}

function parseMarkdown(markdown)
{
  return createMarkdownParser().parse(markdown)
}

module.exports = {
  createMarkdownParser,
  parseMarkdown
}
