const basicAuth = require('basic-auth')
const jwt = require('jsonwebtoken')

class Auth {
  constructor(level) { // API的level
    this.level = level || 1
  }

  get m() { // 返回验证middleware
    return async (ctx, next) => {
      // token 检测
      const userToken = basicAuth(ctx.request) // Basic Auth进行验证
      let decode = {}
      if (!userToken || !userToken.name) {
        throw new global.errs.Forbbiden('没有token')
      }
      // 解析jwt payload
      try {
        // jwt通过secret反解出jwt的payload
        decode = jwt.verify(userToken.name, global.config.security.secretKey)
      } catch(error) {
        // token过期
        if (error.name === 'TokenExpiredError') {
          throw new global.errs.Forbbiden('token已过期')
        }
        // token不合法
        throw new global.errs.Forbbiden('token不合法')
      }
      if (decode.scope < this.level) {
        throw new global.errs.Forbbiden('权限不足')
      }
      // 将jwt的payload挂载到ctx上，后面的middleware可以获取并使用
      ctx.auth = { uid: decode.uid, scope: decode.scope }
      await next()
    }
  }
  static verifyToken(token) {
    try {
      jwt.verify(token, global.config.security.secretKey)
      return true
    } catch(e) {
      return false
    }
  }
}

module.exports = {
  Auth
}