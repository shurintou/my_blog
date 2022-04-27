const path = require('path')
const PrerenderSPAPlugin = require('@dreysolano/prerender-spa-plugin')
const overrideFunc = function override(config, env) {
    if (env === 'production') {
        config.plugins = config.plugins.concat([
            new PrerenderSPAPlugin({
                routes: ['/', '/about', '/home'],
                staticDir: path.join(__dirname, 'build'),
            }),
        ])
    }
    return config
}

module.exports = overrideFunc