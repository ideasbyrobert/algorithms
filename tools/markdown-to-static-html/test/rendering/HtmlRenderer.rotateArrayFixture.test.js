const createToolchain = require('../support/createToolchain')
const {
  parseRotateArrayBlocks
} = require('../support/rotateArrayFixture')

const { htmlRenderer } = createToolchain()

function countOccurrences(text, fragment)
{
  return text.split(fragment).length - 1
}

describe('HtmlRenderer with the rotate array proof', () =>
{
  test('renders both tables in the mechanical execution section', () =>
  {
    const html = htmlRenderer.render(parseRotateArrayBlocks())

    expect(countOccurrences(html, '<div class="table-wrap"><table>')).toBe(2)
    expect(html).toContain('<th>Phase</th>')
    expect(html).toContain('<th><span class="inline-math">$l$</span></th>')
    expect(html).toContain(
      '<td><span class="inline-math">$\\text{Rev}(0, 6)$</span></td>'
    )
    expect(html).toContain(
      '<td><span class="inline-math">$A[2] = 5,\\; A[4] = 3$</span></td>'
    )
  })

  test('renders the phase labels and rotation result with inline math', () =>
  {
    const html = htmlRenderer.render(parseRotateArrayBlocks())

    expect(html).toContain('<strong>Phase 1</strong>')
    expect(html).toContain('<strong>Phase 2</strong>')
    expect(html).toContain('<strong>Phase 3</strong>')
    expect(html).toContain(
      '<strong>Result:</strong> ' +
      '<span class="inline-math">$A^{(f)} = (5, 6, 7, 1, 2, 3, 4) = T \\| F$</span>'
    )
  })
})
