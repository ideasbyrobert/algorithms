const path = require('path')
const createToolchain = require('../support/createToolchain')
const {
  loadTripletSubsequenceMarkdown
} = require('../support/tripletSubsequenceFixture')

const { projectRoot, staticPageGenerator } = createToolchain()

describe('StaticPageGenerator with the increasing triplet proof', () =>
{
  test('builds a root document without leaking inline-math placeholders', () =>
  {
    const outputPath = path.join(
      projectRoot,
      '334-increasing-triplet-subsequence.html'
    )
    const html = staticPageGenerator.generate(
      loadTripletSubsequenceMarkdown(),
      outputPath
    )
    const title =
      '<title>Formal Proof of the Two-Bound Triplet Detection Algorithm</title>'

    expect(html).toContain(title)
    expect(html).toContain('href="assets/styles/document-page.css"')
    expect(html).toContain('src="assets/scripts/mathjax-config.js"')
    expect(html).toContain('src="assets/scripts/load-mathjax.js"')
    expect(html).toContain(
      'data-local-source="assets/vendor/mathjax/tex-mml-chtml.js"'
    )
    expect(html).toContain(
      '<article><h1>Formal Proof of the Two-Bound Triplet Detection Algorithm</h1>'
    )
    expect(html).toContain('<td>complete triplet</td>')
    expect(html).not.toContain('__MATH_')
  })
})
