const fs = require('fs')
const path = require('path')
const MarkdownParser = require('../../MarkdownParser')

const fixturePath = path.resolve(
  __dirname,
  '../fixtures/189-rotate-array.md'
)

function loadRotateArrayMarkdown()
{
  return fs.readFileSync(fixturePath, 'utf8')
}

function parseRotateArrayBlocks()
{
  return new MarkdownParser().parse(loadRotateArrayMarkdown())
}

module.exports = {
  fixturePath,
  loadRotateArrayMarkdown,
  parseRotateArrayBlocks
}
