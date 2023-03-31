import { fileURLToPath } from 'url'
import path from 'path'
import webpack from 'webpack'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const env = process.env.NODE_ENV
const inDev = env === 'dev' || env === 'development'

export default {
  entry: {
    core: './client/js/core.js',
    addLandowners: './client/js/pages/land/add-landowners.js',
    addLegalAgreementParties: './client/js/pages/land/add-legal-agreement-parties.js',
    checkAndSubmit: './client/js/pages/land/check-and-submit.js',
    checkLandBoundaryDetails: './client/js/pages/land/check-land-boundary-details.js'
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
  },
  plugins: [
    new webpack.EnvironmentPlugin({
      GOOGLE_TAGMANAGER_ID: '' // use '' unless process.env.GOOGLE_TAGMANAGER_ID is defined
    })
  ]
}
