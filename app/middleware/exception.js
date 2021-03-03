const { HttpException } = require('../core/http-exception')

const catchError = async (ctx, next) => {
  try {
    await next()
  } catch (error) {
    if (error instanceof HttpException) { //判断是否已知错误
      const { msg, errorCode, code } = error
      ctx.body = {
        errmsg: msg,
        error_code: errorCode,
        request_url: `${ctx.method} ${ctx.path}`
      }
      ctx.status = code
    } else {
      ctx.body = {
        msg: '未知异常',
        error_code: 999,
        request_url: `${ctx.method} ${ctx.path}`
      }
      ctx.status = 500
    }
  }
}

module.exports = catchError
