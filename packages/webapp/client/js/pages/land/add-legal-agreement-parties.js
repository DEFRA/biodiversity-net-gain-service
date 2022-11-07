/* global $ */
$(document).ready(function (event) {
  function prepareOtherText (event, newItemContainer) {
    if ($(event.target.parentNode).next('div').hasClass('govuk-radios__conditional--hidden')) {
      $(event.target.parentNode).next('div').removeClass('govuk-radios__conditional--hidden')
      newItemContainer.find('.govuk-form-group').find('.govuk-radios__conditional').show()
      $(event.target.parentNode).next('div').find('input').val('')
    } else {
      $(event.target.parentNode).parent().show().find('.govuk-radios__conditional').addClass('govuk-radios__conditional--hidden')
      $(event.target.parentNode).parent().show().find('.govuk-radios__conditional').removeAttr('style')
    }
  }

  if (window.location.pathname === '/land/add-legal-agreement-parties') {
    $('.govuk-body').bind('DOMSubtreeModified', function (event) {
      const count = $('.govuk-grid-row').find('.moj-add-another__item').length
      const newItemContainer = $('.govuk-grid-row').find('.moj-add-another__item')[count - 1]
      if (count > 1) {
        if ($(newItemContainer).find('div').hasClass('govuk-form-group--error') && $(event.target).attr('id') === 'moj-add-another-component') {
          $(newItemContainer).find('div').removeClass('govuk-form-group--error')
          $(newItemContainer).find('div').find('p').removeClass('govuk-error-message')
          $(newItemContainer).find('div').find('input').removeClass('govuk-input--error')
        }
        $('.govuk-grid-row').find('.moj-add-another__item').last().find('.govuk-form-group').find('p').addClass('govuk-visually-hidden')
        $(newItemContainer).find('.govuk-radios__conditional').find('input').val('')
        $(newItemContainer).find('.govuk-radios__item').last().removeClass('govuk-radios__conditional--hidden')
        $('.govuk-grid-row').find('.moj-add-another__item').find('.govuk-radios__conditional').last().addClass('govuk-radios__conditional--hidden')
        $('.moj-add-another__remove-button').each(function (index, element) {
          $(element).attr('id', 'remove' + index)
        })
      }

      $('.govuk-radios__item').click((event) => {
        prepareOtherText(event, $(newItemContainer))
      })
    })
  }
})
