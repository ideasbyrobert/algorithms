const fs = require('fs')
const path = require('path')
const siteMetadata = require('./SiteMetadata')

class HtmlSeoNormalizer
{
  constructor(projectRoot, metadata = siteMetadata)
  {
    this.projectRoot = projectRoot
    this.siteMetadata = metadata
  }

  normalizeFile(projectRelativePath)
  {
    const absolutePath = path.join(this.projectRoot, projectRelativePath)
    const html = fs.readFileSync(absolutePath, 'utf8')
    const normalizedHtml = this.normalizeDocument(projectRelativePath, html)

    fs.writeFileSync(absolutePath, normalizedHtml, 'utf8')
  }

  normalizeDocument(projectRelativePath, html)
  {
    const headMatch = html.match(/<head>([\s\S]*?)<\/head>/i)

    if (!headMatch)
    {
      return html
    }

    const pageMetadata = this.isHomePage(projectRelativePath)
      ? this.createHomePageMetadata()
      : this.createArticlePageMetadata(projectRelativePath, html)

    const sanitizedHead = this.removeExistingSeoTags(headMatch[1])
    const headWithTitle = this.upsertTitleTag(sanitizedHead, pageMetadata.title)
    const normalizedHead =
      '<head>\n' +
      this.insertSeoBlock(headWithTitle, this.renderSeoBlock(pageMetadata)).trim() +
      '\n</head>'

    return html.replace(headMatch[0], normalizedHead)
  }

  isHomePage(projectRelativePath)
  {
    return projectRelativePath === 'index.html'
  }

  createHomePageMetadata()
  {
    return {
      title: this.siteMetadata.homeTitle,
      description: this.siteMetadata.homeDescription,
      canonicalUrl: this.siteMetadata.homeUrl,
      openGraphType: 'website',
      socialImageUrl: this.siteMetadata.defaultSocialImageUrl,
      socialImageWidth: this.siteMetadata.defaultSocialImageWidth,
      socialImageHeight: this.siteMetadata.defaultSocialImageHeight,
      structuredData: this.createHomeStructuredData()
    }
  }

  createArticlePageMetadata(projectRelativePath, html)
  {
    const title = this.extractTitle(html) || this.humanizePath(projectRelativePath)
    const description = this.buildArticleDescription(title, html)
    const socialImageUrl = this.resolveSocialImageUrl(html)
    const canonicalUrl = this.toCanonicalUrl(projectRelativePath)

    return {
      title,
      description,
      canonicalUrl,
      openGraphType: 'article',
      socialImageUrl,
      socialImageWidth: this.siteMetadata.defaultSocialImageWidth,
      socialImageHeight: this.siteMetadata.defaultSocialImageHeight,
      structuredData: this.createArticleStructuredData(
        projectRelativePath,
        title,
        description,
        canonicalUrl,
        socialImageUrl
      )
    }
  }

  createHomeStructuredData()
  {
    return {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      name: this.siteMetadata.homeTitle,
      description: this.siteMetadata.collectionDescription,
      url: this.siteMetadata.homeUrl,
      inLanguage: this.siteMetadata.language,
      image: this.siteMetadata.defaultSocialImageUrl,
      isPartOf: {
        '@type': 'WebSite',
        name: this.siteMetadata.siteName,
        url: this.siteMetadata.homeUrl
      },
      publisher: {
        '@type': 'Organization',
        name: this.siteMetadata.publisherName,
        url: this.siteMetadata.homeUrl
      },
      about: [
        'Algorithm visualizations',
        'Formal proofs',
        'Curriculum maps',
        'LeetCode',
        'Interview algorithms'
      ]
    }
  }

  createArticleStructuredData(
    projectRelativePath,
    title,
    description,
    canonicalUrl,
    socialImageUrl
  )
  {
    return {
      '@context': 'https://schema.org',
      '@type': 'TechArticle',
      headline: title,
      description,
      url: canonicalUrl,
      mainEntityOfPage: canonicalUrl,
      inLanguage: this.siteMetadata.language,
      image: socialImageUrl,
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
      keywords: this.buildKeywords(projectRelativePath, title)
    }
  }

  buildKeywords(projectRelativePath, title)
  {
    const primaryTopic = this.cleanProblemName(title)

    return [
      primaryTopic,
      'LeetCode',
      'interview algorithms',
      projectRelativePath.includes('proof') || /formal proof/i.test(title)
        ? 'formal proof'
        : 'algorithm visualization',
      'The Mechanics of Problem-Solving'
    ].join(', ')
  }

  buildArticleDescription(title, html)
  {
    const metaDescription =
      this.extractMetaContent(html, 'name', 'description') ||
      this.extractMetaContent(html, 'property', 'og:description')
    const paragraph = this.extractFirstParagraph(html)
    const introduction = this.removeSiteContext(metaDescription || paragraph || title)
    const summary = this.truncate(this.ensureSentence(introduction), 155)
    const context = 'Part of The Mechanics of Problem-Solving.'

    return this.truncate(summary + ' ' + context, 220)
  }

  extractTitle(html)
  {
    const titleMatch = html.match(/<title>([\s\S]*?)<\/title>/i)

    if (!titleMatch)
    {
      return ''
    }

    return this.cleanText(titleMatch[1])
  }

  extractFirstParagraph(html)
  {
    const paragraphMatch = html.match(/<p\b[^>]*>([\s\S]*?)<\/p>/i)

    if (!paragraphMatch)
    {
      return ''
    }

    return this.cleanText(this.stripTags(paragraphMatch[1]))
  }

  extractMetaContent(html, attributeName, attributeValue)
  {
    const tagPattern = new RegExp(
      '<meta\\b(?=[^>]*\\b' +
      attributeName +
      '=["\']' +
      this.escapeRegex(attributeValue) +
      '["\'])[^>]*\\bcontent=["\']([^"\']*)["\'][^>]*\\/?>',
      'i'
    )
    const match = html.match(tagPattern)

    return match ? this.cleanText(match[1]) : ''
  }

  resolveSocialImageUrl(html)
  {
    const existingImage =
      this.extractMetaContent(html, 'property', 'og:image') ||
      this.extractMetaContent(html, 'name', 'twitter:image')

    if (
      existingImage &&
      /^https?:\/\//i.test(existingImage) &&
      existingImage !== this.siteMetadata.baseUrl + '/default.png'
    )
    {
      return existingImage
    }

    return this.siteMetadata.defaultSocialImageUrl
  }

  removeExistingSeoTags(headContent)
  {
    return [
      /<meta\b(?=[^>]*\bname=["']description["'])[^>]*\/?>\s*/gi,
      /<meta\b(?=[^>]*\bname=["']robots["'])[^>]*\/?>\s*/gi,
      /<meta\b(?=[^>]*\bname=["']twitter:card["'])[^>]*\/?>\s*/gi,
      /<meta\b(?=[^>]*\bname=["']twitter:title["'])[^>]*\/?>\s*/gi,
      /<meta\b(?=[^>]*\bname=["']twitter:description["'])[^>]*\/?>\s*/gi,
      /<meta\b(?=[^>]*\bname=["']twitter:image["'])[^>]*\/?>\s*/gi,
      /<meta\b(?=[^>]*\bproperty=["']og:locale["'])[^>]*\/?>\s*/gi,
      /<meta\b(?=[^>]*\bproperty=["']og:type["'])[^>]*\/?>\s*/gi,
      /<meta\b(?=[^>]*\bproperty=["']og:site_name["'])[^>]*\/?>\s*/gi,
      /<meta\b(?=[^>]*\bproperty=["']og:title["'])[^>]*\/?>\s*/gi,
      /<meta\b(?=[^>]*\bproperty=["']og:description["'])[^>]*\/?>\s*/gi,
      /<meta\b(?=[^>]*\bproperty=["']og:url["'])[^>]*\/?>\s*/gi,
      /<meta\b(?=[^>]*\bproperty=["']og:image["'])[^>]*\/?>\s*/gi,
      /<meta\b(?=[^>]*\bproperty=["']og:image:width["'])[^>]*\/?>\s*/gi,
      /<meta\b(?=[^>]*\bproperty=["']og:image:height["'])[^>]*\/?>\s*/gi,
      /<link\b(?=[^>]*\brel=["']canonical["'])[^>]*\/?>\s*/gi,
      /<script\b(?=[^>]*\btype=["']application\/ld\+json["'])[\s\S]*?<\/script>\s*/gi
    ].reduce(
      (content, pattern) => content.replace(pattern, ''),
      headContent
    )
  }

  upsertTitleTag(headContent, title)
  {
    const titleTag = '<title>' + this.escapeHtml(title) + '</title>'

    if (/<title>[\s\S]*?<\/title>/i.test(headContent))
    {
      return headContent.replace(/<title>[\s\S]*?<\/title>/i, titleTag)
    }

    return titleTag + '\n' + headContent.trim()
  }

  insertSeoBlock(headContent, seoBlock)
  {
    if (/<title>[\s\S]*?<\/title>/i.test(headContent))
    {
      return headContent.replace(/(<title>[\s\S]*?<\/title>)/i, '$1\n' + seoBlock)
    }

    return seoBlock + '\n' + headContent.trim()
  }

  renderSeoBlock(pageMetadata)
  {
    return [
      '  <meta name="description" content="' +
      this.escapeHtml(pageMetadata.description) +
      '" />',
      '  <meta name="robots" content="index,follow,max-image-preview:large" />',
      '  <link rel="canonical" href="' +
      this.escapeHtml(pageMetadata.canonicalUrl) +
      '" />',
      '  <meta property="og:locale" content="' +
      this.escapeHtml(this.siteMetadata.locale) +
      '" />',
      '  <meta property="og:type" content="' +
      this.escapeHtml(pageMetadata.openGraphType) +
      '" />',
      '  <meta property="og:site_name" content="' +
      this.escapeHtml(this.siteMetadata.siteName) +
      '" />',
      '  <meta property="og:title" content="' +
      this.escapeHtml(pageMetadata.title) +
      '" />',
      '  <meta property="og:description" content="' +
      this.escapeHtml(pageMetadata.description) +
      '" />',
      '  <meta property="og:url" content="' +
      this.escapeHtml(pageMetadata.canonicalUrl) +
      '" />',
      '  <meta property="og:image" content="' +
      this.escapeHtml(pageMetadata.socialImageUrl) +
      '" />',
      '  <meta property="og:image:width" content="' +
      this.escapeHtml(pageMetadata.socialImageWidth) +
      '" />',
      '  <meta property="og:image:height" content="' +
      this.escapeHtml(pageMetadata.socialImageHeight) +
      '" />',
      '  <meta name="twitter:card" content="' +
      this.escapeHtml(this.siteMetadata.twitterCard) +
      '" />',
      '  <meta name="twitter:title" content="' +
      this.escapeHtml(pageMetadata.title) +
      '" />',
      '  <meta name="twitter:description" content="' +
      this.escapeHtml(pageMetadata.description) +
      '" />',
      '  <meta name="twitter:image" content="' +
      this.escapeHtml(pageMetadata.socialImageUrl) +
      '" />',
      '  <script type="application/ld+json">' +
      this.renderStructuredData(pageMetadata.structuredData) +
      '</script>'
    ].join('\n')
  }

  renderStructuredData(structuredData)
  {
    return JSON.stringify(structuredData).replace(/</g, '\\u003c')
  }

  toCanonicalUrl(projectRelativePath)
  {
    return projectRelativePath === 'index.html'
      ? this.siteMetadata.homeUrl
      : this.siteMetadata.baseUrl + '/' + projectRelativePath
  }

  humanizePath(projectRelativePath)
  {
    return projectRelativePath
      .replace(/\.html$/i, '')
      .replace(/-/g, ' ')
      .replace(/\b\w/g, (character) => character.toUpperCase())
  }

  cleanProblemName(title)
  {
    return title
      .replace(/\s*[|·]\s*Interactive Visualization$/i, '')
      .replace(/\s*[-—]\s*Interactive Visualization$/i, '')
      .replace(/^Formal Proof of\s+/i, '')
      .replace(/^the\s+/i, '')
      .replace(/\s+Algorithm$/i, '')
      .trim()
  }

  removeSiteContext(text)
  {
    return text
      .replace(/\s*Part of The Mechanics of Problem-Solving[\s\S]*$/i, '')
      .trim()
  }

  cleanText(text)
  {
    return this.decodeHtmlEntities(
      text
        .replace(/\s+/g, ' ')
        .trim()
    )
  }

  stripTags(text)
  {
    return text
      .replace(/<script[\s\S]*?<\/script>/gi, ' ')
      .replace(/<style[\s\S]*?<\/style>/gi, ' ')
      .replace(/<[^>]+>/g, ' ')
  }

  ensureSentence(text)
  {
    return /[.!?]$/.test(text) ? text : text + '.'
  }

  truncate(text, maxLength)
  {
    if (text.length <= maxLength)
    {
      return text
    }

    const shortened = text.slice(0, maxLength - 1)
    const boundary = Math.max(shortened.lastIndexOf(' '), shortened.lastIndexOf(','))
    const safeText = boundary > 80 ? shortened.slice(0, boundary) : shortened

    return safeText.trim() + '…'
  }

  escapeRegex(text)
  {
    return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  }

  escapeHtml(text)
  {
    return String(text)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
  }

  decodeHtmlEntities(text)
  {
    const namedEntities = {
      amp: '&',
      lt: '<',
      gt: '>',
      quot: '"',
      apos: "'",
      nbsp: ' ',
      ndash: '–',
      mdash: '—',
      hellip: '…'
    }

    return text.replace(/&(#x?[0-9a-fA-F]+|[a-zA-Z]+);/g, (match, entity) =>
    {
      if (entity[0] === '#')
      {
        const isHex = entity[1].toLowerCase() === 'x'
        const value = parseInt(entity.slice(isHex ? 2 : 1), isHex ? 16 : 10)

        return Number.isNaN(value) ? match : String.fromCodePoint(value)
      }

      return Object.prototype.hasOwnProperty.call(namedEntities, entity)
        ? namedEntities[entity]
        : match
    })
  }
}

module.exports = HtmlSeoNormalizer
