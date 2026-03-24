const path = require('path')
const { execFileSync } = require('child_process')
const { fixturePath } = require('../support/hIndexFixture')

const projectRoot = path.resolve(__dirname, '../../../..')
const cliPath = path.resolve(__dirname, '../../generate.js')

describe('generate.js with the h-index proof', () =>
{
  test('prints the generated page for a nested output path', () =>
  {
    const outputPath = path.join(projectRoot, 'docs', 'proofs', '274-hindex.html')
    const html = execFileSync(process.execPath, [cliPath, fixturePath, outputPath], {
      cwd: projectRoot,
      encoding: 'utf8'
    })

    expect(html).toContain('<!DOCTYPE html>')
    expect(html).toContain('../../assets/styles/document-page.css')
    expect(html).toContain('<div class="equation">')
    expect(html).toContain('<ul>')
    expect(html).toContain('<ol>')
    expect(html).toContain('<div class="table-wrap"><table>')
  })
})
