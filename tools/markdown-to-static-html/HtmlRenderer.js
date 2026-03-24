class HtmlRenderer 
{
  constructor(htmlEscaper, inlineFormatter) 
  {
    this.htmlEscaper = htmlEscaper
    this.inlineFormatter = inlineFormatter
  }

  render(blocks) 
  {
    return blocks.map((block) => this.renderBlock(block)).join('\n')
  }

  renderBlock(block) 
  {
    if (block.type === 'h1') 
    {
      return '<h1>' + this.inlineFormatter.format(block.text) + '</h1>'
    }

    if (block.type === 'h2') 
    {
      return '<h2>' + this.inlineFormatter.format(block.text) + '</h2>'
    }

    if (block.type === 'paragraph') 
    {
      return '<p>' + this.inlineFormatter.format(block.text) + '</p>'
    }

    if (block.type === 'equation') 
    {
      return '<div class="equation">' + this.htmlEscaper.escape(block.text) + '</div>'
    }

    if (block.type === 'rule') 
    {
      return '<hr />'
    }

    if (block.type === 'unordered-list') 
    {
      const items = block.items
        .map((item) => '<li>' + this.render(item) + '</li>')
        .join('')

      return '<ul>' + items + '</ul>'
    }

    if (block.type === 'ordered-list') 
    {
      const items = block.items
        .map((item) => '<li>' + this.render(item) + '</li>')
        .join('')

      return '<ol>' + items + '</ol>'
    }

    if (block.type === 'table') 
    {
      const headCells = block.header
        .map((cell) => '<th>' + this.inlineFormatter.format(cell) + '</th>')
        .join('')
      const bodyRows = block.rows
        .map((row) => 
        {
          const cells = row
            .map((cell) => '<td>' + this.inlineFormatter.format(cell) + '</td>')
            .join('')

          return '<tr>' + cells + '</tr>'
        })
        .join('')
      const head = '<thead><tr>' + headCells + '</tr></thead>'
      const body = '<tbody>' + bodyRows + '</tbody>'

      return '<div class="table-wrap"><table>' + head + body + '</table></div>'
    }

    return ''
  }
}

module.exports = HtmlRenderer
