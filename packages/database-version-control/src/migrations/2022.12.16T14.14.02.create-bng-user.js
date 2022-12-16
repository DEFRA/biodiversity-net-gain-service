/** @type {import('@slonik/migrator').Migration} */
exports.up = async ({ context: { connection, sql } }) => {
  let createRoleSql
  if (process.env.BNG_USER_PASSWORD) {
    // Prepare to create a user in a non-Microsoft Azure Database for Postgres instance.
    const bngUserPassword = sql.literalValue([process.env.BNG_USER_PASSWORD])
    createRoleSql = sql`CREATE ROLE bng_user WITH LOGIN PASSWORD ${bngUserPassword} IN ROLE bng_readwrite;`
  } else if (process.env.BNG_CLIENT_ID) {
    // Prepare to create a managed identity based user in a Microsoft Azure Database for Postgres instance.
    // https://techcommunity.microsoft.com/t5/azure-database-for-postgresql/connect-from-function-app-with-managed-identity-to-azure/ba-p/1517032
    const bngClientId = sql.literalValue([process.env.BNG_CLIENT_ID])
    createRoleSql = sql`
      SET aad_validate_oids_in_tenant = off;
      CREATE ROLE bng_user WITH LOGIN PASSWORD ${bngClientId} IN ROLE azure_ad_user, bng_readwrite;
    `
  }

  if (createRoleSql) {
    await connection.query(sql`
      DO
      $$
      BEGIN
        IF NOT EXISTS (SELECT * FROM pg_user WHERE usename = 'bng_user') THEN
          ${createRoleSql}
        END IF;
      END
      $$
    `)
  } else {
    throw new Error('BNG_USER_PASSWORD or BNG_CLIENT_ID must be specified to create the BNG database user')
  }
}

/** @type {import('@slonik/migrator').Migration} */
exports.down = async ({ context: { connection, sql } }) => {
  await connection.query(sql`drop user if exists bng_user`)
}
