const { parseHIndexBlocks } = require('../support/hIndexFixture')

describe('MarkdownParser with the h-index proof', () =>
{
  test('recognizes every block construct the proof exercises', () =>
  {
    const blocks = parseHIndexBlocks()
    const counts = blocks.reduce((memo, block) =>
    {
      memo[block.type] = (memo[block.type] || 0) + 1
      return memo
    }, {})

    expect(counts).toEqual({
      h1: 1,
      paragraph: 39,
      h2: 5,
      equation: 12,
      'unordered-list': 2,
      'ordered-list': 2,
      rule: 1,
      table: 1
    })
  })

  test('keeps the execution table structure intact', () =>
  {
    const blocks = parseHIndexBlocks()
    const table = blocks.find((block) => block.type === 'table')

    expect(table.header).toEqual([
      'Step',
      '$h$',
      '$B[h]$',
      '$\\sigma$ after',
      '$S(h) = \\sigma$',
      '$\\sigma \\ge h$?',
      'Action'
    ])
    expect(table.rows).toHaveLength(3)
    expect(table.rows[0]).toEqual([
      '**1**',
      '$5$',
      '$2$',
      '$2$',
      '$S(5) = 2$',
      '$2 < 5$ — no',
      'continue'
    ])
    expect(table.rows[2]).toEqual([
      '**3**',
      '$3$',
      '$1$',
      '$3$',
      '$S(3) = 3$',
      '$3 \\ge 3$ — yes',
      'return $3$'
    ])
  })

  test('preserves nested block structure inside theorem scan steps', () =>
  {
    const blocks = parseHIndexBlocks()
    const theoremScan = blocks.filter((block) => block.type === 'ordered-list')[1]

    expect(theoremScan.items).toHaveLength(3)
    expect(theoremScan.items[0].map((block) => block.type)).toEqual(['paragraph'])
    expect(theoremScan.items[1].map((block) => block.type)).toEqual([
      'paragraph',
      'equation',
      'paragraph',
      'paragraph'
    ])
    expect(theoremScan.items[2].map((block) => block.type)).toEqual([
      'paragraph',
      'equation',
      'paragraph'
    ])
  })
})
