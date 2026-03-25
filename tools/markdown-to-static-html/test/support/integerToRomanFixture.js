const fs = require('fs')
const path = require('path')
const MarkdownParser = require('../../MarkdownParser')

const fixturePath = path.resolve(
  __dirname,
  '../fixtures/12-integer-to-roman.md'
)

function loadIntegerToRomanMarkdown()
{
  return fs.readFileSync(fixturePath, 'utf8')
}

function parseIntegerToRomanBlocks()
{
  return new MarkdownParser().parse(loadIntegerToRomanMarkdown())
}

module.exports = {
  fixturePath,
  loadIntegerToRomanMarkdown,
  parseIntegerToRomanBlocks
}
