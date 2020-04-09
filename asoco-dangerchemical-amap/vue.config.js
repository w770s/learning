const webpack = require('webpack')

module.exports = {
  configureWebpack: {
    externals: {
      inMap: 'inMap',
      BMap: 'BMap',
      $: 'jquery',
      jQuery: 'jquery',
      AMap: 'AMap',
      BMapLib: 'BMapLib'
    },
    plugins: [
      new webpack.ProvidePlugin({
        $: 'jquery',
        jQuery: 'jquery',
        'windows.jQuery': 'jquery',
        BMapLib: 'BMapLib',
        'windows.BMapLib': 'BMapLib'
      })
    ]
  },
  devServer: {
    proxy: {
      '/api': {
        target: 'http://192.168.2.216:8888/api',
        pathRewrite: { '^/api': '' },
        changeOrigin: true
      },
      'api/whp-xt': {
        // 配置好后一定要关闭原来的server，重新npm run dev启动项目。不然无效
        // target: 'http://192.168.1.222:9001/',
        // target: 'http://whpgylxt-xt.iasoco.com',
        target: 'http://192.168.1.217:31245',
        // target: 'http://192.168.2.216:8888/api',
        // target: 'http://192.168.109.134:9989/',
        pathRewrite: { '^/api/whp-xt': '' },
        changeOrigin: true
      }
    }
  }
}
