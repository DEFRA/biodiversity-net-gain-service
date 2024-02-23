/* global $ */
import accessibleAutocomplete from 'accessible-autocomplete'
window.onload = function () {
  accessibleAutocomplete.enhanceSelectElement({
    selectElement: document.querySelector('#nationality1'),
    name: 'nationality1',
    classes: 'govuk-!-width-two-thirds',
    defaultValue: '',
    onConfirm: () => {
      const nationality1 = $('#nationality1 > option').filter(function () {
        return this.text === $('#nationality1').val()
      }).val()
      $('#nationality1').val(nationality1)
    }
  })
}
