const fs = require('fs')
const path = require('path')

const projectRoot = path.resolve(__dirname, '..', '..')

const requiredStaticFiles = [
  'assets/styles/document-page.css',
  'assets/og/default.png',
  'assets/scripts/mathjax-config.js',
  'assets/scripts/load-mathjax.js',
  'assets/vendor/mathjax/tex-mml-chtml.js',
  'robots.txt',
  'sitemap.xml'
]

function publishedHtmlPages()
{
  return fs.readdirSync(projectRoot)
    .filter((entry) => entry.endsWith('.html'))
    .filter((entry) => entry !== 'index.html')
    .filter((entry) => fs.statSync(path.join(projectRoot, entry)).isFile())
    .sort()
}

function allPublishedPaths()
{
  return [''].concat(publishedHtmlPages())
}

module.exports = {
  proofPages: publishedHtmlPages(),
  publishedHtmlPages,
  requiredStaticFiles,
  allPublishedPaths
}
