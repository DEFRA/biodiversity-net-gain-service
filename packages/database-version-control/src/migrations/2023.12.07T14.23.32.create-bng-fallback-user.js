/** @type {import('@slonik/migrator').Migration} */
exports.up = async ({ context: { connection, sql } }) => {
  if (process.env.POSTGRES_BNG_FALLBACK_USER_PASSWORD) {
    const bngFallbackUserPassword = sql.literalValue([process.env.POSTGRES_BNG_FALLBACK_USER_PASSWORD])
    await connection.query(sql`CREATE ROLE bng_fallback_user WITH LOGIN PASSWORD ${bngFallbackUserPassword} IN ROLE bng_readwrite;`)
  } else {
    console.warn('Skipping creation of fallback user as POSTGRES_BNG_FALLBACK_USER_PASSWORD has not been specified')
  }
}

/** @type {import('@slonik/migrator').Migration} */
exports.down = async ({ context: { connection, sql } }) => {
  await connection.query(sql`drop user if exists bng_fallback_user;`)
}
