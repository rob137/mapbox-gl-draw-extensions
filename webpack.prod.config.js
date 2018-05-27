const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: './examples/app.js',
    output: {
        path: path.resolve(__dirname, './dist'),
        filename: 'mapbox-gl-draw-extensions.js'
    },
    node: {
        fs: "empty"
    },
    mode: 'production',
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
                test: /\.(png|gif|jpe?g|svg|xml|json)$/,
                use: ['url-loader']
            }
        ]
    }
}
