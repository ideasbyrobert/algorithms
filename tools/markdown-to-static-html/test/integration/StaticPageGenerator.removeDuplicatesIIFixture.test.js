const path = require('path')
const createToolchain = require('../support/createToolchain')
const {
  loadRemoveDuplicatesIIMarkdown
} = require('../support/removeDuplicatesIIFixture')

const { projectRoot, staticPageGenerator } = createToolchain()

describe('StaticPageGenerator with the remove duplicates II proof', () =>
{
  test('builds a root document with the gate trace table and root assets', () =>
  {
    const outputPath = path.join(projectRoot, '80-remove-duplicates-II.html')
    const html = staticPageGenerator.generate(
      loadRemoveDuplicatesIIMarkdown(),
      outputPath
    )
    const title =
      '<title>Formal Proof of the At-Most-Two Compaction Algorithm</title>'

    expect(html).toContain(title)
    expect(html).toContain('href="assets/styles/document-page.css"')
    expect(html).toContain('src="assets/scripts/mathjax-config.js"')
    expect(html).toContain('src="assets/scripts/load-mathjax.js"')
    expect(html).toContain(
      'data-local-source="assets/vendor/mathjax/tex-mml-chtml.js"'
    )
    expect(html).toContain(
      '<article><h1>Formal Proof of the At-Most-Two Compaction Algorithm</h1>'
    )
    expect(html).toContain(
      '<th><span class="inline-math">$A^{(t)}[w-2]$</span></th>'
    )
    expect(html).toContain(
      '<td>write <span class="inline-math">$A[4] \\gets 3$</span></td>'
    )
  })
})
