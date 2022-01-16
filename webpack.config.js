const HtmlWebpackPlugin = require("html-webpack-plugin");
const path = require("path");

module.exports = {
  mode: process.env.NODE_ENV,
  entry: "./client/index.js",
  output: {
    path: path.resolve("build"),
    // publicPath: '/build/',
    filename: "bundle.js",
  },
  plugins: [new HtmlWebpackPlugin({ template: "./index.html" })],
  module: {
    rules: [
      {
        test: /\.jsx?/,
        exclude: /node_modules/,
        use: ["babel-loader"],
      },
      {
        test: /\.(png|jpg|gif)$/i,
        use: [
          {
            loader: "url-loader",
            options: {
              limit: 8192,
            },
          },
        ],
      },
      {
        test: /\.s[ac]ss$/i,
        use: [
          // "style-loader", // this is only used if we don't use the css plugin
          "css-loader",
          "sass-loader",
        ],
      },
      {
        test: /\.svelte$/,
        use: {
          loader: "svelte-loader",
          options: {
            // compilerOptions: {
            //   dev: !prod,
            // },
            // emitCss: prod,
            // hotReload: !prod,
          },
        },
      },
    ],
  },
  devServer: {
    // static: {
    //     directory: path.resolve('./'),
    // },
    compress: true,
    port: 8080,
    proxy: {
      "/": "http://localhost:3000",
    },
  },
};
