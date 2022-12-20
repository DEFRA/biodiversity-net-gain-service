/** @type {import('@slonik/migrator').Migration} */
exports.up = async ({ context: { connection, sql } }) => {
  let createRoleSql
  if (process.env.POSTGRES_BNG_USER_PASSWORD) {
    // Prepare to create a user in a non-Microsoft Azure Database for Postgres instance.
    const bngUserPassword = sql.literalValue([process.env.POSTGRES_BNG_USER_PASSWORD])
    createRoleSql = sql`CREATE ROLE bng_user WITH LOGIN PASSWORD ${bngUserPassword} IN ROLE bng_readwrite;`
  } else if (process.env.POSTGRES_BNG_CLIENT_ID) {
    // Prepare to create a managed identity based user in a Microsoft Azure Database for Postgres instance.
    // https://techcommunity.microsoft.com/t5/azure-database-for-postgresql/connect-from-function-app-with-managed-identity-to-azure/ba-p/1517032
    const bngClientId = sql.literalValue([process.env.POSTGRES_BNG_CLIENT_ID])
    createRoleSql = sql`
      -- Provide managed identity associated test coverage when running unit tests with a containerised
      -- Postgres instance.
      IF EXISTS (SELECT 1 FROM pg_settings WHERE name = 'aad_validate_oids_in_tenant') THEN
        SET aad_validate_oids_in_tenant = off;
      END IF;
      CREATE ROLE bng_user WITH LOGIN PASSWORD ${bngClientId} IN ROLE azure_ad_user, bng_readwrite;
    `
  }

  if (createRoleSql) {
    await connection.query(sql`
      DO
      $$
      BEGIN
        IF NOT EXISTS (SELECT 1 FROM pg_user WHERE usename = 'bng_user') THEN
          ${createRoleSql}
        END IF;
      END
      $$
    `)
  } else {
    throw new Error('POSTGRES_BNG_USER_PASSWORD or POSTGRES_BNG_CLIENT_ID must be specified to create the BNG database user')
  }
}

/** @type {import('@slonik/migrator').Migration} */
exports.down = async ({ context: { connection, sql } }) => {
  await connection.query(sql`drop user if exists bng_user`)
}
