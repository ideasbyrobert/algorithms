const MarkdownLineClassifier = require('./parsing/MarkdownLineClassifier')
const MarkdownListParser = require('./parsing/MarkdownListParser')
const MarkdownTableParser = require('./parsing/MarkdownTableParser')

class MarkdownParser 
{
  constructor(
    lineClassifier = new MarkdownLineClassifier(),
    tableParser = null,
    listParser = null
  ) 
  {
    this.lineClassifier = lineClassifier
    this.tableParser = tableParser || new MarkdownTableParser(this.lineClassifier)
    this.listParser = listParser || new MarkdownListParser(
      this.lineClassifier,
      (lines) => this.parseBlocks(lines)
    )
  }

  parse(markdown) 
  {
    return this.parseBlocks(this.lineClassifier.normalizeLines(markdown))
  }

  parseBlocks(lines) 
  {
    const blocks = []
    let index = 0

    while (index < lines.length) 
    {
      const result = this.parseNextBlock(lines, index)

      if (result.block) 
      {
        blocks.push(result.block)
      }

      index = result.nextIndex
    }

    return blocks
  }

  parseNextBlock(lines, index) 
  {
    const line = lines[index]

    if (this.lineClassifier.isBlank(line)) 
    {
      return this.blockResult(null, index + 1)
    }

    return this.parseStructuredBlock(lines, index) ||
      this.parseParagraphBlock(lines, index)
  }

  blockResult(block, nextIndex) 
  {
    return { block, nextIndex }
  }

  parseStructuredBlock(lines, index) 
  {
    const line = lines[index]

    return this.parseHeading1Block(line, index) ||
      this.parseHeading2Block(line, index) ||
      this.parseRuleBlock(line, index) ||
      this.parseEquationBlock(lines, index) ||
      this.tableParser.parse(lines, index) ||
      this.listParser.parseUnorderedList(lines, index) ||
      this.listParser.parseOrderedList(lines, index)
  }

  parseHeading1Block(line, index) 
  {
    if (!this.lineClassifier.isHeading1(line)) 
    {
      return null
    }

    return this.blockResult(
      { type: 'h1', text: line.slice(2).trim() },
      index + 1
    )
  }

  parseHeading2Block(line, index) 
  {
    if (!this.lineClassifier.isHeading2(line)) 
    {
      return null
    }

    return this.blockResult(
      { type: 'h2', text: line.slice(3).trim() },
      index + 1
    )
  }

  parseRuleBlock(line, index) 
  {
    if (!this.lineClassifier.isRule(line)) 
    {
      return null
    }

    return this.blockResult({ type: 'rule' }, index + 1)
  }

  parseEquationBlock(lines, index) 
  {
    const line = lines[index]

    if (!this.lineClassifier.startsEquation(line)) 
    {
      return null
    }

    const equationLines = [line.trim()]
    let nextIndex = index + 1

    while (
      !this.lineClassifier.endsEquation(equationLines[equationLines.length - 1]) &&
      nextIndex < lines.length
    )
    {
      equationLines.push(lines[nextIndex].trim())
      nextIndex += 1
    }

    return this.blockResult(
      { type: 'equation', text: equationLines.join('\n') },
      nextIndex
    )
  }

  parseParagraphBlock(lines, index) 
  {
    const paragraphLines = []
    let nextIndex = index

    while (
      nextIndex < lines.length &&
      !this.lineClassifier.isSpecialBlock(lines, nextIndex)
    ) 
    {
      paragraphLines.push(lines[nextIndex].trim())
      nextIndex += 1
    }

    return this.blockResult(
      { type: 'paragraph', text: paragraphLines.join(' ') },
      nextIndex
    )
  }
}

module.exports = MarkdownParser
