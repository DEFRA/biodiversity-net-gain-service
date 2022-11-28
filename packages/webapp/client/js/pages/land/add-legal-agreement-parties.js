/* global $ */
$(document).ready(function (event) {
  if (window.location.pathname === '/land/add-legal-agreement-parties') {
    $('.govuk-body').bind('DOMSubtreeModified', function (event) {
      const count = $('.govuk-grid-row').find('.moj-add-another__item').length
      const newItemContainer = $('.govuk-grid-row').find('.moj-add-another__item')[count - 1]
      if ($(event.target).attr('id').indexOf('role') < 0) {
        if (count > 1) {
          if ($(newItemContainer).find('div').hasClass('govuk-form-group--error') && $(event.target).attr('id') === 'moj-add-another-component') {
            $(newItemContainer).find('div').removeClass('govuk-form-group--error')
            $(newItemContainer).find('div').find('p').removeClass('govuk-error-message')
            $(newItemContainer).find('div').find('input').removeClass('govuk-input--error')
          }
          $('.govuk-grid-row').find('.moj-add-another__item').last().find('.govuk-form-group').find('p').addClass('govuk-visually-hidden')
          $(newItemContainer).find('.govuk-radios__conditional').find('input').val('')
          $(newItemContainer).find('.govuk-radios__item').last().removeAttr('style')
          $('.govuk-grid-row').find('.moj-add-another__item').find('.govuk-radios__conditional').last().addClass('govuk-radios__conditional--hidden')
          $('.govuk-grid-row').find('.moj-add-another__item').find('.govuk-radios__conditional').last().removeAttr('style')
          $('.moj-add-another__remove-button').each(function (index, element) {
            $(element).attr('id', 'remove' + index)
          })
        }
      }
      $('.govuk-radios__input').toArray().forEach(el => {
        if ($(el).attr('id').startsWith('other')) {
          $(el).click((event) => {
            $(el).parent().parent().children().last().find('input').val('')
            $(el).parent().parent().children().last().show()
          })
        } else {
          $(el).click((event) => {
            $(el).parent().parent().children().last().hide()
          })
        }
      })
    })
  }
  $('.govuk-body').trigger('DOMSubtreeModified')
})
