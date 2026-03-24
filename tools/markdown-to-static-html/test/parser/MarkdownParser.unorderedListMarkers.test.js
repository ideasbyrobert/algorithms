const { parseMarkdown } = require('../support/createMarkdownParser')
const {
  parseMergeSortedArrayBlocks
} = require('../support/mergeSortedArrayFixture')

describe('MarkdownParser unordered list markers', () =>
{
  test('parses hyphen-prefixed bullets as an unordered list', () =>
  {
    const markdown =
      '- first item\n' +
      '- second item'

    expect(parseMarkdown(markdown)).toEqual([
      {
        type: 'unordered-list',
        items: [
          [{ type: 'paragraph', text: 'first item' }],
          [{ type: 'paragraph', text: 'second item' }]
        ]
      }
    ])
  })

  test('preserves the merge fixture proof cases as a nested unordered list', () =>
  {
    const blocks = parseMergeSortedArrayBlocks()
    const proofCases = blocks.find((block) =>
      block.type === 'unordered-list' &&
      block.items.length === 2 &&
      block.items[0][0].text.startsWith('If $p_1 < 0$')
    )

    expect(proofCases).toEqual({
      type: 'unordered-list',
      items: [
        [{
          type: 'paragraph',
          text:
            'If $p_1 < 0$: all primary elements are exhausted and ' +
            '$B[p_2] = \\max(R)$.'
        }],
        [{
          type: 'paragraph',
          text:
            'If $A^{(0)}[p_1] \\le B[p_2]$: $B[p_2] \\ge ' +
            'A^{(0)}[p_1]$, so $B[p_2] = \\max(R)$.'
        }]
      ]
    })
  })
})
