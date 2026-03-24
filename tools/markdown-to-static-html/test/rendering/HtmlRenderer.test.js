const createToolchain = require('../support/createToolchain')
const {
  flattenHIndexBlocks,
  parseHIndexBlocks
} = require('../support/hIndexFixture')

const { htmlRenderer } = createToolchain()

function countOccurrences(text, fragment)
{
  return text.split(fragment).length - 1
}

describe('HtmlRenderer with the h-index proof', () =>
{
  test('renders every block family exercised by the fixture', () =>
  {
    const blocks = flattenHIndexBlocks()
    const counts = blocks.reduce((memo, block) =>
    {
      memo[block.type] = (memo[block.type] || 0) + 1
      return memo
    }, {})
    const html = htmlRenderer.render(parseHIndexBlocks())

    expect(countOccurrences(html, '<h1>')).toBe(counts.h1)
    expect(countOccurrences(html, '<h2>')).toBe(counts.h2)
    expect(countOccurrences(html, '<div class="equation">')).toBe(counts.equation)
    expect(countOccurrences(html, '<ul>')).toBe(counts['unordered-list'])
    expect(countOccurrences(html, '<ol>')).toBe(counts['ordered-list'])
    expect(countOccurrences(html, '<hr />')).toBe(counts.rule)
    expect(countOccurrences(html, '<div class="table-wrap"><table>')).toBe(counts.table)
  })

  test('renders inline formatting inside the execution table', () =>
  {
    const html = htmlRenderer.render(parseHIndexBlocks())

    expect(html).toContain('<th><span class="inline-math">$h$</span></th>')
    expect(html).toContain('<td><strong>3</strong></td>')
    expect(html).toContain(
      '<td>return <span class="inline-math">$3$</span></td>'
    )
  })
})
