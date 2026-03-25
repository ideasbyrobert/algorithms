const path = require('path')
const createToolchain = require('../support/createToolchain')
const {
  loadIntegerToRomanMarkdown
} = require('../support/integerToRomanFixture')

const { projectRoot, staticPageGenerator } = createToolchain()

describe('StaticPageGenerator with the integer-to-roman proof', () =>
{
  test('builds a root document with the cases equation and root asset paths', () =>
  {
    const outputPath = path.join(projectRoot, '12-integer-to-roman.html')
    const html = staticPageGenerator.generate(
      loadIntegerToRomanMarkdown(),
      outputPath
    )
    const title =
      '<title>Formal Proof of the Greedy Roman Numeral Construction Algorithm</title>'

    expect(html).toContain(title)
    expect(html).toContain('href="assets/styles/document-page.css"')
    expect(html).toContain('src="assets/scripts/mathjax-config.js"')
    expect(html).toContain('src="assets/scripts/load-mathjax.js"')
    expect(html).toContain(
      'data-local-source="assets/vendor/mathjax/tex-mml-chtml.js"'
    )
    expect(html).toContain('<div class="equation">$$\\rho_p(d) = \\begin{cases}')
    expect(html).toContain('\\end{cases}$$</div>')
    expect(html).not.toContain('<p>$<span class="inline-math">$\\rho_p(d)')
  })
})
