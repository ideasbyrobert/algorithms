const fs = require('fs')
const path = require('path')
const siteMetadata = require('./SiteMetadata')
const {
  proofPages,
  requiredStaticFiles,
  allPublishedPaths
} = require('./ProofPageCatalog')

const projectRoot = path.resolve(__dirname, '..', '..')
const publishedHtmlFiles = ['index.html'].concat(proofPages)
const requiredFiles = publishedHtmlFiles.concat(requiredStaticFiles)

requiredFiles.forEach(assertExists)

const indexHtml = readProjectFile('index.html')
proofPages.forEach((proofPagePath) =>
  assertContains(
    indexHtml,
    'href="' + proofPagePath + '"',
    'Missing index link ' + proofPagePath
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
    '<meta property="og:title"',
    '<meta name="twitter:card"',
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
