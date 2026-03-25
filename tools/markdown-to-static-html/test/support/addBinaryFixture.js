const fs = require('fs')
const path = require('path')
const MarkdownParser = require('../../MarkdownParser')

const fixturePath = path.resolve(__dirname, '../fixtures/67-add-binary.md')

function loadAddBinaryMarkdown()
{
  return fs.readFileSync(fixturePath, 'utf8')
}

function parseAddBinaryBlocks()
{
  return new MarkdownParser().parse(loadAddBinaryMarkdown())
}

module.exports = {
  fixturePath,
  loadAddBinaryMarkdown,
  parseAddBinaryBlocks
}
