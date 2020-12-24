function Crossorigin({
    scripts = true,
    link = true
} = {}) {
    this.options = {
        scripts,
        link
    };
}

Crossorigin.prototype.apply = function (compiler) {
    compiler.hooks.make.tapPromise(
        'Crossorigin',
        async compilation => {

            // Hook into the html-webpack-plugin processing and add the html
            const HtmlWebpackPlugin = compiler.options.plugins
                .map(({ constructor }) => constructor)
                .find(
                    constructor =>
                        constructor && constructor.name === 'HtmlWebpackPlugin'
                );

            if (HtmlWebpackPlugin) {
                if (HtmlWebpackPlugin.getHooks === 'undefined') {
                    return compilation.errors.push(
                        new Error(
                            `Crossorigin - This Crossorigin version is not compatible with your current HtmlWebpackPlugin version. \n
                            Please upgrade to HtmlWebpackPlugin >= 4
                            `
                        )
                    );
                }
                HtmlWebpackPlugin.getHooks(compilation).alterAssetTags.tapAsync(
                    'Crossorigin',
                    (htmlPluginData, htmlWebpackPluginCallback) => {
                        try {
                            const { scripts, styles } = htmlPluginData.assetTags;
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
                            compilation.errors.push(e);
                        }
                        htmlWebpackPluginCallback(null, htmlPluginData);
                    }
                );
            }
        }
    );

};

module.exports = Crossorigin;
