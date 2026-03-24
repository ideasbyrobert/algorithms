const fs = require('fs')
const path = require('path')
const MarkdownParser = require('../../MarkdownParser')

const fixturePath = path.resolve(
  __dirname,
  '../fixtures/80-remove-duplicates-II.md'
)

function loadRemoveDuplicatesIIMarkdown()
{
  return fs.readFileSync(fixturePath, 'utf8')
}

function parseRemoveDuplicatesIIBlocks()
{
  return new MarkdownParser().parse(loadRemoveDuplicatesIIMarkdown())
}

module.exports = {
  fixturePath,
  loadRemoveDuplicatesIIMarkdown,
  parseRemoveDuplicatesIIBlocks
}
