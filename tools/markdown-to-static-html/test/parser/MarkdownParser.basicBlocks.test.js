const { parseMarkdown } = require('../support/createMarkdownParser')

describe('MarkdownParser basic block parsing', () =>
{
  test('normalizes windows line endings and joins paragraph lines', () =>
  {
    const markdown =
      'First line\r\n' +
      'second line\r\n' +
      '\r\n' +
      'Third line'

    expect(parseMarkdown(markdown)).toEqual([
      { type: 'paragraph', text: 'First line second line' },
      { type: 'paragraph', text: 'Third line' }
    ])
  })

  test('parses headings, rules and equations in sequence', () =>
  {
    const markdown =
      '# Title\n' +
      '\n' +
      'Intro line\n' +
      'continued intro\n' +
      '\n' +
      '***\n' +
      '\n' +
      '$$x = y$$\n' +
      '\n' +
      '## Section'

    expect(parseMarkdown(markdown)).toEqual([
      { type: 'h1', text: 'Title' },
      { type: 'paragraph', text: 'Intro line continued intro' },
      { type: 'rule' },
      { type: 'equation', text: '$$x = y$$' },
      { type: 'h2', text: 'Section' }
    ])
  })

  test('stops a paragraph when a special block begins', () =>
  {
    const markdown =
      'Opening line\n' +
      '## Next section'

    expect(parseMarkdown(markdown)).toEqual([
      { type: 'paragraph', text: 'Opening line' },
      { type: 'h2', text: 'Next section' }
    ])
  })
})
