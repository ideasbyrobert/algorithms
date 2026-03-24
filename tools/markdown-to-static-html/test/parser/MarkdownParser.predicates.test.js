const MarkdownLineClassifier = require('../../parsing/MarkdownLineClassifier')

describe('MarkdownLineClassifier helper rules', () =>
{
  test('recognizes line-based block markers', () =>
  {
    const lineClassifier = new MarkdownLineClassifier()

    expect(lineClassifier.isBlank('   ')).toBe(true)
    expect(lineClassifier.isBlank('text')).toBe(false)
    expect(lineClassifier.isHeading1('# Heading')).toBe(true)
    expect(lineClassifier.isHeading1('Heading')).toBe(false)
    expect(lineClassifier.isHeading2('## Section')).toBe(true)
    expect(lineClassifier.isHeading2('# Section')).toBe(false)
    expect(lineClassifier.isRule('***')).toBe(true)
    expect(lineClassifier.isRule('---')).toBe(false)
    expect(lineClassifier.isEquation(' $$x$$ ')).toBe(true)
    expect(lineClassifier.isEquation('$$x')).toBe(false)
    expect(lineClassifier.isUnorderedItem('  * bullet')).toBe(true)
    expect(lineClassifier.isUnorderedItem('- bullet')).toBe(true)
    expect(lineClassifier.isOrderedItem('12. item')).toBe(true)
    expect(lineClassifier.isOrderedItem('12)item')).toBe(false)
  })

  test('detects tables from the current line and separator row', () =>
  {
    const lineClassifier = new MarkdownLineClassifier()
    const tableLines = [
      '| Name | Value |',
      '| :--- | ---: |',
      '| h | 3 |'
    ]
    const paragraphLines = [
      '| Name | Value |',
      'not a separator',
      '| h | 3 |'
    ]

    expect(lineClassifier.isTable(tableLines, 0)).toBe(true)
    expect(lineClassifier.isTable(tableLines, 1)).toBe(false)
    expect(lineClassifier.isTable(paragraphLines, 0)).toBe(false)
  })

  test('recognizes special block boundaries and out-of-range indices', () =>
  {
    const lineClassifier = new MarkdownLineClassifier()
    const lines = [
      'Plain paragraph',
      '## Heading',
      '* bullet',
      '$$x$$'
    ]

    expect(lineClassifier.isSpecialBlock(lines, 0)).toBe(false)
    expect(lineClassifier.isSpecialBlock(lines, 1)).toBe(true)
    expect(lineClassifier.isSpecialBlock(lines, 2)).toBe(true)
    expect(lineClassifier.isSpecialBlock(lines, 3)).toBe(true)
    expect(lineClassifier.isSpecialBlock(lines, 4)).toBe(false)
  })
})
