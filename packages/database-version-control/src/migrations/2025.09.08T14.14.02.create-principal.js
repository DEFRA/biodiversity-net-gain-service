/** @type {import('@slonik/migrator').Migration} */
exports.up = async ({ context: { connection, sql } }) => {
  const result = await connection.query(sql`select * from pgaadauth_create_principal('TSTBNGWEBFA4401', false, false);`)
  console.log(result)
}

/** @type {import('@slonik/migrator').Migration} */
exports.down = async ({ context: { connection, sql } }) => { }
