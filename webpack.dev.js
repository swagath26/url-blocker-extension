const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyPlugin = require('copy-webpack-plugin')

module.exports = {
    entry: './src/index.js',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].js',
        // filename: 'bundle.js',
    },
    mode: 'development',
    devtool: 'inline-source-map',
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env', '@babel/preset-react'],
                    },
                },
            },
            {
                test: /\.css$/,
                // use: ['style-loader', 'css-loader'],
                use: [MiniCssExtractPlugin.loader, 'css-loader'],
            },
            {
                test: /\.svg$/,
                // use: ['style-loader', 'css-loader'],
                use: [
                    {
                        loader: 'svg-url-loader',
                        options: {
                            limit: 10000,
                        }
                    }
                ],
            },
        ],
    },
    // resolve: {
    //     extensions: ['.js', '.jsx'],
    // },
    plugins: [
        new HtmlWebpackPlugin({
            template: './public/index.html',
            filename: 'popup.html',
        }),
        new MiniCssExtractPlugin(),
        new CopyPlugin({
            patterns: [
                {
                    from: 'public',
                }
            ]
        })
    ],
    // devServer: {
    //     static: {
    //         directory: path.join(__dirname, 'dist'),
    //     },
    //     compress: true,
    //     port: 3000,
    // },
};