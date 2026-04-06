const fs = require('fs')
const path = require('path')
const siteMetadata = require('./SiteMetadata')
const { allPublishedPaths, publishedHtmlPages } = require('./ProofPageCatalog')
const HtmlSeoNormalizer = require('./HtmlSeoNormalizer')
const OgImageGenerator = require('./OgImageGenerator')
const SitemapXmlRenderer = require('./SitemapXmlRenderer')
const RobotsTxtRenderer = require('./RobotsTxtRenderer')

const projectRoot = path.resolve(__dirname, '..', '..')
const sitemapRenderer = new SitemapXmlRenderer(siteMetadata)
const robotsRenderer = new RobotsTxtRenderer(siteMetadata)
const ogImageGenerator = new OgImageGenerator(projectRoot, siteMetadata)
const seoNormalizer = new HtmlSeoNormalizer(projectRoot, siteMetadata)
const htmlPages = publishedHtmlPages()

ogImageGenerator.generateForPages(htmlPages)
seoNormalizer.normalizeFile('index.html')
htmlPages.forEach((htmlPath) => seoNormalizer.normalizeFile(htmlPath))

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
