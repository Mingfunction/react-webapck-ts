const path = require("path");
const merge = require("webpack-merge");
const common = require("./webpack.common.config");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const UglifyjsWebpackPlugin = require('uglifyjs-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCssAssetsWebpackPlugin = require('optimize-css-assets-webpack-plugin')

module.exports = merge(common, {
	mode: "production",
	module: {
		rules: [
			{
				test: /\.css$/,
				use: [
					// link文件引入
					{
						loader: MiniCssExtractPlugin.loader,
						// 修改scss打包后引入图片的路径
						options: {
							publicPath: '../'
						}
					},
					"css-loader",
					"postcss-loader"
				]
			},
			{
				test: /\.less$/,
				use: [
					{
						loader: MiniCssExtractPlugin.loader,
						// 修改scss打包后引入图片的路径
						options: {
							publicPath: '../'
						}
					},
					"css-loader",
					"postcss-loader",
					"less-loader"
				]
			},
			{
				test: /\.(sass|scss)/,
				use: [
					{
						loader: MiniCssExtractPlugin.loader,
						// 修改scss打包后引入图片的路径
						options: {
							publicPath: '../'
						}
					},
					"css-loader",
					"postcss-loader",
					"sass-loader"
				]
			},
			{
				test: /\.(jpg|png|gif)$/,
				use: {
					// 遇到以jpg,png,gif为后缀的文件，使用url-loader进行预处理；
					loader: 'url-loader',
					options: {
						// options中的[name].[ext]表示，输出的文件名为 原来的文件名.后缀 ；
						name: '[name].[ext]',
						// outputPath是输出到dist目录下的路径，即dist/images/...  ；
						outputPath: 'images/',
						// limit表示，如果你这个图片文件大于8192b，即8kb，转而去使用file-loader，
						// 减少了http请求，但是如果文件过大，js文件也会过大，得不偿失，这是为什么有limit的原因！
						limit: 8192,
						// 设置图片片引入路径
						// publicPath: './dist/images/'
					},
				}
			}
		]
	},
	plugins: [
		// 复制一个 html 并将最后打包好的资源在 html 中引入
		new HtmlWebpackPlugin({
			//filename：打包之后的html文件名字
			filename: "index.html",
			//template：以我们自己定义的html为模板生成，不然我们还要到打包之后的html文件中写
			// 这里有小伙伴可能会疑惑为什么不是 '../public/index.html'
			// 我的理解是无论与要用的template是不是在一个目录，都是从根路径开始查找
			template: "public/index.html",
			// inject：在body最底部引入js文件，如果是head，就是在head中引入js,false不生成js
			inject: "body",
			// 压缩文件
			minify: {
				//去除注释
				removeComments: true,
				//collapseWhitespace：去除空格
				collapseWhitespace: true,
			}
		}),
		// 项目里有改动才会有新的包 打包编译前清理dist目录
		new CleanWebpackPlugin({
			cleanOnceBeforeBuildPatterns: [path.resolve(process.cwd(), "dist/*")]
		}),
		new MiniCssExtractPlugin({
			// 这里我们注意一下 在开发环境中 我们不加上hash
			// 在生产环境 我们使用hash
			filename: 'css/[name].[hash].css',
			chunkFilename: 'css/[id].[hash].css',
		})
	],
	optimization: {
		minimizer: [
			// 压缩js代码
			new UglifyjsWebpackPlugin(),
			// 压缩css代码
			new OptimizeCssAssetsWebpackPlugin({
				// 正则表达式，用于匹配需要优化或者压缩的资源名。默认值是/.css$/g	
				assetNameRegExp: /\.css$/g,
				// 用于压缩和优化CSS 的处理器，默认是 cssnano.
				cssProcessor: require("cssnano"),
				// 	传递给cssProcessor的插件选项，默认为{}
				cssProcessorPluginOptions: {
					//	预设： '默认'，		  丢弃注释：		删除全部注释 
					preset: ['default', { discardComments: { removeAll: true } }]
				},
				//表示插件能够在console中打印信息，默认值是true
				canPrint: true,
			}),
		],
		splitChunks: {
			chunks: 'all',
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
					enforce: true
				},
				//vendors这个缓存组，它的test设置为 /node_modules/ 表示只筛选从node_modules文件夹下引入的模块，所以所有第三方模块才会被拆分出来。
				vendors: {
					//优先级
					priority: -10,
					test: /node_modules/,
					name: "vendor",
					// 是否执行
					enforce: true,
				},
			}
		}
	},
})