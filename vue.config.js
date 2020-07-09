const path = require('path')
//
const resolve = dir => {
  return path.join(__dirname, dir)
}
const Pages = require('./VueConf')
const Type = require('./Type').Type
const Merge = require('webpack-merge')
// 项目部署基础
// 默认情况下，我们假设你的应用将被部署在域的根目录下,
// 例如：https://www.my-app.com/
// 默认：'/'
// 如果您的应用程序部署在子路径中，则需要在这指定子路径
// 例如：https://www.foobar.com/my-app/
// 需要将它改为'/my-app/'
const BASE_URL = process.env.NODE_ENV === 'production'
  ? './'
  : '/'
module.exports = Merge({
  // Project deployment base
  // By default we assume your app will be deployed at the root of a domain,
  // e.g. https://www.my-app.com/
  // If your app is deployed at a sub-path, you will need to specify that
  // sub-path here. For example, if your app is deployed at
  // https://www.foobar.com/my-app/
  // then change this to '/my-app/'
  publicPath: BASE_URL,
  // tweak internal webpack configuration.
  // see https://github.com/vuejs/vue-cli/blob/dev/docs/webpack.md
  // 如果你不需要使用eslint，把lintOnSave设为false即可
  lintOnSave: false,
  chainWebpack: config => {
    config.resolve.alias
      .set('@', resolve('src')) // key,value自行定义，比如.set('@@', resolve('src/components'))
      .set('_c', resolve('src/components'))
    // config.externals = {
    //   $: 'jquery'
    // }
  },
  // 打包时不生成.map文件
  productionSourceMap: false,
  transpileDependencies: [
    /\bvue-awesome\b/
  ],
  // 这里写你调用接口的基础路径，来解决跨域，如果设置了代理，那你本地开发环境的axios的baseUrl要写为 '' ，即空字符串
  devServer: {
    port: 8081,
    proxy: {
      '/api/': {
        target: 'http://192.168.100.11:10086', // 设置你调用的接口域名和端口号 别忘了加http
        // target: 'http://60.169.77.187:10086',
        changeOrigin: true,
        secure: false,
        pathRewrite: {
          '^/api/': '/'// 这里理解成用‘/api’代替target里面的地址，后面组件中我们掉接口时直接用api代替 比如我要调用'http://40.00.100.100:3002/user/add'，直接写‘/api/user/add’即可
        }
      }
    },
    hot: true
  }
}, Pages)
