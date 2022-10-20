/* global $ */
if (window.location.pathname === '/land/add-legal-agreement-parties') {
  $('.govuk-body').bind('DOMSubtreeModified', function () {
    const count = $('.govuk-grid-row').find('.moj-add-another__item').length
    const errorContainer = $('.govuk-grid-row').find('.moj-add-another__item')[count - 1]
    if (count > 1 && $(errorContainer).find('div').hasClass('govuk-form-group--error')) {
      $(errorContainer).find('div').removeClass('govuk-form-group--error')
      $(errorContainer).find('div').find('p').removeClass('govuk-error-message')
      $('.govuk-grid-row').find('.moj-add-another__item').last().find('.govuk-form-group').find('p').addClass('govuk-visually-hidden')
      $(errorContainer).find('div').find('input').removeClass('govuk-input--error')
      $(errorContainer).find('.govuk-radios__item').last().removeClass('govuk-radios__conditional--hidden')
      $('.govuk-grid-row').find('.moj-add-another__item').find('.govuk-radios__conditional').last().addClass('govuk-radios__conditional--hidden')
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
