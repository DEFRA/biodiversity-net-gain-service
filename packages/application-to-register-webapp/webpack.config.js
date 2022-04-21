import { fileURLToPath } from 'url'
import path from 'path'
import HtmlPlugin from 'html-webpack-plugin'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const env = process.env.NODE_ENV
const inDev = env === 'dev' || env === 'development'

export default {
  entry: {
    confirmGeospatialLandBoundary: './src/client/js/pages/confirm-geospatial-land-boundary.js'
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
    new HtmlPlugin({
      inject: false,
      filename: '../views/confirm-geospatial-land-boundary.html',
      template: 'src/views/webpack/confirm-geospatial-land-boundary.html',
      chunks: ['confirmGeospatialLandBoundary']
    })
  ]
}
