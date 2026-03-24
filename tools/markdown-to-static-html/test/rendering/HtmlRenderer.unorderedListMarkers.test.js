const createToolchain = require('../support/createToolchain')
const {
  parseMergeSortedArrayBlocks
} = require('../support/mergeSortedArrayFixture')

const { htmlRenderer } = createToolchain()

describe('HtmlRenderer unordered list markers', () =>
{
  test('renders hyphen-prefixed merge fixture proof cases as list items', () =>
  {
    const html = htmlRenderer.render(parseMergeSortedArrayBlocks())

    expect(html).toContain(
      '<li><p>If <span class="inline-math">$p_1 &lt; 0$</span>:'
    )
    expect(html).toContain(
      '<li><p>If <span class="inline-math">$A^{(0)}[p_1] \\le B[p_2]$</span>:'
    )
  })
})
