const CracoLessPlugin = require('craco-less')
import config from './src/config/config'

export { }

module.exports = {
    plugins: [
        {
            plugin: CracoLessPlugin,
            options: {
                lessLoaderOptions: {
                    lessOptions: {
                        modifyVars: {
                            '@primary-color': config.antdProps.themeColor,
                            '@layout-header-background': config.antdProps.themeColor,
                            '@menu-dark-bg': '@layout-header-background'
                        },
                        javascriptEnabled: true,
                    },
                },
            },
        },
    ],
}