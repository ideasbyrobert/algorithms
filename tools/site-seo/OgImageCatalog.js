const fs = require('fs')
const path = require('path')

class OgImageCatalog
{
  constructor(projectRoot, siteMetadata)
  {
    this.projectRoot = projectRoot
    this.siteMetadata = siteMetadata
  }

  projectRelativeAssetPathFor(pagePath)
  {
    return path.posix.join('assets/og', this.assetFileNameFor(pagePath))
  }

  absoluteAssetPathFor(pagePath)
  {
    return path.join(this.projectRoot, this.projectRelativeAssetPathFor(pagePath))
  }

  assetUrlFor(pagePath)
  {
    return (
      this.siteMetadata.baseUrl +
      '/' +
      this.projectRelativeAssetPathFor(pagePath)
    )
  }

  hasAssetFor(pagePath)
  {
    return fs.existsSync(this.absoluteAssetPathFor(pagePath))
  }

  assetFileNameFor(pagePath)
  {
    if (!pagePath || pagePath === 'index.html')
    {
      return 'default.png'
    }

    return this.assetStemFor(pagePath) + '.png'
  }

  assetStemFor(pagePath)
  {
    return path.basename(pagePath, '.html').replace(/^\d+-/, '')
  }
}

module.exports = OgImageCatalog
