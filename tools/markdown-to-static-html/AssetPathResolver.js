const path = require('path')

class AssetPathResolver 
{
  constructor(projectRoot) 
  {
    this.projectRoot = projectRoot
  }

  resolve(outputFilePath) 
  {
    const outputDirectory = path.dirname(outputFilePath)

    return {
      stylesheetPath: this.relativePath(
        outputDirectory,
        path.join(this.projectRoot, 'assets', 'styles', 'document-page.css')
      ),
      mathJaxConfigPath: this.relativePath(
        outputDirectory,
        path.join(this.projectRoot, 'assets', 'scripts', 'mathjax-config.js')
      ),
      mathJaxLoaderPath: this.relativePath(
        outputDirectory,
        path.join(this.projectRoot, 'assets', 'scripts', 'load-mathjax.js')
      ),
      mathJaxLocalPath: this.relativePath(
        outputDirectory,
        path.join(
          this.projectRoot,
          'assets',
          'vendor',
          'mathjax',
          'tex-mml-chtml.js'
        )
      ),
      mathJaxCdnPath:
        'https://cdn.jsdelivr.net/npm/mathjax@3.2.2/es5/tex-mml-chtml.js'
    }
  }

  relativePath(fromDirectory, toFilePath) 
  {
    return path.relative(fromDirectory, toFilePath).split(path.sep).join('/')
  }
}

module.exports = AssetPathResolver
