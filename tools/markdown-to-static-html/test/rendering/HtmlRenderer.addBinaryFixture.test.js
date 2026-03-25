const createToolchain = require('../support/createToolchain')
const {
  parseAddBinaryBlocks
} = require('../support/addBinaryFixture')

const { htmlRenderer } = createToolchain()

describe('HtmlRenderer with the add-binary proof', () =>
{
  test('renders aligned invariant derivations as display equations', () =>
  {
    const html = htmlRenderer.render(parseAddBinaryBlocks())
    const alignedEquationPattern =
      /<div class="equation">\$\$\\begin\{aligned\}/g
    const equationCount = (html.match(alignedEquationPattern) || []).length
    const invariantStep =
      '\\underbrace{\\sum_{i=0}^{k-1} r_i \\cdot 2^i + ' +
      'c_k \\cdot 2^k}_{\\text{INV}(k)}'
    const brokenParagraph =
      '<p>$<span class="inline-math">$\\begin{aligned}'

    expect(equationCount).toBe(2)
    expect(html).toContain(invariantStep)
    expect(html).not.toContain(brokenParagraph)
  })

  test('renders the execution table and final result', () =>
  {
    const html = htmlRenderer.render(parseAddBinaryBlocks())
    const header = '<th><span class="inline-math">$a_k$</span></th>'
    const finalRow =
      '<td><span class="inline-math">$\\text{10101}$</span></td>'
    const resultPrefix =
      '<strong>Result:</strong> ' +
      '<span class="inline-math">$c_5 = 0$</span>, both strings exhausted.'
    const resultBits =
      '<span class="inline-math">$R = \\text{"10101"}$</span>'
    const resultValue =
      '<span class="inline-math">$\\text{val}(R) = 16 + 4 + 1 = 21 = ' +
      '10 + 11 = \\text{val}(A) + \\text{val}(B)$</span>.'

    expect(html).toContain(header)
    expect(html).toContain(finalRow)
    expect(html).toContain(
      resultPrefix
    )
    expect(html).toContain(resultBits)
    expect(html).toContain(resultValue)
  })
})
