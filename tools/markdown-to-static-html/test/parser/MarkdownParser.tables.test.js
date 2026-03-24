const {
  parseMarkdown
} = require('../support/createMarkdownParser')
const MarkdownLineClassifier = require('../../parsing/MarkdownLineClassifier')
const MarkdownTableParser = require('../../parsing/MarkdownTableParser')

describe('MarkdownParser table parsing', () =>
{
  test('parses tables with alignment separators and multiple rows', () =>
  {
    const markdown =
      '| Name | Value |\n' +
      '| :--- | ---: |\n' +
      '| h | 3 |\n' +
      '| n | 5 |'

    expect(parseMarkdown(markdown)).toEqual([
      {
        type: 'table',
        header: ['Name', 'Value'],
        rows: [
          ['h', '3'],
          ['n', '5']
        ]
      }
    ])
  })

  test('stops collecting table rows when the table ends', () =>
  {
    const markdown =
      '| Name | Value |\n' +
      '| --- | --- |\n' +
      '| h | 3 |\n' +
      '\n' +
      'After table'

    expect(parseMarkdown(markdown)).toEqual([
      {
        type: 'table',
        header: ['Name', 'Value'],
        rows: [['h', '3']]
      },
      { type: 'paragraph', text: 'After table' }
    ])
  })

  test('trims cell values when parsing a table row', () =>
  {
    const tableParser = new MarkdownTableParser(new MarkdownLineClassifier())

    expect(tableParser.parseTableRow('|  Step  |  Value  |')).toEqual([
      'Step',
      'Value'
    ])
  })
})
