const proofPages = [
  '12-integer-to-roman.html',
  '67-add-binary.html',
  '80-remove-duplicates-II.html',
  '88-merge-sorted-array.html',
  '169-majority-element.html',
  '189-rotate-array.html',
  '274-hindex.html',
  '334-increasing-triplet-subsequence.html'
]

const requiredStaticFiles = [
  'assets/styles/document-page.css',
  'assets/scripts/mathjax-config.js',
  'assets/scripts/load-mathjax.js',
  'assets/vendor/mathjax/tex-mml-chtml.js',
  'robots.txt',
  'sitemap.xml'
]

function allPublishedPaths()
{
  return [''].concat(proofPages)
}

module.exports = {
  proofPages,
  requiredStaticFiles,
  allPublishedPaths
}
