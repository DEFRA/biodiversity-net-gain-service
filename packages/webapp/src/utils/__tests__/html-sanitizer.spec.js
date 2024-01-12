import { htmlSanitizer, isXSSVulnerable } from '../html-sanitizer.js'

describe('HTML Sanitizer', () => {
  it('Should sanitize html from string to prevent XSS vulnerability', () => {
    const clean = htmlSanitizer('<a onmouseover=`alert(document.cookie)`>resillion.doc')
    expect(clean).toEqual('resillion.doc')
  })

  it('Should return true when XSS vulnerability is found', () => {
    const xssVelnerable = isXSSVulnerable('<a onmouseover=`alert(document.cookie)`>resillion.doc')
    expect(xssVelnerable).toBeTruthy()
  })
})
