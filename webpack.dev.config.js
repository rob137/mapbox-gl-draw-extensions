const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: './examples/app.js',
    output: {
        path: path.resolve(__dirname, './dist'),
        filename: 'mapbox-gl-draw-extensions.js'
    },
    devServer: {
        contentBase: path.join(__dirname, './dist'),
        compress: true,
        port: 3000
    },
    node: {
        fs: "empty"
    },
    mode: 'development',
    module: {
        rules: [
            {
                test: /\.css$/,
                use: [
                    'style-loader',
                    {
                        loader: 'css-loader',
                        options: {
                            minimize: true
                        }
                    }
                ]
            },
            {
                test: /\.js$/,
                use: ['eslint-loader'],
                include: [path.resolve(__dirname, './src')],
                enforce: 'pre'
            },
            {
                test: /\.(png|gif|jpe?g|svg|xml|json)$/,
                use: ['url-loader']
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './examples/index.html'
        }),
    ]
}
