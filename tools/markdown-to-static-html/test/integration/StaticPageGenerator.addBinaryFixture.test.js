const path = require('path')
const createToolchain = require('../support/createToolchain')
const {
  loadAddBinaryMarkdown
} = require('../support/addBinaryFixture')

const { projectRoot, staticPageGenerator } = createToolchain()

describe('StaticPageGenerator with the add-binary proof', () =>
{
  test('builds a root document with aligned equations and root asset paths', () =>
  {
    const outputPath = path.join(projectRoot, '67-add-binary.html')
    const html = staticPageGenerator.generate(loadAddBinaryMarkdown(), outputPath)
    const title =
      '<title>Formal Proof of the Right-to-Left Binary Addition Algorithm</title>'

    expect(html).toContain(title)
    expect(html).toContain('href="assets/styles/document-page.css"')
    expect(html).toContain('src="assets/scripts/mathjax-config.js"')
    expect(html).toContain('src="assets/scripts/load-mathjax.js"')
    expect(html).toContain(
      'data-local-source="assets/vendor/mathjax/tex-mml-chtml.js"'
    )
    expect(html).toContain('<div class="equation">$$\\begin{aligned}')
    expect(html).toContain('\\end{aligned}$$</div>')
    expect(html).not.toContain('<p>$<span class="inline-math">$\\begin{aligned}')
    expect(html).not.toContain('__MATH_')
  })
})
