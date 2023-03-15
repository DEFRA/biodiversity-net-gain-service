window.dataLayer = window.dataLayer || []
const userPreferenceCookie = document.cookie.match(new RegExp('(^| )' + 'set_cookie_usage=' + '([^;]+)'))
if (userPreferenceCookie) {
  const cookiePreferences = JSON.parse(decodeURIComponent(userPreferenceCookie[2]))
  window.dataLayer.push({ event: 'Cookie Preferences', cookiePreferences })
}
