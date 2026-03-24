const createToolchain = require('../support/createToolchain')
const {
  parseTripletSubsequenceBlocks
} = require('../support/tripletSubsequenceFixture')

const { htmlRenderer } = createToolchain()

describe('HtmlRenderer with the increasing triplet proof', () =>
{
  test('renders strict inequality inline math without leaking placeholders', () =>
  {
    const html = htmlRenderer.render(parseTripletSubsequenceBlocks())
    const comparison =
      '<span class="inline-math">$\\le$</span> but not ' +
      '<span class="inline-math">$&lt;$</span>'

    expect(html).toContain(comparison)
    expect(html).not.toContain('__MATH_')
  })

  test('renders the triplet detection table and result', () =>
  {
    const html = htmlRenderer.render(parseTripletSubsequenceBlocks())
    const result =
      '<strong>Result:</strong> ' +
      '<span class="inline-math">$\\mathcal{T}(A) = \\text{true}$</span>'

    expect(html).toContain('<th><span class="inline-math">$f$</span></th>')
    expect(html).toContain('<td>complete triplet</td>')
    expect(html).toContain(result)
  })
})
