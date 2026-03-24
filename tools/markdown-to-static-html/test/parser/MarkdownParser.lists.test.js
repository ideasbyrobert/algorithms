const { parseMarkdown } = require('../support/createMarkdownParser')
const MarkdownParser = require('../../MarkdownParser')
const MarkdownLineClassifier = require('../../parsing/MarkdownLineClassifier')
const MarkdownListParser = require('../../parsing/MarkdownListParser')

function createMarkdownListParser()
{
  const lineClassifier = new MarkdownLineClassifier()
  const markdownParser = new MarkdownParser(lineClassifier)

  return new MarkdownListParser(
    lineClassifier,
    (lines) => markdownParser.parseBlocks(lines)
  )
}

describe('MarkdownParser list parsing', () =>
{
  test('parses a single unordered-list item into a paragraph block', () =>
  {
    const listParser = createMarkdownListParser()

    expect(listParser.parseUnorderedListItem('  * first item')).toEqual([
      { type: 'paragraph', text: 'first item' }
    ])
  })

  test('parses unordered items as paragraph blocks', () =>
  {
    const markdown =
      '* first item\n' +
      '* second item'

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

  test('strips ordered markers and trailing blank lines from ordered item lines', () =>
  {
    const listParser = createMarkdownListParser()
    const lines = [
      '1. First line',
      '',
      '  second line',
      '',
      '2. Next item'
    ]

    expect(listParser.parseOrderedListItem(lines, 0)).toEqual({
      lines: ['First line', '', 'second line'],
      nextIndex: 4
    })
  })

  test('merges indented ordered-list continuation lines into one paragraph', () =>
  {
    const markdown =
      '1. First line\n' +
      '  second line\n' +
      '2. Next item'

    expect(parseMarkdown(markdown)).toEqual([
      {
        type: 'ordered-list',
        items: [
          [{ type: 'paragraph', text: 'First line second line' }],
          [{ type: 'paragraph', text: 'Next item' }]
        ]
      }
    ])
  })

  test('parses ordered items with nested equation and follow-up paragraph', () =>
  {
    const markdown =
      '1. Introduce the invariant\n' +
      '\n' +
      '  $$x = 1$$\n' +
      '\n' +
      '  Follow-up paragraph\n' +
      '2. Finish the proof'

    expect(parseMarkdown(markdown)).toEqual([
      {
        type: 'ordered-list',
        items: [
          [
            { type: 'paragraph', text: 'Introduce the invariant' },
            { type: 'equation', text: '$$x = 1$$' },
            { type: 'paragraph', text: 'Follow-up paragraph' }
          ],
          [{ type: 'paragraph', text: 'Finish the proof' }]
        ]
      }
    ])
  })

  test('stops an ordered list when following text is not indented', () =>
  {
    const markdown =
      '1. First item\n' +
      'Outside the list'

    expect(parseMarkdown(markdown)).toEqual([
      {
        type: 'ordered-list',
        items: [[{ type: 'paragraph', text: 'First item' }]]
      },
      { type: 'paragraph', text: 'Outside the list' }
    ])
  })
})
