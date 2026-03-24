const createToolchain = require('../support/createToolchain')
const { findHIndexBlock } = require('../support/hIndexFixture')

const { inlineFormatter } = createToolchain()

describe('InlineFormatter with the h-index proof', () =>
{
  test('renders strong, emphasis and inline math in theorem prose', () =>
  {
    const paragraph = findHIndexBlock((block) =>
      block.type === 'paragraph' &&
      block.text.startsWith('**Problem objects.**')
    )
    const html = inlineFormatter.format(paragraph.text)
    const citationSequence =
      '<span class="inline-math">' +
      '$C = (c_0, c_1, \\ldots, c_{n-1})$' +
      '</span>'

    expect(html).toContain('<strong>Problem objects.</strong>')
    expect(html).toContain('<em>support counting function</em>')
    expect(html).toContain(citationSequence)
  })

  test('keeps emphasized proof labels around inline math', () =>
  {
    const paragraph = findHIndexBlock((block) =>
      block.type === 'paragraph' &&
      block.text.startsWith('*Base case ($h = n$).*')
    )
    const html = inlineFormatter.format(paragraph.text)
    const baseCase =
      '<em>Base case (' +
      '<span class="inline-math">$h = n$</span>' +
      ').</em>'

    expect(html).toContain(baseCase)
    expect(html).toContain('<span class="inline-math">$\\sigma = 0$</span>')
  })
})
