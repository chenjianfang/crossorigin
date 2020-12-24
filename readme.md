## Introduction
Add crossorigin attribute to script tag or link tag

HtmlWebpackPlugin version >= 4
                            
添加crossorigin属性到script和link标签

## Installation
```
npm install --save-dev crossorigin-plugins
```

## API
```
options: {scripts: Boolean, link: Boolean}
- scripts: true // Add crossorigin attribute to script tag, default: true
- link: true // Add crossorigin attribute to link tag, default: true

new CrossoriginPlugins(options)

```


## Usage
```
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CrossoriginPlugins = require('crossorigin-plugins');

const config = {
    mode: "development",
    entry: {
        test: './test/test.js' // Custom entry
    },
    output: {
        filename: '[name].js',
        path: path.join(__dirname, 'dist'), // Custom output
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    {
                        loader: 'css-loader'
                    }
                ]
            },
        ]
    },
    plugins: [
        new MiniCssExtractPlugin(),
        new HtmlWebpackPlugin({
            template: './test/test.ejs' // Custom template
        }),
        new CrossoriginPlugins({
            scripts: true,
            link: true
        }),
    ]
};

module.exports = config;

```
