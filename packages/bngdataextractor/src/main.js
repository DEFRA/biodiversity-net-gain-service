// import dotenv from "dotenv";
import { BlobServiceClient } from '@azure/storage-blob'
import BngExtractionService from './bng-metric-extraction-service.js'
import fs from 'fs'
import isEmpty from 'lodash/isEmpty.js'
class Main {
  static containerName
  static blobName
  static connectionString
  static blobServiceClient
  static containerClient

  constructor (blobName, connectionString, containerName) {
    // Create the BlobServiceClient object which will be used to create a container client
    this.containerName = containerName
    this.blobName = blobName
    this.connectionString = connectionString

    if (isEmpty(this.connectionString)) {
      throw new Error('Azure Storage Connection string not found')
    }

    this.blobServiceClient = BlobServiceClient.fromConnectionString(this.connectionString)
    this.containerClient = this.blobServiceClient.getContainerClient(this.containerName)
  }

  async downloadBlobToFile (fileNameWithPath) {
    const blobClient = this.containerClient.getBlobClient(this.blobName)

    await blobClient.downloadToFile(fileNameWithPath)
  }

  checkFileExists (filepath) {
    try {
      if (!fs.existsSync(filepath)) {
        fs.writeFileSync(filepath, '')
      }
      const stats = fs.statSync(filepath)
      const fileSize = stats.size
      return fileSize > 0
    } catch (error) {
      console.error('Err:', error)
    }
  }

  async getBlobData () {
    const path = process.cwd()
    const filepath = path + '/tmp/metric.xls'
    const tmpDir = path + '/tmp'
    if (!fs.existsSync(tmpDir)) {
      fs.mkdirSync(tmpDir)
    }
    await this.downloadBlobToFile(filepath)

    const extractService = new BngExtractionService()
    return await extractService.extractMetricContent(filepath)
  }
}

export default Main
