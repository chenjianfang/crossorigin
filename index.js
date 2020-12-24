const oldHtmlWebpackPlugin = function(htmlPluginData, htmlWebpackPluginCallback) {
    try {
        const {head, body} = htmlPluginData;
        if (this.options.link) {
            head.forEach((item) => {
                if (item.tagName === 'link') {
                    item.attributes.crossorigin = "anonymous"
                }
            });
        }

        if (this.options.scripts) {
            body.forEach((item) => {
                if (item.tagName === 'script') {
                    item.attributes.crossorigin = "anonymous"
                }
            });
        }
    } catch (e) {
        console.error(e);
    }
    htmlWebpackPluginCallback(null, htmlPluginData);
};

const newHtmlWebpackPlugin = function(htmlPluginData, htmlWebpackPluginCallback) {
    try {
        const {scripts, styles} = htmlPluginData.assetTags;
        if (this.options.scripts) {
            scripts.forEach((item) => {
                item.attributes = {
                    ...item.attributes,
                    crossorigin: "anonymous"
                }
            });
        }

        if (this.options.link) {
            styles.forEach((item) => {
                item.attributes = {
                    ...item.attributes,
                    crossorigin: "anonymous"
                }
            });
        }

    } catch (e) {
        console.error(e);
    }
    htmlWebpackPluginCallback(null, htmlPluginData);
};

function CrossoriginPlugins({
    scripts = true,
    link = true
} = {}) {
    this.options = {
        scripts,
        link
    };
}

CrossoriginPlugins.prototype.apply = function (compiler) {
    const self = this;
    // Hook into the html-webpack-plugin processing and add the html
    const HtmlWebpackPlugin = compiler.options.plugins
        .map(({constructor}) => constructor)
        .find(
            constructor =>
                constructor && constructor.name === 'HtmlWebpackPlugin'
        );

    if (HtmlWebpackPlugin && HtmlWebpackPlugin.getHooks) {
        // HtmlWebpackPlugin 4
        compiler.hooks.make.tapPromise(
            'CrossoriginPlugins',
            async compilation => {
                HtmlWebpackPlugin.getHooks(compilation).alterAssetTags.tapAsync(
                    'CrossoriginPlugins',
                    newHtmlWebpackPlugin.bind(self)
                );
            }
        );
    } else if (compiler.hooks) {
        // HtmlWebpackPlugin 3
        compiler.hooks.compilation.tap('CrossoriginWebpackPlugin', compilation => {
            compilation.hooks.htmlWebpackPluginAlterAssetTags.tapAsync(
                'CrossoriginWebpackPlugin',
                oldHtmlWebpackPlugin.bind(self)
            );
        })
    } else {
        // HtmlWebpackPlugin 2
        compiler.plugin('compilation', compilation => {
            compilation.plugin(
                'html-webpack-plugin-alter-asset-tags',
                oldHtmlWebpackPlugin.bind(self)
            )
        })
    }
};

module.exports = CrossoriginPlugins;
