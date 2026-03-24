const createToolchain = require('../support/createToolchain')

const { inlineFormatter } = createToolchain()

describe('InlineFormatter with strict inequality inline math', () =>
{
  test(
    'renders inline math containing less-than signs without leaking placeholders',
    () =>
    {
      const html = inlineFormatter.format(
        'Equal values satisfy $\\le$ but not $<$, so they may refresh.'
      )

      expect(html).toContain('<span class="inline-math">$\\le$</span>')
      expect(html).toContain('<span class="inline-math">$&lt;$</span>')
      expect(html).not.toContain('__MATH_')
    }
  )
})
