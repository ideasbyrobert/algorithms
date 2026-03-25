class RobotsTxtRenderer
{
  constructor(siteMetadata)
  {
    this.siteMetadata = siteMetadata
  }

  render()
  {
    return [
      'User-agent: *',
      'Allow: /',
      '',
      'Sitemap: ' + this.siteMetadata.baseUrl + '/sitemap.xml',
      ''
    ].join('\n')
  }
}

module.exports = RobotsTxtRenderer
