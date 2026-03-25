const {
  parseAddBinaryBlocks
} = require('../support/addBinaryFixture')

describe('MarkdownParser with the add-binary proof', () =>
{
  test('recognizes every block construct the fixture exercises', () =>
  {
    const blocks = parseAddBinaryBlocks()
    const counts = blocks.reduce((memo, block) =>
    {
      memo[block.type] = (memo[block.type] || 0) + 1
      return memo
    }, {})

    expect(counts).toEqual({
      h1: 1,
      paragraph: 32,
      h2: 5,
      equation: 8,
      'unordered-list': 2,
      'ordered-list': 2,
      rule: 1,
      table: 1
    })
  })

  test('preserves nested aligned derivations inside the invariant proof steps', () =>
  {
    const blocks = parseAddBinaryBlocks()
    const invariantProof = blocks.filter((block) => block.type === 'ordered-list')[1]
    const alignedEquations = invariantProof.items[1].filter((block) =>
      block.type === 'equation' &&
      block.text.startsWith('$$\\begin{aligned}')
    )

    expect(invariantProof.items[1].map((block) => block.type)).toEqual([
      'paragraph',
      'equation',
      'paragraph',
      'equation',
      'paragraph'
    ])
    expect(alignedEquations).toHaveLength(2)
    expect(alignedEquations[0].text).toContain(
      '\\sum_{i=0}^{k} r_i \\cdot 2^i + c_{k+1} \\cdot 2^{k+1}'
    )
    expect(alignedEquations[1].text).toContain(
      '\\underbrace{\\sum_{i=0}^{k-1} r_i \\cdot 2^i + c_k \\cdot 2^k}_{\\text{INV}(k)}'
    )
    expect(alignedEquations[1].text).toContain('\\end{aligned}$$')
  })

  test('keeps the execution table structure intact', () =>
  {
    const blocks = parseAddBinaryBlocks()
    const table = blocks.find((block) => block.type === 'table')

    expect(table.header).toEqual([
      'Step',
      '$k$',
      '$a_k$',
      '$b_k$',
      '$c_k$',
      '$\\sigma_k$',
      '$r_k$',
      '$c_{k+1}$',
      '$R$ (MSB first)'
    ])
    expect(table.rows).toHaveLength(5)
    expect(table.rows[4]).toEqual([
      '**5**',
      '$4$',
      '$0$',
      '$0$',
      '$1$',
      '$1$',
      '$1$',
      '$0$',
      '$\\text{10101}$'
    ])
  })
})
