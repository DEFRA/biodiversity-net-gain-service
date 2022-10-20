/* global $ */
$(document).ready(function () {
  if (window.location.pathname === '/land/add-legal-agreement-parties') {
    $('.govuk-body').bind('DOMSubtreeModified', function () {
      const count = $('.govuk-grid-row').find('.moj-add-another__item').length
      const errorContainer = $('.govuk-grid-row').find('.moj-add-another__item')[count - 1]
      if (count > 1 && $(errorContainer).find('div').hasClass('govuk-form-group--error')) {
        $(errorContainer).find('div').removeClass('govuk-form-group--error')
        $(errorContainer).find('div').find('p').removeClass('govuk-error-message')
        $(errorContainer).find('div').find('input').removeClass('govuk-input--error')
      }

      $('.govuk-radios__item').click((event) => {
        if ($(event.target.parentNode).next('div').hasClass('govuk-radios__conditional--hidden')) {
          $(event.target.parentNode).next('div').removeClass('govuk-radios__conditional--hidden')
          $(event.target.parentNode).next('div').find('input').val('')
        } else {
          $(event.target.parentNode).parent().show().find('.govuk-radios__conditional').addClass('govuk-radios__conditional--hidden')
        }
      })
    })
  }
})
