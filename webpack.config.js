module.exports = {
    entry: './www/app.js',

    output: {
        path: './www/dist/',
        filename: 'bundle.js'
    },

    module: {
        loaders: [{
                // HTML LOADER
                test: /\.html$/,
                loader: 'underscore-template-loader'
            }, {
                // JSON LOADER
                test: /\.json$/,
                loader: 'json-loader'
            }, {
                // CSS LOADER
                test: /\.css$/,
                loader: 'style-loader!css-loader'
            },


            {
                test: /\.(ttf|eot|jpg|svg|woff(2)?)(\?[a-z0-9]+)?$/,
                loader: 'file-loader?publicPath=dist/&outputPath=www/dist/'
            }
        ]
    },
};
