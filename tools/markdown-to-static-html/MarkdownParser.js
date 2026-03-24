class MarkdownParser 
{
  parse(markdown) 
  {
    return this.parseBlocks(markdown.replace(/\r\n/g, '\n').split('\n'))
  }

  parseBlocks(lines) 
  {
    const blocks = []
    let index = 0

    while (index < lines.length) 
    {
      if (this.isBlank(lines[index])) 
      {
        index += 1
        continue
      }

      if (this.isHeading1(lines[index])) 
      {
        blocks.push({ type: 'h1', text: lines[index].slice(2).trim() })
        index += 1
        continue
      }

      if (this.isHeading2(lines[index])) 
      {
        blocks.push({ type: 'h2', text: lines[index].slice(3).trim() })
        index += 1
        continue
      }

      if (this.isRule(lines[index])) 
      {
        blocks.push({ type: 'rule' })
        index += 1
        continue
      }

      if (this.isEquation(lines[index])) 
      {
        blocks.push({ type: 'equation', text: lines[index].trim() })
        index += 1
        continue
      }

      if (this.isTable(lines, index)) 
      {
        const header = this.parseTableRow(lines[index])
        index += 2
        const rows = []

        while (index < lines.length && lines[index].trim().startsWith('|')) 
        {
          rows.push(this.parseTableRow(lines[index]))
          index += 1
        }

        blocks.push({ type: 'table', header, rows })
        continue
      }

      if (this.isUnorderedItem(lines[index])) 
      {
        const items = []

        while (index < lines.length && this.isUnorderedItem(lines[index])) 
        {
          items.push([{ type: 'paragraph', text: lines[index].trim().slice(2).trim() }])
          index += 1
        }

        blocks.push({ type: 'unordered-list', items })
        continue
      }

      if (this.isOrderedItem(lines[index])) 
      {
        const items = []

        while (index < lines.length && this.isOrderedItem(lines[index])) 
        {
          const itemLines = [lines[index].trim().replace(/^\d+\.\s/, '')]
          index += 1

          while (index < lines.length) 
          {
            if (this.isOrderedItem(lines[index])) 
            {
              break
            }

            if (this.isBlank(lines[index])) 
            {
              itemLines.push('')
              index += 1
              continue
            }

            if (/^\s{2,}\S/.test(lines[index])) 
            {
              itemLines.push(lines[index].replace(/^\s+/, ''))
              index += 1
              continue
            }

            break
          }

          while (itemLines.length > 0 && itemLines[itemLines.length - 1] === '') 
          {
            itemLines.pop()
          }

          items.push(this.parseBlocks(itemLines))
        }

        blocks.push({ type: 'ordered-list', items })
        continue
      }

      const paragraphLines = []

      while (index < lines.length && !this.isSpecialBlock(lines, index)) 
      {
        paragraphLines.push(lines[index].trim())
        index += 1
      }

      blocks.push({ type: 'paragraph', text: paragraphLines.join(' ') })
    }

    return blocks
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

  isEquation(line) 
  {
    const trimmed = line.trim()
    return trimmed.startsWith('$$') && trimmed.endsWith('$$')
  }

  isTable(lines, index) 
  {
    return lines[index].trim().startsWith('|') &&
      index + 1 < lines.length &&
      /^\|(?:\s*:?-{3,}:?\s*\|)+\s*$/.test(lines[index + 1].trim())
  }

  isUnorderedItem(line) 
  {
    return line.trim().startsWith('* ')
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
      this.isEquation(line) ||
      this.isTable(lines, index) ||
      this.isUnorderedItem(line) ||
      this.isOrderedItem(line)
  }

  parseTableRow(line) 
  {
    return line.trim().slice(1, -1).split('|').map((cell) => cell.trim())
  }
}

module.exports = MarkdownParser
