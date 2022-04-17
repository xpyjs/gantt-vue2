const path = require("path");
const webpack = require("webpack");
const pkg = require("./package.json");

process.env.NODE_ENV = "production";

module.exports = {
  mode: "production",
  entry: {
    main: path.resolve(__dirname, "./src/index.js") // 将src下的 index.js 作为入口点
  },
  output: {
    path: path.resolve(__dirname, "./lib"),
    publicPath: "/lib/",
    filename: "gantt-vue2.min.js",
    library: "gantt-vue2",
    libraryTarget: "umd",
    umdNamedDefine: true
  },
  externals: {
    vue: "vue"
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: "vue-loader",
        options: {
          loaders: {
            css: [
              "vue-style-loader",
              {
                loader: "css-loader",
                options: {
                  sourceMap: true
                }
              }
            ],
            stylus: [
              "vue-style-loader",
              {
                loader: "css-loader",
                options: {
                  sourceMap: true
                }
              },
              {
                loader: "stylus-loader",
                options: {
                  sourceMap: true
                }
              }
            ]
          },
          postLoaders: {
            html: "babel-loader?sourceMap"
          },
          sourceMap: true
        }
      },
      {
        test: /\.styl$/,
        use: [{ loader: "stylus-loader" }, { loader: "css-loader" }]
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: "babel-loader",
        options: {
          sourceMap: true
        }
      },
      {
        test: /\.(gif|jpg|png|woff|svg|eot|ttf)$/,
        loader: "url-loader",
        query: { limit: 8192 }
      }
    ]
  },

  resolve: {
    extensions: [".js", ".vue"],
    alias: {
      vue: "vue/dist/vue.esm.js",
      "@": path.join(__dirname, "src")
    }
  },

  plugins: [
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      },
      output: {
        comments: false
      }
    }),
    new webpack.optimize.ModuleConcatenationPlugin(),
    new webpack.DefinePlugin({
      "process.env.VERSION": `"${pkg.version}"`,
      "process.env.NODE_ENV": '"production"'
    })
  ]
};
