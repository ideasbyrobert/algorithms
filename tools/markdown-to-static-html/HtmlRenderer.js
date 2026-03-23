class HtmlRenderer {
  constructor(htmlEscaper, inlineFormatter) {
    this.htmlEscaper = htmlEscaper;
    this.inlineFormatter = inlineFormatter;
  }

  render(blocks) {
    return blocks.map((block) => this.renderBlock(block)).join('\n');
  }

  renderBlock(block) {
    if (block.type === 'h1') {
      return '<h1>' + this.inlineFormatter.format(block.text) + '</h1>';
    }

    if (block.type === 'h2') {
      return '<h2>' + this.inlineFormatter.format(block.text) + '</h2>';
    }

    if (block.type === 'paragraph') {
      return '<p>' + this.inlineFormatter.format(block.text) + '</p>';
    }

    if (block.type === 'equation') {
      return '<div class="equation">' + this.htmlEscaper.escape(block.text) + '</div>';
    }

    if (block.type === 'rule') {
      return '<hr />';
    }

    if (block.type === 'unordered-list') {
      return '<ul>' + block.items.map((item) => '<li>' + this.render(item) + '</li>').join('') + '</ul>';
    }

    if (block.type === 'ordered-list') {
      return '<ol>' + block.items.map((item) => '<li>' + this.render(item) + '</li>').join('') + '</ol>';
    }

    if (block.type === 'table') {
      const head = '<thead><tr>' + block.header.map((cell) => '<th>' + this.inlineFormatter.format(cell) + '</th>').join('') + '</tr></thead>';
      const body = '<tbody>' + block.rows.map((row) => '<tr>' + row.map((cell) => '<td>' + this.inlineFormatter.format(cell) + '</td>').join('') + '</tr>').join('') + '</tbody>';
      return '<div class="table-wrap"><table>' + head + body + '</table></div>';
    }

    return '';
  }
}

module.exports = HtmlRenderer;
