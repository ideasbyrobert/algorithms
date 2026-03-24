class MarkdownTableParser 
{
  constructor(lineClassifier) 
  {
    this.lineClassifier = lineClassifier
  }

  parse(lines, index) 
  {
    if (!this.lineClassifier.isTable(lines, index)) 
    {
      return null
    }

    const header = this.parseTableRow(lines[index])
    const rows = []
    let nextIndex = index + 2

    while (
      nextIndex < lines.length &&
      this.lineClassifier.startsTableRow(lines[nextIndex])
    ) 
    {
      rows.push(this.parseTableRow(lines[nextIndex]))
      nextIndex += 1
    }

    return {
      block: { type: 'table', header, rows },
      nextIndex
    }
  }

  parseTableRow(line) 
  {
    return line.trim().slice(1, -1).split('|').map((cell) => cell.trim())
  }
}

module.exports = MarkdownTableParser
