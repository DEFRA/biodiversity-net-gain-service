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
    addPlanningAuthority: './client/js/pages/land/add-planning-authority.js',
    emailEntry: './client/js/pages/developer/email-entry.js'
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
