const path = require('path')
const siteMetadata = require('../../site-seo/SiteMetadata')

class DocumentPageMetadataFactory
{
  constructor(projectRoot, metadata = siteMetadata)
  {
    this.projectRoot = projectRoot
    this.siteMetadata = metadata
  }

  create(blocks, outputFilePath, title)
  {
    const relativePath = this.toProjectRelativePath(outputFilePath)
    const description = this.buildDescription(blocks, title)
    const canonicalUrl = this.toCanonicalUrl(relativePath)

    return {
      title,
      description,
      canonicalUrl,
      locale: this.siteMetadata.locale,
      siteName: this.siteMetadata.siteName,
      twitterCard: this.siteMetadata.twitterCard,
      openGraphType: 'article',
      structuredData: this.createStructuredData(title, description, canonicalUrl)
    }
  }

  toProjectRelativePath(outputFilePath)
  {
    return path.relative(this.projectRoot, outputFilePath).split(path.sep).join('/')
  }

  buildDescription(blocks, title)
  {
    const paragraph = blocks.find((block) => block.type === 'paragraph')
    const introduction = paragraph ? paragraph.text : title
    const normalized = this.cleanText(introduction)
    const siteContext =
      'Part of The Mechanics of Problem-Solving, a growing ' +
      'collection of formal proofs for LeetCode and interview algorithms.'
    const summaryLimit = 240 - siteContext.length - 1
    const summary = this.truncate(this.ensureSentence(normalized), summaryLimit)
    const withContext = summary + ' ' + siteContext

    return this.truncate(withContext, 240)
  }

  cleanText(text)
  {
    return text
      .replace(/[*_`#]/g, '')
      .replace(/\$/g, '')
      .replace(/\\[A-Za-z]+/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()
  }

  ensureSentence(text)
  {
    if (!text)
    {
      return 'Formal proof and correctness notes for an interview algorithm.'
    }

    return /[.!?]$/.test(text) ? text : text + '.'
  }

  truncate(text, maxLength)
  {
    if (text.length <= maxLength)
    {
      return text
    }

    const shortened = text.slice(0, maxLength - 1)
    const safeBoundary = Math.max(shortened.lastIndexOf(' '), shortened.lastIndexOf(','))
    const trimmed = safeBoundary > 80 ? shortened.slice(0, safeBoundary) : shortened

    return trimmed.trim() + '…'
  }

  toCanonicalUrl(relativePath)
  {
    return relativePath
      ? this.siteMetadata.baseUrl + '/' + relativePath
      : this.siteMetadata.homeUrl
  }

  createStructuredData(title, description, canonicalUrl)
  {
    return {
      '@context': 'https://schema.org',
      '@type': 'TechArticle',
      headline: title,
      description,
      url: canonicalUrl,
      mainEntityOfPage: canonicalUrl,
      inLanguage: this.siteMetadata.language,
      isPartOf: {
        '@type': 'CollectionPage',
        name: this.siteMetadata.collectionName,
        url: this.siteMetadata.homeUrl
      },
      publisher: {
        '@type': 'Organization',
        name: this.siteMetadata.publisherName,
        url: this.siteMetadata.homeUrl
      },
      keywords: this.buildKeywords(title)
    }
  }

  buildKeywords(title)
  {
    return [
      'formal proof',
      'algorithm correctness',
      'LeetCode',
      'interview algorithms',
      this.problemName(title)
    ].join(', ')
  }

  problemName(title)
  {
    return title
      .replace(/^Formal Proof of\s+/i, '')
      .replace(/^the\s+/i, '')
      .replace(/\s+Algorithm$/i, '')
      .trim()
  }
}

module.exports = DocumentPageMetadataFactory
