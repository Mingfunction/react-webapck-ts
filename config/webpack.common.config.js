/*
 * @Date: 2020-04-05 11:21:30
 * @LastEditors: Min
 * @LastEditTime: 2020-04-06 23:11:11
 * @fun:
 */
const path = require("path");
var TARGET = process.env.npm_lifecycle_event;
const isDev = process.env.NODE_ENV;
console.log(TARGET, isDev, "执行环境-------");
console.log(path.resolve(__dirname, "../src"));
module.exports = {
  devtool: "cheap-module-eval-source-map",
  resolve: {
    // 在引入这些文件时,可以不添加后缀
    extensions: [".ts", ".tsx", ".scss", ".css", ".js", ".jsx", ".less"],
    modules: [path.resolve(__dirname, "../src"), "node_modules"],
    alias: {
      // 方便 import from
      "@components": path.join(__dirname, "../src/components"),
      "@util": path.join(__dirname, "../src/util"),
      "@pages": path.join(__dirname, "../src/pages"),
      _images: path.join(__dirname, "../src/assets/img"),
      _iconfont: path.join(__dirname, "../src/assets/iconfont"),
    },
  },
  entry: {
    index: "./src/index.tsx",
    framework: ["react", "react-dom"],
  },
  output: {
    filename: "js/[name].bundle.[chunkhash:4].js",
    // dist 必须为绝对路径
    chunkFilename: "[name].chunk.js",
    path: path.resolve(__dirname, "../dist"),
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        use: "babel-loader",
        // exclude 告诉我们不需要去转译"node_modules"这里面的文件。
        exclude: /node_modules/,
      },
      {
        test: /\.(ts|tsx)$/,
        use: "ts-loader",
        // exclude 告诉我们不需要去转译"node_modules"这里面的文件。
        exclude: /node_modules/,
      },
      {
        test: /\.(eot|ttf|svg|woff|woff2)$/,
        use: {
          loader: "file-loader",
          options: {
            name: "[name]-[hash].[ext]",
            outputPath: "font/",
          },
        },
      },
    ],
  },
};
