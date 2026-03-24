const fs = require('fs')
const path = require('path')
const MarkdownParser = require('../../MarkdownParser')

const fixturePath = path.resolve(
  __dirname,
  '../fixtures/334-increasing-triplet-subsequence.md'
)

function loadTripletSubsequenceMarkdown()
{
  return fs.readFileSync(fixturePath, 'utf8')
}

function parseTripletSubsequenceBlocks()
{
  return new MarkdownParser().parse(loadTripletSubsequenceMarkdown())
}

module.exports = {
  fixturePath,
  loadTripletSubsequenceMarkdown,
  parseTripletSubsequenceBlocks
}
