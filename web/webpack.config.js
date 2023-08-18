// Generated using webpack-cli https://github.com/webpack/webpack-cli

const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const WorkboxWebpackPlugin = require('workbox-webpack-plugin')
const webpack = require('webpack')

const isProduction = process.env.NODE_ENV == 'production'

const config = {
  devtool: 'eval-source-map',
  entry: './src/index.ts',
  output: {
    path: path.resolve(__dirname, 'dist')
  },
  devServer: {
    open: true,
    host: 'localhost'
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: 'index.html', // Your existing template
      chunks: ['main'], // Optional: Specify which chunk to include
      filename: 'index.html', // Output file name (if using a different name)
    }),
    new HtmlWebpackPlugin({
      template: 'connect.html', // Your connect.html template
      chunks: ['main'], // Optional: No chunks needed for this page
      filename: 'connect.html',
    }),
    new webpack.ProvidePlugin({
      Buffer: ['buffer', 'Buffer']
    })

    // Add your plugins here
    // Learn more about plugins from https://webpack.js.org/configuration/plugins/
  ],
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/i,
        loader: 'ts-loader',
        exclude: ['/node_modules/']
      },
      {
        test: /\.(eot|svg|ttf|woff|woff2|png|jpg|gif)$/i,
        type: 'asset'
      }

      // Add your rules for custom modules here
      // Learn more about loaders from https://webpack.js.org/loaders/
    ],
    noParse: [require.resolve('typescript/lib/typescript.js')]
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.jsx', '.js', '...']
  }
}

module.exports = () => {
  if (isProduction) {
    config.mode = 'production'

    config.plugins.push(new WorkboxWebpackPlugin.GenerateSW())
  } else {
    config.mode = 'development'
  }
  return config
}
