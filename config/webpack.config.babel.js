import webpack from 'webpack';
import CaseSensitivePathsPlugin from 'case-sensitive-paths-webpack-plugin';
import WatchMissingNodeModulesPlugin from 'react-dev-utils/WatchMissingNodeModulesPlugin';
import getClientEnvironment from './env.js';
import paths from './paths.js';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
// Webpack uses `publicPath` to determine where the app is being served from.
// In development we serve from here so that Django reads webpack-stats to get this value to serve webpack assets
// Note that specifying publicPath causes django-webpack-loader to ignore
// 'BUNDLE_DIR_NAME' in settings.py. It instea uses this path
const publicPath = 'http://localhost:3000/';
// `publicUrl` is just like `publicPath`, but we will provide it to our app
// as %PUBLIC_URL% in `index.html` and `process.env.PUBLIC_URL` in JavaScript.
// Omit trailing slash as %PUBLIC_PATH%/xyz looks better than %PUBLIC_PATH%xyz.
// Get environment variables to inject into our app.
const publicUrl = 'http://localhost:3000/';

const env = getClientEnvironment(publicUrl);
import * as R from 'ramda';

module.exports = {
  mode: "development", // this will trigger some webpack default stuffs for dev
  // Don't attempt to continue if there are any errors.
  bail: true,
  target: 'web',
  entry: paths.appIndexJs,
  output: {
    // Django webpack loader setup. This makes webpack write the files to assets/bundles
    path: paths.appBuild,
    filename: "[name].js",
    chunkFilename: "[name]-[id].js",
    // Add /* filename */ comments to generated require()s in the output.
    pathinfo: true,
    // This is the URL that app is served from. We use '/' in development.
    publicPath: publicPath
  },
  resolve: {
    fallback: {
      os: require.resolve("os-browserify/browser"),
      zlib: require.resolve("browserify-zlib"),
      http: require.resolve("stream-http"),
      https: require.resolve("https-browserify"),
      crypto: require.resolve("crypto-browserify"),
      util: require.resolve("util"),
      constants: require.resolve("constants-browserify"),
      stream: require.resolve("stream-browserify"),
      path: require.resolve("path-browserify"),
      assert: false,
      fs: false,
      tls: false,
      'buffer-from': false
    },
    modules: ['node_modules'],
    // These are the reasonable defaults supported by the Node ecosystem.
    extensions: ['.mjs', '.js', '.json', '.jsx']
  },

  devtool: "source-map",
  plugins: [
    new webpack.ProvidePlugin({
      Buffer: ['buffer', 'Buffer']
    }),
    new HtmlWebpackPlugin({
      template: 'app/templates/index_default.html'
    }),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify(process.env.NODE_ENV),
        GOOGLE_API_KEY: JSON.stringify(process.env.GOOGLE_API_KEY),
        GOOGLE_API_KEY_PROD: JSON.stringify(process.env.GOOGLE_API_KEY_PROD),
        GOOGLE_STREETVIEW_SIGNATURE: JSON.stringify(process.env.GOOGLE_STREETVIEW_SIGNATURE),
        OSM_SERVERS: JSON.stringify(process.env.OSM_SERVERS),
        MAPBOX_API_ACCESS_TOKEN: JSON.stringify(process.env.MAPBOX_API_ACCESS_TOKEN),
        SOP_TEST_PASSWORD: JSON.stringify(process.env.SOP_TEST_PASSWORD),
        SOP_TEST_USERNAME: JSON.stringify(process.env.SOP_TEST_USERNAME)
      },
      // For ome reasons supports-color tries to access process.argv
      'process.argv': JSON.stringify(''),
      // For a stupid module checking the version, which the browser can't access
      'process.version': JSON.stringify(process.version),
      // For stupid fs-extra that tests for fs.realpath.native
      'fs.realpath': {}
    }),
    // Add module names to factory functions so they appear in browser profiler.
    //new webpack.NamedModulesPlugin(),
    // Makes some environment variables available to the JS code, for example:
    // if (process.env.NODE_ENV === 'development') { ... }. See `./env.js`.
    //new webpack.DefinePlugin(env.stringified),
    // This is necessary to emit hot updates (currently CSS only):
    new webpack.HotModuleReplacementPlugin(),
    // Watcher doesn't work well if you mistype casing in a path so we use
    // a plugin that prints an error when you attempt to do this.
    // See https://github.com/facebookincubator/create-react-app/issues/240
    new CaseSensitivePathsPlugin(),
    // If you require a missing module and then `npm install` it, you still have
    // to restart the development server for Webpack to discover it. This plugin
    // makes the discovery automatic so you don't have to restart.
    // See https://github.com/facebookincubator/create-react-app/issues/186
    new WatchMissingNodeModulesPlugin(paths.appNodeModules),
    // Moment.js is an extremely popular library that bundles large locale files
    // by default due to how Webpack interprets its code. This is a practical
    // solution that requires the user to opt into importing specific locales.
    // https://github.com/jmblog/how-to-optimize-momentjs-with-webpack
    // You can remove this if you don't use Moment.js:
    new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
    new MiniCssExtractPlugin({
      // Options similar to the same options in webpackOptions.output
      // both options are optional
      filename: process.env.NODE_ENV === 'development' ? '[name].css' : '[name].[hash].css',
      chunkFilename: process.env.NODE_ENV === 'development' ? '[id].css' : '[id].[hash].css',
      ignoreOrder: false // Enable to remove warnings about conflicting order
    })
  ], // automatically creates a 'index.html' for us with our <link>, <style>, <script> tags inserted! Visit https://github.com/jantimon/html-webpack-plugin for more options
  module: {
    strictExportPresence: true,
    rules: [
      {
        // 'oneOf' will traverse all following loaders until one will
        // match the requirements. When no loader matches it will fall
        // back to the 'file' loader at the end of the loader list.
        oneOf: [
          // 'url' loader works like 'file' loader except that it embeds assets
          // smaller than specified limit in bytes as data URLs to avoid requests.
          // A missing `test` is equivalent to a match.
          {
            test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
            loader: require.resolve('url-loader'),
            options: {
              limit: 10000,
              name: 'static/media/[name].[hash:8].[ext]'
            }
          },
          {
            test: /\.js$/,
            include: paths.appSrc,
            loader: require.resolve('babel-loader'),
            options: {

              // This is a feature of `babel-loader` for webpack (not Babel itself).
              // It enables caching results in ./node_modules/.cache/babel-loader/
              // directory for faster rebuilds.
              cacheDirectory: true
            }
          },
          {
            test: /\.m?js/,
            resolve: {
              fullySpecified: false
            }
          },
          {
            test: /\.css$/,
            use: [
              {
                loader: MiniCssExtractPlugin.loader
              },
              'css-loader'
            ]
          },
          // 'file' loader makes sure those assets get served by WebpackDevServer.
          // When you `import` an asset, you get its (virtual) filename.
          // In production, they would get copied to the `build` folder.
          // This loader doesn't use a 'test' so it will catch all modules
          // that fall through the other loaders.
          {
            // Exclude `js` files to keep 'css' loader working as it injects
            // its runtime that would otherwise processed through 'file' loader.
            // Also exclude `html` and `json` extensions so they get processed
            // by webpacks internal loaders.
            exclude: [/\.(js|jsx|mjs|cjs)$/, /\.html$/, /\.json$/],
            loader: require.resolve('file-loader'),
            options: {
              name: 'static/media/[name].[hash:8].[ext]'
            }
          }
        ]
      }
      // ** STOP ** Are you adding a new loader?
      // Make sure to add the new loader(s) before the 'file' loader.
    ]
  },
  externals: {},
  // Turn off performance hints during development because we don't do any
  // splitting or minification in interest of speed. These warnings become
  // cumbersome.
  performance: {
    hints: false
  },
  devServer: {
    historyApiFallback: true, // to make our SPA works after a full reload, so that it serves 'index.html' when 404 response
    stats: "minimal", // default behaviour spit out way too much info. adjust to your need.
    port: 3000,
    contentBase: paths.appBuild,
    /*
    hot: false,
    inline: false,
    liveReload: false,
     */
    headers: {
      "Access-Control-Allow-Origin": "http://localhost:8004"
    }
  },
  stats: {
    warningsFilter: [/critical dependency:/i]
  },
  /*
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          keep_classnames: true,
          keep_fnames: true
        }
      })
    ]
  }

   */
};
