const Router = require('koa-router')
const errs = require('../core/http-exception')
const requireDirectory = require('require-directory')
const bodyParser = require('koa-bodyparser')

const catchError = require('../middleware/catchErrorMiddleware')


class InitManager {
  static initCore(app) {
    InitManager.loadConfig() // 挂载全局变量
    app.use(catchError) // 全局异常处理，必须放到注册路由的前面
    app.use(bodyParser()) // 请求的body parser,也需要放到注册路由前面
    InitManager.initLoadRouters(app)
  }
  // 获取config文件，将config里面的配置挂载到global上
  static loadConfig(path = '') {
    const configPath = path || process.cwd() + '/app/config/config.js'
    const config = require(configPath)
    global.config = config
    global.errs = errs
  }
  // 读取/app/api下的文件，将每个router注册到app上
  static initLoadRouters(app) {
    const whenLoadModule = (obj) => {
      if (obj instanceof Router) {
        app.use(obj.routes())
      }
    }
    const apiDirectory = `${process.cwd()}/app/api`
    requireDirectory(module, apiDirectory, { visit: whenLoadModule })    
  }
}

module.exports = InitManager
