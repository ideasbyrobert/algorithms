const createToolchain = require('../support/createToolchain')
const {
  parseIntegerToRomanBlocks
} = require('../support/integerToRomanFixture')

const { htmlRenderer } = createToolchain()

describe('HtmlRenderer with the integer-to-roman proof', () =>
{
  test('renders the digit-encoding cases block as a display equation', () =>
  {
    const html = htmlRenderer.render(parseIntegerToRomanBlocks())

    expect(html).toContain('<div class="equation">$$\\rho_p(d) = \\begin{cases}')
    expect(html).toContain('\\end{cases}$$</div>')
    expect(html).not.toContain('<p>$<span class="inline-math">$\\rho_p(d)')
  })

  test('renders both tables and the mechanical result', () =>
  {
    const html = htmlRenderer.render(parseIntegerToRomanBlocks())
    const result =
      '<strong>Result:</strong> ' +
      '<span class="inline-math">$r^{(f)} = 0$</span>, ' +
      '<span class="inline-math">$S^{(f)} = \\text{MCMXCIV} = R(1994)$</span>'
    const tableCount = (html.match(/<div class="table-wrap"><table>/g) || []).length

    expect(tableCount).toBe(2)
    expect(html).toContain('<th>Token (<span class="inline-math">$s_k$</span>)</th>')
    expect(html).toContain(result)
  })
})
