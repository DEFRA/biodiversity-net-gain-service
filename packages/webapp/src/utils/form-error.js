export class FormError extends Error {
  constructor (message, { text, href }) {
    super(message)
    this.text = text
    this.href = href
  }
}
