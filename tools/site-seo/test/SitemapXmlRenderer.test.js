const siteMetadata = require('../SiteMetadata')
const SitemapXmlRenderer = require('../SitemapXmlRenderer')

describe('SitemapXmlRenderer', () =>
{
  test('renders GitHub Pages URLs for the home page and proof pages', () =>
  {
    const renderer = new SitemapXmlRenderer(siteMetadata)
    const xml = renderer.render(['', '67-add-binary.html'])
    const homeUrl = '<loc>https://ideasbyrobert.github.io/algorithms/</loc>'
    const proofUrl =
      '<loc>https://ideasbyrobert.github.io/algorithms/67-add-binary.html</loc>'

    expect(xml).toContain(homeUrl)
    expect(xml).toContain(proofUrl)
  })
})
