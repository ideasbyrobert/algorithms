const path = require('path')
const createToolchain = require('../support/createToolchain')
const { loadHIndexMarkdown } = require('../support/hIndexFixture')

const { projectRoot, staticPageGenerator } = createToolchain()

describe('StaticPageGenerator with the h-index proof', () =>
{
  test('builds a complete document with relative assets and converted content', () =>
  {
    const outputPath = path.join(projectRoot, 'docs', 'proofs', '274-hindex.html')
    const html = staticPageGenerator.generate(loadHIndexMarkdown(), outputPath)
    const title = '<title>Formal Proof of the H-Index Algorithm</title>'

    expect(html).toContain('<!DOCTYPE html>')
    expect(html).toContain(title)
    expect(html).toContain('../../assets/styles/document-page.css')
    expect(html).toContain('../../assets/scripts/mathjax-config.js')
    expect(html).toContain('../../assets/scripts/load-mathjax.js')
    expect(html).toContain('../../assets/vendor/mathjax/tex-mml-chtml.js')
    expect(html).toContain(
      '<article><h1>Formal Proof of the H-Index Algorithm</h1>'
    )
    expect(html).toContain('<div class="table-wrap"><table>')
    expect(html).toContain('<hr />')
  })
})
