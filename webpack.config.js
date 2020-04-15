"use strict";
const path = require("path");
const CopyWebpackPlugin = require("copy-webpack-plugin");

module.exports = {
  // 시작 포인트 설정
  entry: {
    main: ["./src/main.js"],
  },
  // 빌드 포인트 설정
  output: {
    path: path.resolve(__dirname, "./build"),
    filename: "[name].js",
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        include: path.resolve(__dirname, "./src"),
        loader: "babel-loader",
      },
    ],
  },
  plugins: [
    new CopyWebpackPlugin([
      {
        context: "./public",
        from: "*.*",
      },
    ]),
  ],
  devServer: {
    contentBase: "./public",
    host: "localhost",
    port: 3030,
  },
};
