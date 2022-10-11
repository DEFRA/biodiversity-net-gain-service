$(document).ready(function () {
  if (window.location.pathname === '/land/add-legal-agreement-parties') {
    $('.govuk-body').bind('DOMSubtreeModified', function () {
      $('.govuk-radios__item').click((event) => {
        if ($(event.target.parentNode).next('div').hasClass('govuk-radios__conditional--hidden')) {
          $(event.target.parentNode).next('div').removeClass('govuk-radios__conditional--hidden')
        } else {
          $(event.target.parentNode).parent().show().find('.govuk-radios__conditional').addClass('govuk-radios__conditional--hidden')
        }
      })
    })
  }
})
