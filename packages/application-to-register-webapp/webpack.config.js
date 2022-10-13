import { fileURLToPath } from 'url'
import path from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const env = process.env.NODE_ENV
const inDev = env === 'dev' || env === 'development'

export default {
  entry: {
    // confirmLandBoundary: './client/js/pages/land/confirm-land-boundary.js',
    core: './client/js/core.js',
    addLandowners: './client/js/pages/land/add-landowners.js'
  },
  output: {
    path: path.resolve(__dirname, 'public/build/js'),
    library: '[name]'
  },
  mode: !inDev ? 'production' : 'development',
  devtool: !inDev ? false : 'source-map',
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      },
      {
        test: /\.m?js/,
        resolve: {
          fullySpecified: false
        }
      }
    ]
  }
}
