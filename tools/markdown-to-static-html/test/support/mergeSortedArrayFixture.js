const fs = require('fs')
const path = require('path')
const MarkdownParser = require('../../MarkdownParser')

const fixturePath = path.resolve(
  __dirname,
  '../fixtures/88-merge-sorted-array.md'
)

function loadMergeSortedArrayMarkdown()
{
  return fs.readFileSync(fixturePath, 'utf8')
}

function parseMergeSortedArrayBlocks()
{
  return new MarkdownParser().parse(loadMergeSortedArrayMarkdown())
}

module.exports = {
  fixturePath,
  loadMergeSortedArrayMarkdown,
  parseMergeSortedArrayBlocks
}
