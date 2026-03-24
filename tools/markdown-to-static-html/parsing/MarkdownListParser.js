class MarkdownListParser 
{
  constructor(lineClassifier, parseBlocks) 
  {
    this.lineClassifier = lineClassifier
    this.parseBlocks = parseBlocks
  }

  parseUnorderedList(lines, index) 
  {
    if (!this.lineClassifier.isUnorderedItem(lines[index])) 
    {
      return null
    }

    const items = []
    let nextIndex = index

    while (
      nextIndex < lines.length &&
      this.lineClassifier.isUnorderedItem(lines[nextIndex])
    ) 
    {
      items.push(this.parseUnorderedListItem(lines[nextIndex]))
      nextIndex += 1
    }

    return {
      block: { type: 'unordered-list', items },
      nextIndex
    }
  }

  parseUnorderedListItem(line) 
  {
    return [{ type: 'paragraph', text: line.trim().slice(2).trim() }]
  }

  parseOrderedList(lines, index) 
  {
    if (!this.lineClassifier.isOrderedItem(lines[index])) 
    {
      return null
    }

    const items = []
    let nextIndex = index

    while (
      nextIndex < lines.length &&
      this.lineClassifier.isOrderedItem(lines[nextIndex])
    ) 
    {
      const item = this.parseOrderedListItem(lines, nextIndex)

      items.push(this.parseBlocks(item.lines))
      nextIndex = item.nextIndex
    }

    return {
      block: { type: 'ordered-list', items },
      nextIndex
    }
  }

  parseOrderedListItem(lines, index) 
  {
    const itemLines = [this.stripOrderedItemMarker(lines[index])]
    let nextIndex = index + 1

    while (nextIndex < lines.length) 
    {
      const line = lines[nextIndex]

      if (this.lineClassifier.isOrderedItem(line)) 
      {
        break
      }

      if (this.lineClassifier.isBlank(line)) 
      {
        itemLines.push('')
        nextIndex += 1
        continue
      }

      if (this.isIndentedContinuation(line)) 
      {
        itemLines.push(this.unindent(line))
        nextIndex += 1
        continue
      }

      break
    }

    return {
      lines: this.removeTrailingBlankLines(itemLines),
      nextIndex
    }
  }

  stripOrderedItemMarker(line) 
  {
    return line.trim().replace(/^\d+\.\s/, '')
  }

  isIndentedContinuation(line) 
  {
    return /^\s{2,}\S/.test(line)
  }

  unindent(line) 
  {
    return line.replace(/^\s+/, '')
  }

  removeTrailingBlankLines(lines) 
  {
    const trimmedLines = lines.slice()

    while (
      trimmedLines.length > 0 &&
      this.lineClassifier.isBlank(trimmedLines[trimmedLines.length - 1])
    ) 
    {
      trimmedLines.pop()
    }

    return trimmedLines
  }
}

module.exports = MarkdownListParser
