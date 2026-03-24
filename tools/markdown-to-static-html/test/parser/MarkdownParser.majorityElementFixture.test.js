const {
  parseMajorityElementBlocks
} = require('../support/majorityElementFixture')

describe('MarkdownParser with the majority element proof', () =>
{
  test('recognizes every block construct the fixture exercises', () =>
  {
    const blocks = parseMajorityElementBlocks()
    const counts = blocks.reduce((memo, block) =>
    {
      memo[block.type] = (memo[block.type] || 0) + 1
      return memo
    }, {})

    expect(counts).toEqual({
      h1: 1,
      paragraph: 32,
      h2: 5,
      equation: 7,
      'unordered-list': 2,
      'ordered-list': 2,
      rule: 1,
      table: 1
    })
  })

  test('keeps the streaming vote ordered list intact', () =>
  {
    const blocks = parseMajorityElementBlocks()
    const voteMapping = blocks.filter((block) => block.type === 'ordered-list')[0]

    expect(voteMapping.items).toHaveLength(3)
    expect(voteMapping.items[0][0].text.startsWith('**Start**')).toBe(true)
    expect(voteMapping.items[1][0].text.startsWith('**Reinforce**')).toBe(true)
    expect(voteMapping.items[2][0].text.startsWith('**Cancel**')).toBe(true)
  })

  test('keeps the execution table structure intact', () =>
  {
    const blocks = parseMajorityElementBlocks()
    const table = blocks.find((block) => block.type === 'table')

    expect(table.header).toEqual([
      'Step',
      '$r$',
      '$a_r$',
      'Branch',
      'Action',
      '$\\gamma$',
      '$\\beta$'
    ])
    expect(table.rows).toHaveLength(7)
    expect(table.rows[4]).toEqual([
      '**5**',
      '$4$',
      '$1$',
      'start',
      '$\\gamma \\gets 1$',
      '$1$',
      '$1$'
    ])
    expect(table.rows[6]).toEqual([
      '**7**',
      '$6$',
      '$2$',
      'start',
      '$\\gamma \\gets 2$',
      '$2$',
      '$1$'
    ])
  })
})
