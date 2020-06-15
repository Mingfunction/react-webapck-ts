const merge  = require('webpack-merge');
const common = require('./webpack.common.config')
const path = require('path')

const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const apiMocker = require('mocker-api');

module.exports = merge( common, {
	// 生产环境 可选production（默认）/ development / none
    mode:"development",
    output:{
        filename:"js/[name].[hash:4].bundle.js",
    },
    devServer: {
		before(mock){
			apiMocker(mock,path.resolve(__dirname,"../mock/index"))
		},
		// mock数据配置
        contentBase: path.resolve(__dirname, '../dist'),
        // 是否自动打开一个新窗口
        open: true, 
        // 端口
        port: 8080,
        compress: true,
        // 设置devServer.hot为true，并且在plugins中引入HotModuleReplacementPlugin插件即可。
	    // 还需要注意的是我们开启了hot，那么导出不能使用chunkhash，需要替换为hash。
	    // 之前我们试过hash会不停的更换名字
		hot: true,
		// 启用热模块替换，而不会在构建失败时将页面刷新作为后备。
		// hotOnly: true
		proxy:{
			"/mock":{
				target:"http://127.0.0.1:8080",
				changeOrigin:true,
				pathRewrite:{
					"^/mock":""
				}
			}
		}
    },
    module:{
		rules:[
			{
				test:/\.css$/,
				use:[
                    // link的方式引入
					MiniCssExtractPlugin.loader,
                    "css-loader",
                    // 增加浏览器的前缀 有postcss.congfig.js文件
					"postcss-loader"
				]
			},
			{
				test:/\.less$/,
				use:[
					MiniCssExtractPlugin.loader,
					"css-loader",
					"postcss-loader",
					"less-loader"
				]
			},
			{
				test:/\.(sass|scss)/,
				use:[
					{ 
						loader: MiniCssExtractPlugin.loader,
						options:{
							publicPath:"../"
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
    plugins:[
        //hash选项的作用是 给生成的 jshash 值，该 hash 值是该次 webpack 编译的 hash 值。默认值为 false
        new HtmlWebpackPlugin({
            template:"public/index.html",
            inject: 'body',
            // hash: false
        }),
        new MiniCssExtractPlugin({
			// 这里我们注意一下 在开发环境中 我们不加上hash
			// 在生产环境 我们使用hash
			filename: 'css/[name].css',
      		chunkFilename: 'css/[id].css',
        }),
        // HotModuleReplacementPlugin是webpack热更新的插件，设置devServer.hot为true
        new webpack.HotModuleReplacementPlugin()
    ]
})