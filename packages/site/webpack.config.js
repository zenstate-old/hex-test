/* eslint-disable global-require */
const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');

const { ASSET_DIR, OUTPUT_DIR, SITE_TITLE } = require('../../config');

module.exports = [{
  name: 'hex-frontend-task-client',
  mode: 'production',
  entry: {
    'hex-frontend-task-client': './src/client/index.jsx',
  },
  output: {
    filename: '[name].[contenthash].js',
    chunkFilename: '[name].[contenthash].js',
    path: path.resolve(__dirname, OUTPUT_DIR, ASSET_DIR),
    crossOriginLoading: 'anonymous',
  },
  module: {
    rules: [
      {
        test: /\.(jsx|js)$/,
        exclude: [
          path.join(__dirname, 'node_modules'),
        ],
        loader: 'babel-loader',
      },
      {
        test: /\.hbs$/,
        loader: 'handlebars-loader',
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/,
        include: [
          path.join(__dirname, 'node_modules'),
        ],
        use: [{
          loader: 'file-loader',
          options: {
            name: 'img/[name].[ext]',
          },
        }],
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/,
        exclude: [
          path.join(__dirname, 'node_modules'),
        ],
        use: [{
          loader: 'file-loader',
          options: {
            name: 'img/[name]-[hash].[ext]',
          },
        }, {
          loader: 'img-loader',
          options: {
            plugins: [
              require('imagemin-gifsicle')({
                interlaced: false,
              }),
              require('imagemin-mozjpeg')({
                progressive: true,
                arithmetic: false,
              }),
              require('imagemin-pngquant')({
                floyd: 0.5,
                speed: 2,
              }),
              require('imagemin-svgo')({
                plugins: [
                  { removeTitle: true },
                  { convertPathData: false },
                ],
              }),
            ],
          },
        }],
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/,
        use: {
          loader: 'file-loader',
          options: {
            name: `${ASSET_DIR}/fonts/[name].[ext]`,
          },
        },
      },
      {
        test: /\.(sc|sa|c)ss$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader'],
        exclude: path.resolve(__dirname, 'src/client/components'),
      },
      {
        test: /\.(sc|sa|c)ss$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              modules: {
                localIdentName: '[name]__[local]___[hash:base64:5]',
              },
              importLoaders: 1,
            },
          },
          {
            loader: 'postcss-loader',
          },
          {
            loader: 'sass-loader',
            options: {
              sassOptions: {
                includePaths: [
                  path.resolve(__dirname, 'src/scss'),
                ],
              },
            },
          },
        ],
        include: path.resolve(__dirname, 'src/client/components'),
      },
    ],
  },
  optimization: {
    runtimeChunk: 'single',
    splitChunks: {
      cacheGroups: {
        react: {
          name: 'react',
          test: /[\\/]node_modules[\\/]react[\\/]/,
          chunks: 'all',
          enforce: true,
        },
        reactDom: {
          name: 'react-dom',
          test: /[\\/]node_modules[\\/]react-dom[\\/]/,
          chunks: 'all',
          enforce: true,
        },
        corejs: {
          name: 'corejs',
          test: /[\\/]node_modules[\\/]core-js[\\/]/,
          chunks: 'all',
          enforce: true,
        },
      }
    },

    minimizer: [
      new TerserPlugin({
        cache: true,
        parallel: true,
        sourceMap: true,
      }),
    ],
  },
  resolve: {
    extensions: ['.jsx', '.js'],
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: SITE_TITLE,
      template: 'src/template/index.hbs',
      filename: '../index.html',
    }),
    new MiniCssExtractPlugin({
      filename: '[name].[hash].css',
      chunkFilename: '[name].[hash].css',
    }),
  ],
}, {
  name: 'hex-frontend-task-server',
  mode: 'production',
  target: 'node',
  node: {
    __dirname: true,
    __filename: true,
  },
  entry: {
    server: './src/server/server.js',
  },
  output: {
    filename: 'hex-frontend-task-server.js',
    path: path.join(__dirname, OUTPUT_DIR),
  },
}];
