const path = require('path')
const createToolchain = require('../support/createToolchain')
const { loadHIndexMarkdown } = require('../support/hIndexFixture')
const siteMetadata = require('../../../site-seo/SiteMetadata')

const { projectRoot, staticPageGenerator } = createToolchain()

describe('StaticPageGenerator SEO metadata', () =>
{
  test('renders canonical metadata and structured data for a generated proof page', () =>
  {
    const outputPath = path.join(projectRoot, 'docs', 'proofs', '274-hindex.html')
    const html = staticPageGenerator.generate(loadHIndexMarkdown(), outputPath)
    const canonicalUrl = siteMetadata.baseUrl + '/docs/proofs/274-hindex.html'

    expect(html).toContain('<meta name="description" content="')
    expect(html).toContain('Part of The Mechanics of Problem-Solving')
    expect(html).toContain('<link rel="canonical" href="' + canonicalUrl + '" />')
    expect(html).toContain('<meta property="og:type" content="article" />')
    expect(html).toContain('<meta property="og:url" content="' + canonicalUrl + '" />')
    expect(html).toContain(
      '<meta property="og:image" content="' +
      siteMetadata.defaultSocialImageUrl +
      '" />'
    )
    expect(html).toContain(
      '<meta name="twitter:card" content="' +
      siteMetadata.twitterCard +
      '" />'
    )
    expect(html).toContain(
      '<meta name="twitter:image" content="' +
      siteMetadata.defaultSocialImageUrl +
      '" />'
    )
    expect(html).toContain('application/ld+json')
    expect(html).toContain('"@type":"TechArticle"')
    expect(html).toContain('"url":"' + canonicalUrl + '"')
    expect(html).toContain('"image":"' + siteMetadata.defaultSocialImageUrl + '"')
  })
})
