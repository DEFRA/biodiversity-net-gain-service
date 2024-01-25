// General file to test out authenticated routes
import { submitGetRequest } from '../helpers/server.js'

describe('Route authentication', () => {
  it('Should render a non protected route without authentication', async () => {
    const options = {
      url: '/credits-estimation/credits-tier',
      auth: false
    }
    await submitGetRequest(options)
  })

  it('Should redirect to signin route if hitting a protected route without authentication', async () => {
    const options = {
      url: '/land/upload-metric',
      auth: false
    }
    const response = await submitGetRequest(options, 302)
    expect(response.headers.location).toEqual('/signin?next=%2Fland%2Fupload-metric')
  })

  it('Should render protected page with Signin nav if authenticated', async () => {
    const options = {
      url: '/land/upload-metric'
    }
    const response = await submitGetRequest(options)
    expect(response.payload).toContain(`<ul class="login-nav__list">
    <li class="login-nav__list-item">John Smith |</li>`)
    expect(response.payload).toContain('<li class="login-nav__list-item"><a id="link-manage-account" href="/manage-biodiversity-gains" class="govuk-link login-nav__link govuk-link--no-visited-state">Manage biodiversity gains</a> |</li>')
    expect(response.payload).toContain(`<li class="login-nav__list-item"><a id="link-sign-out" href="/signout" class="govuk-link login-nav__link govuk-link--no-visited-state">Sign out</a></li>
  </ul>`)
  })
})
