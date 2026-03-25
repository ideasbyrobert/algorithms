const {
  parseIntegerToRomanBlocks
} = require('../support/integerToRomanFixture')

describe('MarkdownParser with the integer-to-roman proof', () =>
{
  test('recognizes every block construct the fixture exercises', () =>
  {
    const blocks = parseIntegerToRomanBlocks()
    const counts = blocks.reduce((memo, block) =>
    {
      memo[block.type] = (memo[block.type] || 0) + 1
      return memo
    }, {})

    expect(counts).toEqual({
      h1: 1,
      paragraph: 41,
      h2: 5,
      equation: 8,
      table: 2,
      'unordered-list': 2,
      'ordered-list': 2,
      rule: 1
    })
  })

  test('keeps the multi-line digit-encoding cases equation intact', () =>
  {
    const blocks = parseIntegerToRomanBlocks()
    const equation = blocks.find((block) =>
      block.type === 'equation' &&
      block.text.startsWith('$$\\rho_p(d) = \\begin{cases}')
    )

    expect(equation).toBeDefined()
    expect(equation.text).toContain('\\varepsilon & \\text{if } d = 0 \\\\')
    expect(equation.text).toContain('\\end{cases}$$')
  })

  test('keeps both denomination tables intact', () =>
  {
    const blocks = parseIntegerToRomanBlocks()
    const tables = blocks.filter((block) => block.type === 'table')

    expect(tables).toHaveLength(2)
    expect(tables[0].header).toEqual(['$k$', '$v_k$', '$s_k$', 'Group'])
    expect(tables[1].header).toEqual([
      'Step',
      '$k$',
      'Token ($s_k$)',
      '$v_k$',
      'Group',
      '$r$ before',
      '$r$ after',
      '$S$ after'
    ])
    expect(tables[1].rows[3]).toEqual([
      '**4**',
      '$11$',
      '$\\text{IV}$',
      '$4$',
      '$G_0$',
      '$4$',
      '$0$',
      '$\\text{MCMXCIV}$'
    ])
  })
})
