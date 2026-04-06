const fs = require('fs')
const path = require('path')
const siteMetadata = require('./SiteMetadata')
const {
  publishedHtmlPages,
  requiredStaticFiles,
  allPublishedPaths
} = require('./ProofPageCatalog')

const projectRoot = path.resolve(__dirname, '..', '..')
const articlePages = publishedHtmlPages()
const publishedHtmlFiles = ['index.html'].concat(articlePages)
const requiredFiles = publishedHtmlFiles.concat(requiredStaticFiles)

requiredFiles.forEach(assertExists)

const indexHtml = readProjectFile('index.html')
articlePages.forEach((htmlPath) =>
  assertContains(
    indexHtml,
    'href="' + htmlPath + '"',
    'Missing index link ' + htmlPath
  )
)

publishedHtmlFiles.forEach((htmlPath) =>
  assertSeoMarkers(htmlPath, readProjectFile(htmlPath))
)

const robotsTxt = readProjectFile('robots.txt')
assertContains(
  robotsTxt,
  'Sitemap: ' + siteMetadata.baseUrl + '/sitemap.xml',
  'Missing sitemap declaration in robots.txt'
)

const sitemapXml = readProjectFile('sitemap.xml')
allPublishedPaths().forEach((pagePath) =>
  assertContains(
    sitemapXml,
    toAbsoluteUrl(pagePath),
    'Missing sitemap entry for ' + pagePath
  )
)

function assertExists(projectRelativePath)
{
  const absolutePath = path.join(projectRoot, projectRelativePath)

  if (!fs.existsSync(absolutePath))
  {
    throw new Error('Missing ' + projectRelativePath)
  }
}

function readProjectFile(projectRelativePath)
{
  return fs.readFileSync(path.join(projectRoot, projectRelativePath), 'utf8')
}

function assertSeoMarkers(filePath, html)
{
  [
    '<meta name="description"',
    '<link rel="canonical"',
    '<meta property="og:site_name"',
    '<meta property="og:title"',
    '<meta property="og:image"',
    '<meta name="twitter:card"',
    '<meta name="twitter:image"',
    'application/ld+json'
  ].forEach((marker) =>
    assertContains(html, marker, 'Missing ' + marker + ' in ' + filePath)
  )
}

function assertContains(content, expected, errorMessage)
{
  if (!content.includes(expected))
  {
    throw new Error(errorMessage)
  }
}

function toAbsoluteUrl(pagePath)
{
  return pagePath ? siteMetadata.baseUrl + '/' + pagePath : siteMetadata.homeUrl
}
