const path = require("path");
var TARGET = process.env.npm_lifecycle_event;
const isDev = process.env.NODE_ENV;
console.log(TARGET, isDev, "执行环境-------");
console.log(path.resolve(__dirname, "../src"));
module.exports = {
  devtool: "cheap-module-eval-source-map",
  resolve: {
    extensions: [".js", ".jsx", ".ts", ".tsx", ".json", ".less", ".scss"],
    modules: [path.resolve(__dirname, "../src"), "node_modules"],
    alias: {
      // 方便 import from
      // 但是也不方便因为编辑器有路径功能
      images: path.join(__dirname, "../src/assets/images"),
      _pages: path.join(__dirname, "../src/assets/pages"),
      _font: path.join(__dirname, "../src/assets/font"),
      _components: path.join(__dirname, "../src/components"),
      util: path.join(__dirname, "../src/util"),
      _mock: path.join(__dirname, "../src/mock"),
      "@store": path.join(__dirname, "../src/store"),
    },
  },
  entry: {
    index: "./src/index.tsx",
    framework: ["react", "react-dom"],
  },
  output: {
    filename: "js/[name].bundle.[chunkhash:4].js",
    // dist 必须为绝对路径
    path: path.resolve(__dirname, "../dist"),
  },
  module: {
    rules: [
      // {
      //     test: /\.js$/,
      //     loader: 'eslint-loader',
      //     enforce: "pre",
      //     include: [path.resolve(__dirname, 'src')], // 指定检查的目录
      //     options: { // 这里的配置项参数将会被传递到 eslint 的 CLIEngine
      //         formatter: require('eslint-friendly-formatter') // 指定错误报告的格式规范
      //     }
      // },
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
            name: "[name]_[hash].[ext]",
            outputPath: "font/",
          },
        },
      },
    ],
  },
};
