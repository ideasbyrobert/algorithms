const fs = require('fs')
const path = require('path')
const MarkdownParser = require('../../MarkdownParser')

const fixturePath = path.resolve(
  __dirname,
  '../fixtures/169-majority-element.md'
)

function loadMajorityElementMarkdown()
{
  return fs.readFileSync(fixturePath, 'utf8')
}

function parseMajorityElementBlocks()
{
  return new MarkdownParser().parse(loadMajorityElementMarkdown())
}

module.exports = {
  fixturePath,
  loadMajorityElementMarkdown,
  parseMajorityElementBlocks
}
