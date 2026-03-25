class MarkdownLineClassifier 
{
  normalizeLines(markdown) 
  {
    return markdown.replace(/\r\n/g, '\n').split('\n')
  }

  isBlank(line) 
  {
    return line.trim() === ''
  }

  isHeading1(line) 
  {
    return line.startsWith('# ')
  }

  isHeading2(line) 
  {
    return line.startsWith('## ')
  }

  isRule(line) 
  {
    return line.trim() === '***'
  }

  startsEquation(line) 
  {
    return line.trim().startsWith('$$')
  }

  endsEquation(line) 
  {
    return line.trim().endsWith('$$')
  }

  isEquation(line) 
  {
    return this.startsEquation(line) && this.endsEquation(line)
  }

  startsTableRow(line) 
  {
    return line.trim().startsWith('|')
  }

  isTableSeparator(line) 
  {
    return /^\|(?:\s*:?-{3,}:?\s*\|)+\s*$/.test(line.trim())
  }

  isTable(lines, index) 
  {
    return index >= 0 &&
      index + 1 < lines.length &&
      this.startsTableRow(lines[index]) &&
      this.isTableSeparator(lines[index + 1])
  }

  isUnorderedItem(line) 
  {
    return /^[-*]\s/.test(line.trim())
  }

  isOrderedItem(line) 
  {
    return /^\d+\.\s/.test(line.trim())
  }

  isSpecialBlock(lines, index) 
  {
    if (index >= lines.length) 
    {
      return false
    }

    const line = lines[index]

    return this.isBlank(line) ||
      this.isHeading1(line) ||
      this.isHeading2(line) ||
      this.isRule(line) ||
      this.startsEquation(line) ||
      this.isTable(lines, index) ||
      this.isUnorderedItem(line) ||
      this.isOrderedItem(line)
  }
}

module.exports = MarkdownLineClassifier
