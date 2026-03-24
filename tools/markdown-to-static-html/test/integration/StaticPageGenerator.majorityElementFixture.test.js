const path = require('path')
const createToolchain = require('../support/createToolchain')
const {
  loadMajorityElementMarkdown
} = require('../support/majorityElementFixture')

const { projectRoot, staticPageGenerator } = createToolchain()

describe('StaticPageGenerator with the majority element proof', () =>
{
  test('builds a root document with root-relative assets', () =>
  {
    const outputPath = path.join(projectRoot, '169-majority-element.html')
    const html = staticPageGenerator.generate(
      loadMajorityElementMarkdown(),
      outputPath
    )
    const title = '<title>Formal Proof of the Boyer-Moore Voting Algorithm</title>'

    expect(html).toContain(title)
    expect(html).toContain('href="assets/styles/document-page.css"')
    expect(html).toContain('src="assets/scripts/mathjax-config.js"')
    expect(html).toContain('src="assets/scripts/load-mathjax.js"')
    expect(html).toContain(
      'data-local-source="assets/vendor/mathjax/tex-mml-chtml.js"'
    )
    expect(html).toContain(
      '<article><h1>Formal Proof of the Boyer-Moore Voting Algorithm</h1>'
    )
    expect(html).toContain(
      '<td><span class="inline-math">$\\gamma \\gets 2$</span></td>'
    )
  })
})
