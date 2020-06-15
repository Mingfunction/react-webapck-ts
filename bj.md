# 学习 webpack 能不能翻一下身？？

## webpack+react

> [https://juejin.im/post/5da5748851882555a8430641](https://juejin.im/post/5da5748851882555a8430641)
> 本咸鱼是根据这一篇博客来的的，同时我也记录了一些我踩过的坑

### 建一个空文件夹 webpack-react

- 命令行执行

```js
    npm init -y
    // 生成一个package.json
    // npm install就是根据这个文件去下载我们项目里使用的包
    // 也就是配置项目所需的运行和开发环境。
```

### 之后我们安装 webpack

```js
npm i webpack webpack-cli -D
```

- 文件目录
  > webpack-react
  > |- node_modules
  > |- package.json

接下来，我们在根目录下新建一个文件夹名为 config 用于存放配置文件，在此文件夹下创建一个 .js 文件名为 webpack.common.config.js ，敲入以下代码：

```js
// webpack 配置是标准的 Node.js的CommonJS 模块，
const path = require("path");

module.exports = {
  // 入口文件路径
  entry: {
    app: "./src/app.js",
  },
  // 出口文件
  output: {
    filename: "js/bundle.js",
    // dist 必须为绝对路径
    path: path.resolve(__dirname, "../dist"),
  },
};
```

之后我们创建 src 文件,并在里面创建 app.js

```diff
  webpack-react-scaffold
+ |- config
+     |- webpack.common.config.js
  |- node_modules
+ |- src
+     |- app.js
  |- package.json

```

在 package.json 中配置

```json
  "scripts": {
	"test": "echo \"Error: no test specified\" && exit 1",
	// 这里我们定义 --config 我们的webpack配置文件的路径 默认是根目录文件下的webpack.config.js文件,
	// 为了代码结构清晰我们建立了config文件夹
	// 并且我们知道为什么是 npm run build ,你不欢喜build,那么打包的命令可以start "start": "webpack --config ./config/webpack.common.config.js"
+  "build": "webpack --config ./config/webpack.common.config.js"
  },

```

好了，我们试试怎么打包吧。
在控制台中输入命令：

```js
	npm run build
```

执行之后，你会发现根目录多出了一个文件夹： dist/js ，其中有一个 js 文件： bundle.js ，那么至此，我们已经成功编译打包了一个 js 文件，即入口文件： app.js 。

### 使用 webpack-merge

我们将使用一个名为 webpack-merge 的工具。通过"通用"配置，我们不必在环境特定(environment-specific)的配置中重复代码。简单来说就是生产环境不同，我们要给的配置也有所不同，但是可以共用一个共有的配置。

#### 安装

```js
	npm install --save-dev webpack-merge
```

之后我们在 config 中建立 webpack.dev.config.js 和 webpack.prod.config.js

> prod:生产环境 production
> dev:开发环境 development

现目录结构：

```js
  webpack-react-scaffold
  |- config
     |- webpack.common.config.js
+    |- webpack.prod.config.js
+    |- webpack.dev.config.js
  |- node_modules
  |- src
     |- app.js
  |- package.json

```

在 webpack.prod.config.js 里输入代码：

```js
const merge = require("webpack-merge");
const common = require("./webpack.common.config.js");

module.exports = merge(common, {
  // 生产环境 可选production（默认）/ development / none
  mode: "production",
});
```

回到我们之前创建的 app.js 文件，输入代码：

```js
var root = document.getElementById("root");
root.innerHTML = "hello, webpack!";
```

在根目录下创建一个文件夹名为： public ，再新建一个 html 文件，名为： index.html ，以下内容：

```js
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <title>从零配置webpack4+react脚手架</title>
</head>
<body>
  <div id="root"></div>
</body>
</html>
```

### html-webpack-plugin

index.html 应该自动编译到 dist 目录，并且所有的 js 引用是自动添加的。你可以使用 html-webpack-plugin 插件来处理这个优化。

```js
	npm install html-webpack-plugin -D
	// -D是--save-dev的缩写
```

在 webpack.prod.config.js 中配置 plugins 属性

```js
const merge = require("webpack-merge");
const common = require("./webpack.common.config.js");

const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = merge(common, {
  mode: "production",
  plugins: [
    new HtmlWebpackPlugin({
      filename: "index.html",
      // 这里有小伙伴可能会疑惑为什么不是 '../public/index.html'
      // 我的理解是无论与要用的template是不是在一个目录，都是从根路径开始查找
      template: "public/index.html",
      inject: "body",
      minify: {
        removeComments: true,
        collapseWhitespace: true,
      },
    }),
  ],
});
```

- filename：打包之后的 html 文件名字
- template：以我们自己定义的 html 为模板生成，不然我们还要到打包之后的 html 文件中写
- inject：在 body 最底部引入 js 文件，如果是 head，就是在 head 中引入 js
- minify：压缩 html 文件，更多配置点我 - removeComments：去除注释 - collapseWhitespace：去除空格

现在我们再来打包试试，看看 dist 中是不是多出了 html 文件，并且自动引入了 script，用浏览器打开它试试看是不是能正确输出内容了！

### 安装 react

```js
	npm install --save react react-dom
```

安装完成之后，我们就可以写 react 的 JSX 语法了。

这里为了和 react 官方脚手架 create-react-app 的目录结构相类似，我们在 src 文件夹下新建一个 js 文件， index.js ，用于渲染根组件。index.js 输入:

```js
import React from "react";
import ReactDOM from "react-dom";
import App from "./App";

ReactDOM.render(<App />, document.getElementById("root"));
```

用 jsx 重写 app.js:

```js
import React from "react";

function App() {
  return <div className="App">Hello World</div>;
}

export default App;
```

并 webpack.common.config.js 文件中的入口进行修改，因为我们现在要编译打包的应该 index.js ：

```js
  const path = require('path');

  module.exports = {
    entry: {
-     app: './src/app.js',
+     index: './src/index.js',
    },
    output: {
      filename: 'js/bundle.js',
      path: path.resolve(__dirname, '../dist')
    }
  }
```

现在尝试一下重新运行 npm run build ，会发现打包失败了，为什么呢？接着看.....

因为 webpack 根本识别不了 jsx 语法，那怎么办？使用 loader 对文件进行预处理。
其中，babel-loader，就是这样一个预处理插件，它加载 ES2015+ 代码，然后使用 Babel 转译为 ES5。那开始配置它吧！

```js
npm install --save-dev babel-loader @babel/preset-react @babel/preset-env @babel/core
```

- babel-loader：\*\*使用 Babel 和 webpack 来转译 JavaScript 文件。
- @babel/preset-react：\*\*转译 react 的 JSX
- @babel/preset-env：\*\*转译 ES2015+的语法
- @babel/core：\*\*babel 的核心模块

理论上我们可以直接在 webpack.common.config.js 中配置"options"，但最好在当前根目录，注意，一定要是根目录！！！ 新建一个配置文件 .babelrc 配置相关的"presets"：

```json
{
  "presets": [
    [
      "@babel/preset-env",
      {
        "targets": {
          // 大于相关浏览器版本无需用到 preset-env
          "edge": 17,
          "firefox": 60,
          "chrome": 67,
          "safari": 11.1
        },
        // 根据代码逻辑中用到的 ES6+语法进行方法的导入，而不是全部导入
        "useBuiltIns": "usage"
      }
    ],
    "@babel/preset-react"
  ]
}
```

再修改 webpack.common.config.js

```js
const path = require("path");

module.exports = {
  entry: {
    index: "./src/index.js",
  },
  output: {
    filename: "js/bundle.js",
    path: path.resolve(__dirname, "../dist"),
  },
  module: {
    rules: [
      {
        //test 规定了作用于以规则中匹配到的后缀结尾的文件
        test: /\.(js|jsx)$/,
        // use使用什么插件
        use: "babel-loader",
        // exclude 告诉我们不需要去转译"node_modules"这里面的文件。
        exclude: /node_modules/,
      },
    ],
  },
};
```

我们再次打包：

```js
npm run build
```

我们再确认一次我们的目录：

```diff
  webpack-react-scaffold
   |- config
      |- webpack.common.config.js
      |- webpack.prod.config.js
      |- webpack.dev.config.js
   |- node_modules
   |- public
      |- index.html
   |- src
+     |- index.js
      |- app.js
+  |- .babelrc
   |- package.json
```

### 给打包出的 js 文件换个不确定名字

这个操作是为了防止因为浏览器缓存带来的业务代码更新，而页面却没变化的问题，你想想看，假如客户端请求 js 文件的时候发现名字是一样的，那么它很有可能不发新的数据包，而直接用之前缓存的文件，当然，这和缓存策略有关。

很简单，[hash]或[chunkhash],这里我们先使用 hash
修改 webpck.common.config.js：

```js
const path = require("path");
module.exports = {
  entry: {
    index: "./src/index.js",
  },
  output: {
    filename: "js/[name].bundle.[hash:4].js",
    path: path.resolve(__dirname, "../dist"),
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        use: "babel-loader",
        exclude: /node_modules/,
      },
    ],
  },
};
```

name 是 entry 的文件名 key,而不是文件名.
现在你重新打包,去看看生成的 js 文件的名字~

### 打包编译前清理 dist 目录

之前打包的 dist 里因为 js 文件名字不同已经有了多个 js 文件，我们只想要最新打包编译的文件，就需要先清除 dist 目录，再重新生成。

#### 安装

```js
npm i clean-webpack-plugin -D
```

[clean-webpack-plugin 配置文档](https://github.com/johnagan/clean-webpack-plugin)

修改 webpack.prod.config.js:

```js
const merge = require("webpack-merge");
const common = require("./webpack.common.config.js");

const HttpWebpackPlugin = require("http-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

module.exports = merge(common, {
  mode: "production",
  plugins: [
    new HtmlWebpackPlugin({
      filename: "index.html",
      // 这里有小伙伴可能会疑惑为什么不是 '../public/index.html'
      // 我的理解是无论与要用的template是不是在一个目录，都是从根路径开始查找
      template: "public/index.html",
      inject: "body",
      minify: {
        removeComments: true,
        collapseWhitespace: true,
      },
    }),
    new CleanWebpackPlugin({
      //现在已经不需要再写参数了,如果不起作用可以试试写上参数
      //cleanOnceBeforeBuildPatterns:[path.resolve(process.cwd(),"dist/*")]
    }),
  ],
});
```

现在试试应该就只有一个 js 文件了

### 代码分割

这个打包之后的 bundle.js 文件大小为 129kb，随着业务代码越来越多，这个包会变得越来越大，你每次修改了代码并发布，用户都需要重新下载这个包，但是想想看，我们修改的代码只是整个代码的一小部分，还有许多其他不变的代码，例如 react  和 react-dom ，那我们把这部分不变的代码单独打包。

修改 webpack.common.config.js ，增加一个入口：

```js
  entry: {
    index: './src/index.js',
    framework: ['react','react-dom'],
  },
```

重新打包，发现 react 和 react-dom 被编译成 framework.js，但是我们的 index.bundle.js 还是 129kb，没有变过。
这是因为我们还没有抽离 index.js 中的公共代码。

> webpack3 版本是通过配置 CommonsChunkPlugin 插件来抽离公共的模块。webpack4 版本，官方废弃了 CommonsChunkPlugin，而是改用配置 optimization.splitChunks 的方式，更加方便。

添加代码至 webpack.prod.config.js ：

```js
// 代码太多就不重复了，根据上下文将代码放在合适的地方
module.exports = merge(common, {
  mode: "production",
  plugins: [],
  optimization: {
    splitChunks: {
      chunks: "all",
      minSize: 30000,
      maxSize: 0,
      minChunks: 1,
      //cacheGroups对象，定义了需要被抽离的模块
      cacheGroups: {
        framework: {
          //test属性是比较关键的一个值，他可以是一个字符串，也可以是正则表达式，还可以是函数。如果定义的是字符串，会匹配入口模块名称，会从其他模块中把包含这个模块的抽离出来。
          test: "framework",
          //name是抽离后生成的名字，和入口文件模块名称相同，这样抽离出来的新生成的framework模块会覆盖被抽离的framework模块，虽然他们都叫framework。
          name: "framework",
          enforce: true,
        },
        //vendors这个缓存组，它的test设置为 /node_modules/ 表示只筛选从node_modules文件夹下引入的模块，所以所有第三方模块才会被拆分出来。
        vendors: {
          priority: -10,
          test: /node_modules/,
          name: "vendor",
          enforce: true,
        },
      },
    },
  },
});
```

重新打包,你会发现没有效果

```js
 	output: {
		 // hash 导致了这里打包freamework依旧重新打包
        filename: "js/[name].bundle.[chunkhash:4].js",
        path: path.resolve(__dirname, "../dist")
	},
```

再此打包
我们发现 index.bundle.js 文件大小只有：1.7kb
我们随意修改一下 app.js 中的内容再打包一次，你会发现 index.bundle.js（不被缓存）的 hash 值变了，但是 freamework.bundle.js（能被缓存）的 hash 值没变

### 压缩 JS 文件

```js
npm install uglifyjs-webpack-plugin --save-dev
```

将 uglifyjs-webpack-plugin 引入 webpack.prod.config.js

```js
const UglifyjsWebpackPlugin = require('uglifyjs-webpack-plugin')
// optimization内配置minimizer参数
module.exports = merge(common,{
	mode:
	plugin:[],
	optimization:{
		minimizer:[new UglifyjsWebpackPlugin()]
		splitChunks:{},
	}
})

```

重新打包编译看看～我们的 index.bundle.js 减少了 5 字节，当然，随着业务代码越来越多，这部分差距会渐渐变大。

### 自动编译打包 webpack-dev-server

```js
npm i webpack-dev-server -D
```

我们每次修改代码，查看结果都要经历以此 npm run build ，大大降低了开发效率，这难以忍受！
webpack 给我们提供了 devServer 开发环境，支持热更新

代码增加到 webpack.dev.config.js

```js
const path = require("path");
const merge = require("webpack-merge");
const common = require("./webpack.common.config.js");

const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = merge(common, {
  mode: "development",
  output: {
    filename: "js/[name].[hash:4].bundle.js",
  },
  devServer: {
    contentBase: path.resolve(__dirname, "../dist"),
    open: true,
    port: 8080,
    compress: true,
    // 设置devServer.hot为true，并且在plugins中引入HotModuleReplacementPlugin插件即可。
    // 还需要注意的是我们开启了hot，那么导出不能使用chunkhash，需要替换为hash。
    // 之前我们试过hash会不停的更换名字
    hot: true,
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "public/index.html",
      inject: "body",
      hash: false,
    }),
    //HotModuleReplacementPlugin是webpack热更新的插件，设置devServer.hot为true
    new webpack.HotModuleReplacementPlugin(),
  ],
});
```

之后再修改 package.json 的启动 start

```json
"scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "build": "webpack --config ./config/webpack.prod.config.js",
    "start": "webpack-dev-server --inline --config ./config/webpack.dev.config.js"
  },
```

好了,我们现在又可以快乐的 npm run start 启动！！！

现在 js,html,css,现在前两架马车已经没什么问题,我们现在解决 css 的问题

### 先让 CSS 跑起来

首先我们新建 css 文件 app.css 并在 app 中引入

```css
.App {
  color: #ff0000;
}
```

之后我们发现我们的 8080 已经报错了,wbpack 只能编译 js 文件,css 文件是无法被识别并编译的,我们需要 loader 加载器来进行预处理。 首先安装 style-loader 和 css-loader ：

```js
npm i style-loader css-loader -D
```

遇到后缀为.css 的文件，webpack 先用 css-loader 加载器去解析这个文件，遇到“@import”等语句就将相应样式文件引入（所以如果没有 css-loader，就没法解析这类语句），最后计算完的 css，将会使用 style-loader 生成一个内容为最终解析完的 css 代码的 style 标签，放到 head 标签里。
loader 是有顺序的，webpack 肯定是先将所有 css 模块依赖解析完得到计算结果再创建 style 标签。因此应该把 style-loader 放在 css-loader 的前面（webpack loader 的执行顺序是从右到左）。

### 打包出 CSS 独立文件

在我们平时写 css 的时候不会将 css 直接写在 html 页面而是用 link 标签引入文件,所以我们也希望通过引入外部 css 文件进行样式引入 css,我们需要用到 mini-css-extract-plugin 这个插件

> webpack 4.0 以后，官方推荐使用 extract-text-webpack-plugin 插件来打包 css 文件。可以自己了解

#### 安装

```js
npm i mini-css-extract-plugin -D
```

然后将你的 webpack.prod.config.js 修改

```js
const path = require("path")
const merge = require("webpack-merge");
const common = require("./webpack.common.config");
const HtmlWebpackPlugin = require('html-webpack-plugin')
const {CleanWebpackPlugin} = require("clean-webpack-plugin")
const UglifyjsWebpackPlugin = require('uglifyjs-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
// ++ 是 minicssexractplugin添加的内容
module.exports = merge(common, {
	mode: "production",
	module:{
		rules:[
			{
				test:/\.css$/,
				use:[
++					MiniCssExtractPlugin.loader,
					"css-loader"
				]
			}
		]
	},
	plugins: [
		/*

			filename：打包之后的html文件名字
			template：以我们自己定义的html为模板生成，不然我们还要到打包之后的html文件中写
			inject：在body最底部引入js文件，如果是head，就是在head中引入js,false不生成js
			minify：压缩html文件，更多配置点我
				removeComments：去除注释
				collapseWhitespace：去除空格
		*/
		new HtmlWebpackPlugin({
			filename: "index.html",
			template: "public/index.html",
			inject: "body",
			minify: {
				removeComments: true,
				collapseWhitespace: true,
			}
		}),
		new CleanWebpackPlugin({
			// 项目里有改动才会有新的包 打包编译前清理dist目录
			cleanOnceBeforeBuildPatterns: [path.resolve(process.cwd(), "dist/*")]
		}),
		new MiniCssExtractPlugin({
			// 这里我们注意一下 在开发环境中 我们不加上hash
			// 在生产环境 我们使用hash
++			filename: 'css/[name].[hash].css',
++      	chunkFilename: 'css/[id].[hash].css',
		})
	],
	optimization: {
		minimizer:[
			new UglifyjsWebpackPlugin()
		],
		splitChunks: {
			chunks: 'all',
			minSize: 30000,
			maxSize: 0,
			minChunks: 1,
			cacheGroups: {
				framework: {
					test: "framework",
					name: "framework",
					enforce: true
				},
				vendors: {
					priority: -10,
					test: /node_modules/,
					name: "vendor",
					enforce: true,
				},
			}
		}
	},
})
```

然后我们 npm run build 打包发现 dist 中多了 css/index.html,你的 css 已经被打包好了
但是它没有被压缩

### 压缩打包出的 CSS 文件

压缩，我们需要 optimize-css-assets-webpack-plugin 插件

#### 安装

```js
npm i optimize-css-assets-webpack-plugin -D
```

修改 webpack.prod.config.js

```js
// 在optimization的minimizer中添加参数
// OptimizeCssAssetsWebpackPlugin
const OptimizeCssAssetsWebpackPlugin = require("optimize-css-assets-webpack-plugin");

module.exports = merge(common, {
  optimization: {
    minimizer: [
      new UglifyjsWebpackPlugin(),
      new OptimizeCssAssetsWebpackPlugin({
        // 正则表达式，用于匹配需要优化或者压缩的资源名。默认值是/.css$/g
        assetNameRegExp: /\.css$/g,
        // 用于压缩和优化CSS 的处理器，默认是 cssnano.
        cssProcessor: require("cssnano"),
        // 	传递给cssProcessor的插件选项，默认为{}
        cssProcessorPluginOptions: {
          //	预设： '默认'，		  丢弃注释：		删除全部注释
          preset: ["default", { discardComments: { removeAll: true } }],
        },
        //表示插件能够在console中打印信息，默认值是true
        canPrint: true,
      }),
    ],
  },
});
```

另外，这段配置也是可以放到 plugins 这个属性下进行配置的。 配置完成，执行 npm run build ，查看 dist 目录下打包出的 css 文件是不是代码被压缩了！

### Sass and Less

我们写项目的时候没几个人会去写 css 吧？sass 或 less 对于工作效率的提高是肉眼可见的，但是我们 webpack 也同样无法理解这种编写方式，那就需要配置 loader 做预处理，将其转换为 css。

####安装

```js
npm install --save-dev less less-loader node-sass sass-loader
```

之后我们开始配置 moudule 中的 rules loader

```js
module: {
    rules: [
      //...
      {
        test: /\.less$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          'less-loader'
        ]
      },
      {
        test: /\.(sass|scss)$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          'sass-loader'
        ]
      },
	]

  },
```

好的,我们执行 npm run build 就可以看到 sass,less 已经被转换成 css 了

### 我们还需要对 css 进行补全 Postcss

postcss 一种对 css 编译的工具，类似 babel 对 js 的处理，常见的功能如：

1. 使用下一代 css 语法
2. 自动补全浏览器前缀
3. 自动把 px 代为转换成 rem
4. css 代码压缩等等
   postcss 只是一个工具，本身不会对 css 一顿操作，它通过插件实现功能，autoprefixer 就是其一。

#### 安装

```js
npm i postcss postcss-loader -D
```

安装其中的某个插件比如 Autoprefixer

```js
npm i autoprefixer -D
```

```js
module.exports = merge(common, {
  //...
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, "css-loader", "postcss-loader"],
      },
      {
        test: /\.less$/,
        use: [
          MiniCssExtractPlugin.loader,
          "css-loader",
          "postcss-loader",
          "less-loader",
        ],
      },
      {
        test: /\.(scss|sass)$/,
        use: [
          MiniCssExtractPlugin.loader,
          "css-loader",
          "postcss-loader",
          "sass-loader",
        ],
      },
    ],
  },
  //...
});
```

接下来我 执行 npm run build 打包,
这里有两个警告（不影响程序的）

1. .babelrc 中需要 croejs 你需要指定 croejs 的版本 [https://blog.csdn.net/qq_41893551/article/details/90109391](https://blog.csdn.net/qq_41893551/article/details/90109391)

2) PostCSS 中[https://www.jianshu.com/p/15d51e796dca](https://www.jianshu.com/p/15d51e796dca)
   autoprefixer 版本高了,引用要修改,需要用新的方法

解决这些之后,就可以快乐的 npm run build

之后我们来配置 webpack.dev.config.js

```js
const merge = require("webpack-merge");
const common = require("./webpack.common.config");
const path = require("path");

const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = merge(common, {
  mode: "development",
  output: {
    filename: "js/[name].[hash:4].bundle.js",
  },
  devServer: {
    contentBase: path.resolve(__dirname, "../dist"),
    // 热更新
    open: true,
    // 端口
    port: 8080,
    compress: true,
    hot: true,
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, "css-loader", "postcss-loader"],
      },
      {
        test: /\.less$/,
        use: [
          MiniCssExtractPlugin.loader,
          "css-loader",
          "postcss-loader",
          "less-loader",
        ],
      },
      {
        test: /\.(sass|scss)/,
        use: [
          MiniCssExtractPlugin.loader,
          "css-loader",
          "postcss-loader",
          "sass-loader",
        ],
      },
    ],
  },
  plugins: [
    //hash选项的作用是 给生成的 jshash 值，该 hash 值是该次 webpack 编译的 hash 值。默认值为 false
    new HtmlWebpackPlugin({
      template: "public/index.html",
      inject: "body",
      // hash: false
    }),
    new MiniCssExtractPlugin({
      // 这里我们注意一下 在开发环境中 我们不加上hash
      // 在生产环境 我们使用hash
      filename: "css/[name].css",
      chunkFilename: "css/[id].css",
    }),
    new webpack.HotModuleReplacementPlugin(),
  ],
});
```

开发环境打包压缩之类的就不需要了,那么 css 引入还是有两钟方式：

1. 继续以文件方式 MiniCssExtractPlugin 中将 hash 去掉
2. 以 style 引入那么就不要用 MiniCssExtractPlugin 引入 css,改用 style-loader 引入 css

到这里我们已经实现了一个简单的 react 脚手架,不过我还需要进一步优化

### 添加图片的 loader

file-loader 可以对图片文件进行打包，但是 url-loader 可以实现 file-loader 的所有功能，且能在图片大小限制范围内打包成 base64 图片插入到 js 文件中，这样做的好处是什么呢？先一步一步走着！

#### 安装 url-loader

这里需要注意，url-loader 依赖于 file-loader，所有我们两个 loder 都要安装

```js
npm i file-loader url-loader -D //npm install file-loader url-loader --save-dev
```

在 app.js 引入图片

```js
import React from "react";
import "./app.scss";
import background from "./asset/img/background.png";

function App() {
  return (
    <div className="app">
      <h1 className="text">Hello Webpack</h1>
      <img className="background" src={background} alt="" />
    </div>
  );
}

export default App;
```

并且使用一张 css 引入

```scss
.App {
  height: 400px;
  display: flex;
  justify-content: center;
  align-items: center;
  div {
    width: 100%;
    height: 200px;
    background: url("./assets/img/background.jpg");
  }
  img {
    height: 200px;
  }
  h1 {
    font-size: 16px;
    color: #fff;
  }
}
```

执行 npm run build ,你会发现 css 的图片没有,

> 在打开 index.js 之后你会发现你的图片路径是 images/background.jpg,很明显你的图片路径不正确,因为你的 css 和 index.html 是不同级的 index.html 在 dist 的下面,而 css 在 dist/css 下载
> 在 webpack.prod.config.js 中有处理图片的 loader 你可以修改 options

```js
  options: {
    // options中的[name].[ext]表示，输出的文件名为 原来的文件名.后缀 ；
    name: '[name].[ext]',
    // outputPath是输出到dist目录下的路径，即dist/images/...  ；
    outputPath: 'images/',
    // limit表示，如果你这个图片文件大于8192b，即8kb，转而去使用file-loader，
    // 减少了http请求，但是如果文件过大，js文件也会过大，得不偿失，这是为什么有limit的原因！
    limit: 8192,
    // publicPath设置图片片引入路径
+   publicPath: '../images/'
},

```

修改完之后 npm run build
聪明的同学你一定会反应过来 index.html 的图片路径是不对的
可以修改 webpack.prod.config.js 中 sass css less 将其 MiniCssExtractPlugin 改成 options 配置参数

```js
{
  test: /\.(sass|scss)/,
  use: [
    {
      loader:MiniCssExtractPlugin.loader,
      options: {
          publicPath: '../'
      }
    },
    "css-loader",
    "postcss-loader",
    "sass-loader"
  ]
},
```

> 同理 webpack.dev.config.js 也需要这样配置,
> 但是如果我们 在 development 中使用的是 style-loader 那么我们的不需要配置,以在 style 标签里,路径和 index.html 中是一样的
> 解决博客[https://blog.csdn.net/a806488840/article/details/80920291?depth_1-utm_source=distribute.pc_relevant.none-task&utm_source=distribute.pc_relevant.none-task](https://blog.csdn.net/a806488840/article/details/80920291?depth_1-utm_source=distribute.pc_relevant.none-task&utm_source=distribute.pc_relevant.none-task)

### 添加字体图标 loader

字体图标需要我们之前已经安装过的 file-loader
可以在 package.json 中 j 检查确定有没有安装
图标就不细说了,因为大部分要求项目不一样

在 webpack.common.config.js 里配置

```js
module: {
  rules: [
    //...
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
  ];
}
```

### 最后我们还需要一个报错的配置 source-map

这个不需要我们下载,直接在 webpack.common.config.js 配置

```js
module.exports = {
    devtool:"cheap-module-eval-source-map",
    entry...
    // 现在的webpack高级版本应该不需要这个配置浏览器也会报错
    // 那我为什么还要写呢？毕竟还有用较低版本的同学。。。
}
```

这些基本的配置完毕之后我还可以配置一些其他东西

### process.env

这里的 process.env 就是 Nodejs 提供的一个 API,
可以直接在 webpack.conmmon.config.js 中 输出这个对象

```js
const path = require('path')
console.log( process,'process-------')
module.exports = {
    devtool:"cheap-module-eval-source-map",
    entry...
// 由于这个对象包含的东西太多就不展示了,我们可以看到里面有一个env
```

在这个 env 中我们可以这样配置

```js
let TARGET = process.env.npm_lifecycle_event; // 是build，还是start
let isDev = process.env.NODE_ENV; // 判断是production 还是 development
console.log(TARGET, isDev);
```

不过在这之前我们还在要 package.json 中配置,可以理解为传递参数
在不同的系统比如 window 环境变量的命令也有 **不同** 可以用 cross-env 统一

> npm i --save-dev cross-env

```json
{
  ...
  "scripts": {
    "build": "cross-env NODE_ENV=production webpack --config build/webpack.config.js"
  }
}
```

这样我们可以通过 isDev 这个变量去控制我们的参数

```js
module.exports = {
  mode: isDev === "production" ? "production" : "development",
};
```

### 还可以配置 resolve

```js
resolve: {
    extensions: ['.js', '.jsx', '.json', '.less', '.scss'],
    modules: [ path.resolve(__dirname, 'src'), 'node_modules' ],
    alias: {
      _components: path.join(__dirname, '../src/components'),
      _images: path.join(__dirname, '../src/images'),
      _pages: path.join(__dirname, '../src/pages'),
      _font: path.join(__dirname, '../src/font'),
      _util: path.join(__dirname, '../src/util'),
      _mock: path.join(__dirname, '../src/mock'),
    }
  },
  // 我们平时引入文件时 通过 import from 引入一个文件 例：import Home from "../src/pages/Home"
  // alias的作用就是 import Home from "_pages/Home" 这样就可以方便快捷的找到Home 并且通过 path 所以我们不用担 // 心文件路径不对的问题，因为我们使用的是绝对路径

  // modules 去哪里寻找第三方模块 默认就是node_modules 简单来说你有许多模块都是在 components文件 中导入
  // 原本你可能需要这样一个很长的路径 import '../../../components/button
  // 设置好 modules 之后 你只需要import 'button'

```

[https://www.cnblogs.com/joyco773/p/9049760.html](https://www.cnblogs.com/joyco773/p/9049760.html)

现在我们的基本配置就这些了 !!!

当然只有这些我们的项目还不够丰满,

后续我将会介绍如何在我们自己的"脚手架"中添加更多的模块

比如 antd UI 或者是 Mobx 再或者我们将使用 ts 来完成我们的项目

rrweb web 重播库

> 简单来说点击录制之后，开始记录鼠标位置，并且监听 dom 并且存到数组

具体的使用 [https://github.com/rrweb-io/rrweb/blob/master/guide.zh_CN.md](https://github.com/rrweb-io/rrweb/blob/master/guide.zh_CN.md)

我觉得他们的 github 要比我自己写的好

11

### Proxy 和 mock 和 模块懒加载

> proxy 在 devServer 中配置

```js
  devServer:{
    proxy:{
      // 如果是 接口开口 加上 api 将会触发此代理
      "/api":{
        targrt: "", //地址
        //如果设置成true：发送请求头中host会设置成target·
        changeOrigin：true,
        pathRewrite:{
          // api
          "^api/":""
        }
      }
    }
  }
```

> mock 有了 mock 数据那么很多时候在没有后端时我们依然可以工作
> 下载 mocker-api

```npm
npm i mocker-api -D
```

在根目录 创建 mock 文件夹在里面创建 index.js

在 index 中我们可以写一个对象来模拟数据

```js
const proxy = {
  "GET /mock/user": { id: 1, username: "kenny", sex: 6 },
  "GET /mock/user/list": [
    { id: 1, username: "kenny", sex: 6 },
    { id: 2, username: "kenny", sex: 6 },
  ],
  "POST /mock/login/account": (req, res) => {
    const { password, username } = req.body;
    if (password === "888888" && username === "admin") {
      return res.send({
        status: "ok",
        code: 0,
        token: "sdfsdfsdfdsf",
        data: { id: 1, username: "kenny", sex: 6 },
      });
    } else {
      return res.send({ status: "error", code: 403 });
    }
  },
  "DELETE /mock/user/:id": (req, res) => {
    console.log("---->", req.body);
    console.log("---->", req.params.id);
    res.send({ status: "ok", message: "删除成功！" });
  },
};
module.exports = proxy;
```

在 webpack.dev.config.js 中

```js
const apiMocker = require("mocker-api")
devServer:{
  before(mock){
    // 注意地址不要写错哦 __dirname 时当前文件的绝对路径
    apiMocker(mock,path.resolve(__dirname,"../mock"))
  }
}
```

之后我们发送 ajax 请求就可以啦 接口前记得加 mock
请求推荐使用 axios,就不再介绍了
