const {
  parseRemoveDuplicatesIIBlocks
} = require('../support/removeDuplicatesIIFixture')

describe('MarkdownParser with the remove duplicates II proof', () =>
{
  test('recognizes every block construct the fixture exercises', () =>
  {
    const blocks = parseRemoveDuplicatesIIBlocks()
    const counts = blocks.reduce((memo, block) =>
    {
      memo[block.type] = (memo[block.type] || 0) + 1
      return memo
    }, {})

    expect(counts).toEqual({
      h1: 1,
      paragraph: 35,
      h2: 5,
      equation: 8,
      'unordered-list': 3,
      'ordered-list': 3,
      rule: 1,
      table: 1
    })
  })

  test('keeps the three proof-stage ordered lists intact', () =>
  {
    const blocks = parseRemoveDuplicatesIIBlocks()
    const orderedLists = blocks.filter((block) => block.type === 'ordered-list')

    expect(orderedLists).toHaveLength(3)
    expect(orderedLists[0].items[0][0].text.startsWith('*Base case')).toBe(true)
    expect(orderedLists[1].items[0][0].text.startsWith('*Base case ($r = 2$)')).toBe(true)
    expect(orderedLists[2].items[2][0].text.startsWith('*Termination.')).toBe(true)
  })

  test('keeps the lookback-gate consequence bullets and trace table intact', () =>
  {
    const blocks = parseRemoveDuplicatesIIBlocks()
    const consequenceList = blocks.filter(
      (block) => block.type === 'unordered-list'
    )[2]
    const table = blocks.find((block) => block.type === 'table')

    expect(consequenceList.items).toEqual([
      [{
        type: 'paragraph',
        text:
          '*New value:* $a_r > a_{r-1}$ — position $r$ introduces a ' +
          'distinct value not yet at its copy limit.'
      }],
      [{
        type: 'paragraph',
        text:
          '*Second copy:* $a_r = a_{r-1} > a_{r-2}$ — position ' +
          '$r$ is the second occurrence of its value.'
      }]
    ])
    expect(table.header).toEqual([
      'Step',
      '$r$',
      '$A^{(0)}[r]$',
      '$A^{(t)}[w-2]$',
      '$A^{(0)}[r-2]$',
      'Gate',
      'Action',
      '$w$'
    ])
    expect(table.rows[3]).toEqual([
      '**4**',
      '$5$',
      '$3$',
      '$2$',
      '$2$',
      '$3 \\ne 2$ — pass',
      'write $A[4] \\gets 3$',
      '$5$'
    ])
  })
})
