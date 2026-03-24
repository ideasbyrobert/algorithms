class InlineFormatter 
{
  constructor(htmlEscaper) 
  {
    this.htmlEscaper = htmlEscaper
  }

  format(value) 
  {
    const mathTokens = []
    let text = value.replace(/\$[^\$]+\$/g, (match) => 
    {
      const token = '__MATH_' + mathTokens.length + '__'
      mathTokens.push(match)
      return token
    })

    text = this.htmlEscaper.escape(text)
    text = text.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    text = text.replace(/\*(.+?)\*/g, '<em>$1</em>')

    mathTokens.forEach((match, index) => 
    {
      const token = '__MATH_' + index + '__'
      const replacement =
        '<span class="inline-math">' +
        this.htmlEscaper.escape(match) +
        '</span>'

      text = text.split(token).join(replacement)
    })

    return text
  }
}

module.exports = InlineFormatter
