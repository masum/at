const webpack = require('webpack');
const path = require('path')

const src = __dirname + "/client";
const dist = __dirname + "/pub"

const UglifyJSPlugin = require('uglifyjs-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')

const bootstrap = {
    entry:[
      __dirname + '/node_modules/bootstrap/dist/css/bootstrap.css'
    ],
    output: {
        path: dist + '/css/',
        filename: 'bootstrap.css'
    },
    resolve: {
        modules: [
            path.resolve(__dirname,'../node_modules')
        ]
    },
    module: {
        loaders: [
            {
                test: /\.css$/,
                loader: ExtractTextPlugin.extract("css-loader")
            },
            {
                test: /\.(woff|woff2|eot|ttf|svg)$/,
                loader: 'file-loader?name=../font/[name].[ext]'
            }
        ]
    },
    plugins: [
      new ExtractTextPlugin( "../css/bootstrap.css" )
    ]
};

const app = {
    context: src,
    entry: './js/app.js',
    output: {
        path: dist,
        filename: "app3.min.js"
    },
    module: {
        rules: [
            {
                test: /\.css/,
                use: [
                    'style-loader',
                    {
                        loader: 'css-loader',
                        options: {
                            url: false
                        }
                    }
                ]
            },
            {
                test: /\.html/,
                loader: 'html-loader'
            },
            {
                test: /\.(png|jpg|jpeg)$/,
                loader: 'file-loader?name=./img/[name].[ext]'                
            },
            {
                test: /\.(woff|woff2|eot|ttf|svg)$/,
                loader: 'file-loader?name=./font/[name].[ext]'                
            },
            {
                enforce: "pre",
                test: /\.(js|jsx)$/,
                loader: 'eslint-loader',
                exclude: /node_modules/
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: "./html/index.html"
        }),
        new webpack.ProvidePlugin({
            IScroll: 'iscroll'
        }),
        new webpack.ProvidePlugin({
            jQuery: "jquery",
            $: "jquery"
        })
    ]    
};

module.exports = [app, bootstrap]  