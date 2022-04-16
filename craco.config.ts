const CracoLessPlugin = require('craco-less');

export { }

module.exports = {
    plugins: [
        {
            plugin: CracoLessPlugin,
            options: {
                lessLoaderOptions: {
                    lessOptions: {
                        modifyVars: {
                            '@primary-color': '#1DA57A',
                            '@layout-header-background': '#1DA57A',
                            '@menu-dark-bg': '@layout-header-background'
                        },
                        javascriptEnabled: true,
                    },
                },
            },
        },
    ],
};