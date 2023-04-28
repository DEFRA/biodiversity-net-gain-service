const removeBtns = document.querySelectorAll('.custom-remove-btn')

const removeEmailElement = e => {
  if (e.target.classList.contains('custom-remove-btn')) {
    e.target.closest('.govuk-fieldset').remove()
  }
}

removeBtns.forEach(btn => {
  btn.addEventListener('click', removeEmailElement)
})
