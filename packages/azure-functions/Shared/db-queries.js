const createApplicationReference = (db) => {
  return db.query('select bng_user.fn_create_application_reference();')
}

export {
  createApplicationReference
}
