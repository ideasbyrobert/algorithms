const path = require('path')
const createToolchain = require('../support/createToolchain')
const {
  loadRotateArrayMarkdown
} = require('../support/rotateArrayFixture')

const { projectRoot, staticPageGenerator } = createToolchain()

describe('StaticPageGenerator with the rotate array proof', () =>
{
  test('builds a root document with two rendered tables', () =>
  {
    const outputPath = path.join(projectRoot, '189-rotate-array.html')
    const html = staticPageGenerator.generate(loadRotateArrayMarkdown(), outputPath)
    const title =
      '<title>Formal Proof of the Three-Reversal Rotation Algorithm</title>'

    expect(html).toContain(title)
    expect(html).toContain('href="assets/styles/document-page.css"')
    expect(html).toContain('src="assets/scripts/mathjax-config.js"')
    expect(html).toContain('src="assets/scripts/load-mathjax.js"')
    expect(html).toContain(
      'data-local-source="assets/vendor/mathjax/tex-mml-chtml.js"'
    )
    expect(html.split('<div class="table-wrap"><table>').length - 1).toBe(2)
    expect(html).toContain(
      '<article><h1>Formal Proof of the Three-Reversal Rotation Algorithm</h1>'
    )
  })
})
