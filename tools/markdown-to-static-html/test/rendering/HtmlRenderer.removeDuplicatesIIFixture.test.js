const createToolchain = require('../support/createToolchain')
const {
  parseRemoveDuplicatesIIBlocks
} = require('../support/removeDuplicatesIIFixture')

const { htmlRenderer } = createToolchain()

function countOccurrences(text, fragment)
{
  return text.split(fragment).length - 1
}

describe('HtmlRenderer with the remove duplicates II proof', () =>
{
  test('renders the consequence bullets with inline math', () =>
  {
    const html = htmlRenderer.render(parseRemoveDuplicatesIIBlocks())

    expect(html).toContain(
      '<li><p><em>New value:</em> ' +
      '<span class="inline-math">$a_r &gt; a_{r-1}$</span>'
    )
    expect(html).toContain(
      '<li><p><em>Second copy:</em> ' +
      '<span class="inline-math">$a_r = a_{r-1} &gt; a_{r-2}$</span>'
    )
  })

  test('renders the gate trace table with the expected math headers and cells', () =>
  {
    const html = htmlRenderer.render(parseRemoveDuplicatesIIBlocks())

    expect(countOccurrences(html, '<div class="table-wrap"><table>')).toBe(1)
    expect(html).toContain(
      '<th><span class="inline-math">$A^{(t)}[w-2]$</span></th>'
    )
    expect(html).toContain(
      '<td><span class="inline-math">$3 \\ne 2$</span> — pass</td>'
    )
    expect(html).toContain(
      '<td>write <span class="inline-math">$A[4] \\gets 3$</span></td>'
    )
  })
})
