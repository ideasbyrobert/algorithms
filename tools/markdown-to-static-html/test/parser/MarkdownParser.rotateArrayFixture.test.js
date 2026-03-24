const {
  parseRotateArrayBlocks
} = require('../support/rotateArrayFixture')

describe('MarkdownParser with the rotate array proof', () =>
{
  test('recognizes every block construct the fixture exercises', () =>
  {
    const blocks = parseRotateArrayBlocks()
    const counts = blocks.reduce((memo, block) =>
    {
      memo[block.type] = (memo[block.type] || 0) + 1
      return memo
    }, {})

    expect(counts).toEqual({
      h1: 1,
      paragraph: 44,
      h2: 5,
      equation: 17,
      'unordered-list': 2,
      'ordered-list': 1,
      rule: 1,
      table: 2
    })
  })

  test('keeps the in-place reversal proof steps intact', () =>
  {
    const blocks = parseRotateArrayBlocks()
    const reversalProof = blocks.find((block) => block.type === 'ordered-list')

    expect(reversalProof.items).toHaveLength(3)
    expect(reversalProof.items[0][0].text.startsWith('*Base case')).toBe(true)
    expect(reversalProof.items[1][0].text.startsWith('*Inductive step')).toBe(true)
    expect(reversalProof.items[2][0].text.startsWith('*Termination')).toBe(true)
  })

  test('keeps both mechanical execution tables intact', () =>
  {
    const blocks = parseRotateArrayBlocks()
    const tables = blocks.filter((block) => block.type === 'table')

    expect(tables).toHaveLength(2)
    expect(tables[0].header).toEqual([
      'Phase',
      'Operation',
      'Segment',
      'Array state'
    ])
    expect(tables[0].rows[2]).toEqual([
      '**2**',
      '$\\text{Rev}(0, 2)$',
      "front $k' = 3$",
      '$(5, 6, 7, 4, 3, 2, 1)$'
    ])
    expect(tables[1].header).toEqual([
      'Swap',
      '$l$',
      '$r$',
      'Before',
      'After'
    ])
    expect(tables[1].rows[0]).toEqual([
      '**1**',
      '$0$',
      '$6$',
      '$A[0] = 1,\\; A[6] = 7$',
      '$A[0] = 7,\\; A[6] = 1$'
    ])
  })
})
