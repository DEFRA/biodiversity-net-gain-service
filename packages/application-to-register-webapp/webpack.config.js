import { fileURLToPath } from 'url'
import path from 'path'
import HtmlPlugin from 'html-webpack-plugin'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const env = process.env.NODE_ENV
const inDev = env === 'dev' || env === 'development'

export default {
  entry: {
    confirmLandBoundary: './client/js/pages/land/confirm-land-boundary.js'
  },
  output: {
    path: path.resolve(__dirname, 'public/build/js'),
    library: '[name]'
  },
  mode: 'development',
  devtool: 'source-map',
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
      filename: '../views/land/confirm-land-boundary.html',
      template: 'src/views/webpack/land/confirm-land-boundary.html',
      chunks: ['confirmLandBoundary']
    })
  ]
}
