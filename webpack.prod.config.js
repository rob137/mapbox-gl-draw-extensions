const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: './index.js',
    output: {
        path: path.resolve(__dirname, './dist'),
        filename: 'mapbox-gl-draw-extensions.js',
        library: 'MapboxDraw',
        libraryTarget: 'umd',
        libraryExport: 'default'
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
