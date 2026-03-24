const {
  parseTripletSubsequenceBlocks
} = require('../support/tripletSubsequenceFixture')

describe('MarkdownParser with the increasing triplet proof', () =>
{
  test('recognizes every block construct the fixture exercises', () =>
  {
    const blocks = parseTripletSubsequenceBlocks()
    const counts = blocks.reduce((memo, block) =>
    {
      memo[block.type] = (memo[block.type] || 0) + 1
      return memo
    }, {})

    expect(counts).toEqual({
      h1: 1,
      paragraph: 40,
      h2: 5,
      equation: 8,
      'unordered-list': 4,
      'ordered-list': 2,
      rule: 1,
      table: 1
    })
  })

  test('keeps the dual-bound tracker ordered list intact', () =>
  {
    const blocks = parseTripletSubsequenceBlocks()
    const tracker = blocks.filter((block) => block.type === 'ordered-list')[0]

    expect(tracker.items).toHaveLength(3)
    expect(tracker.items[0][0].text.startsWith('**Refresh first**')).toBe(true)
    expect(tracker.items[1][0].text.startsWith('**Tighten second**')).toBe(true)
    expect(tracker.items[2][0].text.startsWith('**Complete triplet**')).toBe(true)
  })

  test('keeps the execution table structure intact', () =>
  {
    const blocks = parseTripletSubsequenceBlocks()
    const table = blocks.find((block) => block.type === 'table')

    expect(table.header).toEqual([
      'Step',
      '$r$',
      '$a_r$',
      'Branch',
      '$f$',
      '$s$'
    ])
    expect(table.rows[5]).toEqual([
      '**6**',
      '$5$',
      '$6$',
      'complete triplet',
      '$0$',
      '$4$'
    ])
  })
})
