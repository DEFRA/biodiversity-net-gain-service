const fs = require('fs')
const { pipeline } = require('stream')
const { createGunzip } = require('zlib')
const { promisify } = require('util')
const pipe = promisify(pipeline)
const { createReadStream, createWriteStream } = require('fs')
const path = require('path')

const gunzipDataMigrations = async () => {
  const srcDirectoryPath = path.join(__dirname, '/')
  const dataMigrationsDirectoryPath = `${srcDirectoryPath}data-migrations/`
  const migrationsDirectoryPath = `${srcDirectoryPath}migrations/`

  // Ensure that non-gzipped files in the data-migrations directory are ignored.
  const dataMigrationFiles = fs.readdirSync(dataMigrationsDirectoryPath).filter(f => f.endsWith('.gz'))
  const promises = []
  dataMigrationFiles.forEach(dataMigrationFile => {
    const inputFilePath = `${dataMigrationsDirectoryPath}${dataMigrationFile}`
    const outputFilePath = `${migrationsDirectoryPath}${dataMigrationFile.substring(0, dataMigrationFile.length - 3)}`

    if (!fs.existsSync(outputFilePath)) {
      promises.push(gunzipDataMigration(`${inputFilePath}`, `${outputFilePath}`))
    }
  })
  return Promise.all(promises)
}

const gunzipDataMigration = async (inputFilePath, outputFilePath) => {
  const gunzip = createGunzip()
  const source = createReadStream(inputFilePath)
  const destination = createWriteStream(outputFilePath)
  return pipe(source, gunzip, destination)
}

(
  async () => { await gunzipDataMigrations() }
)()
