const createToolchain = require('../support/createToolchain')
const {
  parseMajorityElementBlocks
} = require('../support/majorityElementFixture')

const { htmlRenderer } = createToolchain()

describe('HtmlRenderer with the majority element proof', () =>
{
  test('renders the streaming vote branch labels with inline math', () =>
  {
    const html = htmlRenderer.render(parseMajorityElementBlocks())
    const startLabel =
      '<strong>Start</strong> (' +
      '<span class="inline-math">$\\beta = 0$</span>' +
      '):'
    const reinforceLabel =
      '<strong>Reinforce</strong> (' +
      '<span class="inline-math">$a_r = \\gamma$</span>, ' +
      '<span class="inline-math">$\\beta &gt; 0$</span>' +
      '):'
    const cancelLabel =
      '<strong>Cancel</strong> (' +
      '<span class="inline-math">$a_r \\ne \\gamma$</span>, ' +
      '<span class="inline-math">$\\beta &gt; 0$</span>' +
      '):'

    expect(html).toContain(startLabel)
    expect(html).toContain(reinforceLabel)
    expect(html).toContain(cancelLabel)
  })

  test('renders the Boyer-Moore trace table with the expected math cells', () =>
  {
    const html = htmlRenderer.render(parseMajorityElementBlocks())

    expect(html).toContain('<th><span class="inline-math">$\\gamma$</span></th>')
    expect(html).toContain(
      '<td><span class="inline-math">$\\gamma \\gets 1$</span></td>'
    )
    expect(html).toContain('<td>reinforce</td>')
    expect(html).toContain(
      '<td><span class="inline-math">$\\beta - 1$</span></td>'
    )
  })
})
