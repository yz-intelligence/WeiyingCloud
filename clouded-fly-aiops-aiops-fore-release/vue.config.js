const path = require('path')
const glob = require('glob')
const webpack = require('webpack')
let cookie = ''
/**
 * 获取全局scss依赖文件
 */
function getGlobalStyleResources(path) {
  const styles = []
  glob.sync(path).forEach(function (filePath) {
    const file = filePath.split('/src/assets').slice(-1)
    styles.push(`@import "~@/assets${file}";`)
  })
  return styles.join('')
}

const globalStyleResources = getGlobalStyleResources(path.resolve(__dirname, './src/assets/styles/**/_*.scss'))
console.log(process.env.VUE_APP_ENV)
module.exports = {
  publicPath: process.env.VUE_APP_ROUTER_BASE,
  // 生产模式生成sourcemap
  productionSourceMap: false,
  outputDir: './dist', // 构建输出目录
  assetsDir: 'assets',
  css: {
    sourceMap: process.env.VUE_APP_ENV === 'dev',
    loaderOptions: {
      sass: {
        // 注入全局的scss依赖，如var、mixins、functions等
        additionalData: globalStyleResources
      }
    }
  },
  chainWebpack: config => {
    config.optimization.minimizer('terser').tap(args => {
      if (process.env.VUE_APP_ENV === 'prod') {
        args[0].terserOptions.compress.drop_console = true
        args[0].terserOptions.compress.drop_debugger = true
      }
      return args
    })
    config.plugin('provide').use(webpack.ProvidePlugin, [
      {
        // other modules
        introJs: ['intro.js']
      }
    ])
    // 页面标题
    config.plugin('html').tap(args => {
      args[0].title = '维鹰云-腾云悦智科技（深圳）有限责任公司'
      return args
    })
    // alias注册
    config.resolve.alias.set('@', path.resolve(process.cwd(), 'src'))

    // es6+转es5兼容低版本和ie
    const entry = config.entry('app')
    entry.add('babel-polyfill').end()
    // 模拟请求-本地开发环境使用
    process.env.VUE_APP_ENV === 'dev' && entry.add('@/mock').end()
  },
  /**
   * 本地开发服务配置
   */
  devServer: {
    port: 8090,
    // contentBase: './dist',
    // publicPath: process.env.VUE_APP_ROUTER_BASE,
    // https: true,
    // compress: true,
    // disableHostCheck: true,
    // overlay: true,
    // headers: {
    //   'X-Custom-Foo': 'bar',
    //   'Access-Control-Allow-Origin': '*',
    //   'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
    //   'Access-Control-Allow-Headers': 'X-Requested-With, content-type,' + ' Authorization'
    // },
    proxy: {
      '/api': {
        target: process.env.VUE_APP_PROXY_URL,
        changeOrigin: true,
        ws: true,
        pathRewrite: {
          '^/api': '/api'
        },
        onProxyReq: proxyReq => {
          if (cookie) {
            proxyReq.setHeader('cookie', cookie)
          }
        },
        onProxyRes: proxyRes => {
          var proxyCookie = proxyRes.headers['set-cookie']
          if (proxyCookie) {
            cookie = proxyCookie
          }
        }
      },
      '/eventbank/apm': {
        target: 'http://106.55.11.219:8200',
        changeOrigin: true,
        ws: true,
        pathRewrite: {
          '^/eventbank/apm': ''
        }
      }
    }
  }
}
