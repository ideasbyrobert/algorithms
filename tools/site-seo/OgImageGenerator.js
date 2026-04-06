const fs = require('fs')
const os = require('os')
const path = require('path')
const { execFileSync } = require('child_process')
const siteMetadata = require('./SiteMetadata')
const OgImageCatalog = require('./OgImageCatalog')

class OgImageGenerator
{
  constructor(projectRoot, metadata = siteMetadata)
  {
    this.projectRoot = projectRoot
    this.siteMetadata = metadata
    this.ogImageCatalog = new OgImageCatalog(projectRoot, metadata)
  }

  generateForPages(pagePaths)
  {
    this.ensureOutputDirectory()
    this.generateImageFor('index.html')
    pagePaths.forEach((pagePath) => this.generateImageFor(pagePath))
  }

  generateImageFor(pagePath)
  {
    const html = this.readPageHtml(pagePath)
    const outputPath = this.ogImageCatalog.absoluteAssetPathFor(pagePath)
    const svgPath = this.createTemporarySvgPath(pagePath)
    const svg = this.renderSvg(this.createCard(pagePath, html))

    fs.writeFileSync(svgPath, svg, 'utf8')

    try
    {
      execFileSync(
        'sips',
        ['-s', 'format', 'png', svgPath, '--out', outputPath],
        { stdio: 'ignore' }
      )
    }
    finally
    {
      fs.rmSync(svgPath, { force: true })
    }
  }

  ensureOutputDirectory()
  {
    fs.mkdirSync(path.join(this.projectRoot, 'assets', 'og'), { recursive: true })
  }

  readPageHtml(pagePath)
  {
    return fs.readFileSync(path.join(this.projectRoot, pagePath), 'utf8')
  }

  createTemporarySvgPath(pagePath)
  {
    const stem = this.ogImageCatalog.assetStemFor(pagePath || 'index.html') || 'default'

    return path.join(os.tmpdir(), 'algorithms-og-' + stem + '.svg')
  }

  createCard(pagePath, html)
  {
    const title = this.extractTitle(html)
    const problemNumber = this.extractProblemNumber(pagePath)
    const pageKind = this.detectPageKind(pagePath, title, html)
    const textSections = this.extractTextSections(pagePath, title, pageKind)

    return {
      eyebrow: problemNumber
        ? 'Problem ' + problemNumber
        : this.siteMetadata.collectionName,
      kindLabel: pageKind,
      mainLines: this.wrapText(textSections.main, 20, 2),
      subtitleLines: this.wrapText(textSections.subtitle, 28, 2),
      footer: 'Ideas by Robert · ideasbyrobert.github.io/algorithms'
    }
  }

  extractTitle(html)
  {
    const match = html.match(/<title>([\s\S]*?)<\/title>/i)

    return match ? this.decodeEntities(match[1].trim()) : 'Algorithms'
  }

  extractProblemNumber(pagePath)
  {
    const match = path.basename(pagePath).match(/^(\d+)-/)

    return match ? match[1] : ''
  }

  detectPageKind(pagePath, title, html)
  {
    const description = this.extractMetaDescription(html)

    if (pagePath === 'index.html')
    {
      return 'Algorithm Curriculum'
    }

    if (/formal proof/i.test(title) || /formal proof/i.test(description))
    {
      return 'Formal Proof'
    }

    if (/interactive visualization/i.test(title) || /interactive/i.test(description))
    {
      return 'Interactive Visualization'
    }

    return 'Algorithm Lesson'
  }

  extractMetaDescription(html)
  {
    const match = html.match(
      new RegExp(
        '<meta\\b(?=[^>]*\\bname=["\']description["\'])[^>]*' +
        '\\bcontent=["\']([^"\']*)["\'][^>]*\\/?>',
        'i'
      )
    )

    return match ? this.decodeEntities(match[1].trim()) : ''
  }

  extractTextSections(pagePath, title, pageKind)
  {
    if (pagePath === 'index.html')
    {
      return {
        main: 'Algorithms',
        subtitle: 'Visualizations, Proofs, and Curriculum Maps'
      }
    }

    if (pageKind === 'Formal Proof')
    {
      return {
        main: this.cleanProofTitle(title),
        subtitle: 'Formal Proof'
      }
    }

    const cleanedTitle = this.cleanInteractiveTitle(title)
    const segments = this.splitTitleSegments(cleanedTitle)
    const main = segments.shift() || cleanedTitle
    const subtitle = segments.join(' · ') || pageKind

    return { main, subtitle }
  }

  cleanProofTitle(title)
  {
    return title
      .replace(/^Formal Proof of\s+/i, '')
      .replace(/^the\s+/i, '')
      .replace(/\s+Algorithm$/i, '')
      .trim()
  }

  cleanInteractiveTitle(title)
  {
    return title
      .replace(/\s*[·|]\s*Interactive Visualization$/i, '')
      .replace(/\s*[-—]\s*Interactive Visualization$/i, '')
      .trim()
  }

  splitTitleSegments(title)
  {
    return title
      .split(/\s+[—|]\s+|\s+·\s+/)
      .map((segment) => segment.trim())
      .filter(Boolean)
  }

  wrapText(text, maxCharsPerLine, maxLines)
  {
    const words = text.split(/\s+/).filter(Boolean)
    const lines = []
    let currentLine = ''

    words.forEach((word) =>
    {
      if (lines.length === maxLines)
      {
        return
      }

      const candidate = currentLine ? currentLine + ' ' + word : word

      if (candidate.length <= maxCharsPerLine || !currentLine)
      {
        currentLine = candidate
        return
      }

      lines.push(currentLine)
      currentLine = word
    })

    if (currentLine && lines.length < maxLines)
    {
      lines.push(currentLine)
    }

    if (words.join(' ').length > lines.join(' ').length && lines.length)
    {
      lines[lines.length - 1] = this.truncateLine(
        lines[lines.length - 1],
        maxCharsPerLine
      )
    }

    return lines.length ? lines : ['Algorithms']
  }

  truncateLine(text, maxCharsPerLine)
  {
    if (text.length <= maxCharsPerLine)
    {
      return text
    }

    return text.slice(0, Math.max(1, maxCharsPerLine - 1)).trimEnd() + '…'
  }

  renderSvg(card)
  {
    const mainLines = this.renderTextLines(
      card.mainLines,
      82,
      320,
      'title'
    )
    const subtitleStartY = 320 + card.mainLines.length * 82 + 30
    const subtitleLines = this.renderTextLines(
      card.subtitleLines,
      58,
      subtitleStartY,
      'subtitle'
    )
    const kindY = Math.min(
      subtitleStartY + card.subtitleLines.length * 58 + 54,
      548
    )

    return [
      (
        '<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" ' +
        'viewBox="0 0 1200 630">'
      ),
      '<defs>',
      '<style>',
      '.bg { fill: #030303; }',
      '.grid { stroke: rgba(255,255,255,0.035); stroke-width: 1; }',
      '.rule { stroke: rgba(255,255,255,0.08); stroke-width: 1; }',
      (
        '.eyebrow { fill: rgba(255,255,255,0.52); font-family: "SF Mono", ' +
        'Menlo, Monaco, monospace; font-size: 16px; letter-spacing: 0.22em; ' +
        'text-transform: uppercase; }'
      ),
      (
        '.title { fill: #ffffff; font-family: "Iowan Old Style", Baskerville, ' +
        'Georgia, serif; font-size: 66px; font-weight: 700; }'
      ),
      (
        '.subtitle { fill: rgba(255,255,255,0.76); font-family: "Iowan Old ' +
        'Style", Baskerville, Georgia, serif; font-size: 46px; }'
      ),
      (
        '.kind { fill: rgba(255,255,255,0.36); font-family: "SF Mono", Menlo, ' +
        'Monaco, monospace; font-size: 20px; letter-spacing: 0.12em; }'
      ),
      (
        '.footer { fill: rgba(255,255,255,0.42); font-family: "SF Pro Display", ' +
        '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; ' +
        'font-size: 14px; }'
      ),
      '.bracket { stroke: rgba(255,255,255,0.22); stroke-width: 2; fill: none; }',
      '</style>',
      '</defs>',
      '<rect class="bg" width="1200" height="630" rx="0" />',
      this.renderGrid(),
      '<line class="rule" x1="80" y1="280" x2="1080" y2="280" />',
      (
        '<text class="eyebrow" x="80" y="84">' +
        this.escapeXml(card.eyebrow) +
        '</text>'
      ),
      mainLines,
      subtitleLines,
      (
        '<text class="kind" x="80" y="' +
        kindY +
        '">' +
        this.escapeXml(card.kindLabel) +
        '</text>'
      ),
      (
        '<text class="footer" x="80" y="580">' +
        this.escapeXml(card.footer) +
        '</text>'
      ),
      '<path class="bracket" d="M1060 330 L1080 330 L1080 430 L1060 430" />',
      '</svg>'
    ].join('\n')
  }

  renderGrid()
  {
    const lines = []

    for (let x = 60; x <= 1140; x += 40)
    {
      lines.push(
        '<line class="grid" x1="' + x + '" y1="60" x2="' + x + '" y2="240" />'
      )
    }

    for (let y = 60; y <= 240; y += 40)
    {
      lines.push('<line class="grid" x1="60" y1="' + y + '" x2="1140" y2="' + y + '" />')
    }

    return lines.join('\n')
  }

  renderTextLines(lines, lineHeight, startY, className)
  {
    return lines.map((line, index) =>
      '<text class="' +
      className +
      '" x="80" y="' +
      (startY + index * lineHeight) +
      '">' +
      this.escapeXml(line) +
      '</text>'
    ).join('\n')
  }

  escapeXml(text)
  {
    return String(text)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;')
  }

  decodeEntities(text)
  {
    return text
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .replace(/&nbsp;/g, ' ')
      .replace(/&#8212;/g, '—')
  }
}

module.exports = OgImageGenerator
