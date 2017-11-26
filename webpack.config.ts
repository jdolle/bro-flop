/**
 * Configure webpack build process
 */

import * as CleanWebpackPlugin from 'clean-webpack-plugin'
import * as CopyWebpackPlugin from 'copy-webpack-plugin'
import * as Dotenv from 'dotenv-webpack'
import * as path from 'path'
import * as webpack from 'webpack'
import * as UglifyJSPlugin from 'uglifyjs-webpack-plugin'

const outputPath: string = path.resolve(__dirname, 'www')

const config: webpack.Configuration = {
  devtool: 'inline-source-map',
  entry: {
    index: ['./src/index.ts'],
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
  output: {
    filename: '[name].bundle.js',
    publicPath: '/',
    path: outputPath,
  },
  module: {
    rules: [
      {
        test: /\.(ts|js)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            cacheDirectory: 'babel_cache',
          },
        },
      },
    ],
  },
  plugins: [
    new CleanWebpackPlugin([outputPath]),
    new CopyWebpackPlugin([
      { from: 'src/index.html.sample', to: 'index.html' },
      { from: 'src/config.xml.sample', to: 'config.xml' },
      { from: 'src/res', to: 'res' },
    ]),
    new Dotenv(),
    new webpack.NoEmitOnErrorsPlugin(),
  ],
}

if (process.env.NODE_ENV === 'production') {
  (config.plugins as webpack.Plugin[]).push(
    new UglifyJSPlugin({
      uglifyOptions: {
        compress: false,
        output: {
          comments: false,
          ascii_only: true,
          beautify: false,
        },
      },
      parallel: true,
      cache: 'uglify_cache',
    }),
  )
}

// tslint:disable-next-line no-default-export
export default config
