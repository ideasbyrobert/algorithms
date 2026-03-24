const fs = require('fs')
const path = require('path')
const MarkdownParser = require('../../MarkdownParser')

const fixturePath = path.resolve(__dirname, '../fixtures/274-hindex.md')

function loadHIndexMarkdown()
{
  return fs.readFileSync(fixturePath, 'utf8')
}

function parseHIndexBlocks()
{
  return new MarkdownParser().parse(loadHIndexMarkdown())
}

function flattenBlocks(blocks)
{
  return blocks.flatMap((block) =>
  {
    if (!block.items)
    {
      return [block]
    }

    const nestedBlocks = block.items.flatMap((item) => flattenBlocks(item))

    return [block].concat(nestedBlocks)
  })
}

function flattenHIndexBlocks()
{
  return flattenBlocks(parseHIndexBlocks())
}

function findHIndexBlock(predicate)
{
  const block = flattenHIndexBlocks().find(predicate)

  if (!block)
  {
    throw new Error('Expected the h-index fixture to contain a matching block.')
  }

  return block
}

module.exports = {
  fixturePath,
  loadHIndexMarkdown,
  parseHIndexBlocks,
  flattenHIndexBlocks,
  findHIndexBlock
}
