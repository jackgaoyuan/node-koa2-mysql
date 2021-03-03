const Router = require('koa-router')
const requireDirectory = require('require-directory')
const bodyParser = require('koa-bodyparser')

const catchError = require('../middleware/exception')


class InitManager {
  static initCore(app) {
    app.use(catchError) // 全局异常处理，必须放到注册路由的前面
    app.use(bodyParser()) // 请求的body parser,也需要放到注册路由前面
    InitManager.initLoadRouters(app)
  }

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
