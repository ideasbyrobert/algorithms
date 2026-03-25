const siteMetadata = require('../SiteMetadata')
const RobotsTxtRenderer = require('../RobotsTxtRenderer')

describe('RobotsTxtRenderer', () =>
{
  test('allows crawling and points crawlers to the sitemap', () =>
  {
    const renderer = new RobotsTxtRenderer(siteMetadata)
    const robotsTxt = renderer.render()
    const sitemapUrl =
      'Sitemap: https://ideasbyrobert.github.io/algorithms/sitemap.xml'

    expect(robotsTxt).toContain('User-agent: *')
    expect(robotsTxt).toContain('Allow: /')
    expect(robotsTxt).toContain(sitemapUrl)
  })
})
