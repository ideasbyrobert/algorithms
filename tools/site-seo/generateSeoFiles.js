const fs = require('fs')
const path = require('path')
const siteMetadata = require('./SiteMetadata')
const { allPublishedPaths } = require('./ProofPageCatalog')
const SitemapXmlRenderer = require('./SitemapXmlRenderer')
const RobotsTxtRenderer = require('./RobotsTxtRenderer')

const projectRoot = path.resolve(__dirname, '..', '..')
const sitemapRenderer = new SitemapXmlRenderer(siteMetadata)
const robotsRenderer = new RobotsTxtRenderer(siteMetadata)

fs.writeFileSync(
  path.join(projectRoot, 'sitemap.xml'),
  sitemapRenderer.render(allPublishedPaths()),
  'utf8'
)

fs.writeFileSync(
  path.join(projectRoot, 'robots.txt'),
  robotsRenderer.render(),
  'utf8'
)
