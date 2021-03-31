const { HttpException } = require('../core/http-exception')

const catchError = async (ctx, next) => {
  try {
    await next()
  } catch (error) {
    const isHttpException = error instanceof HttpException
    const isDev = global.config.environment === 'dev'

    // 如果是在dev环境，并且是未知异常，则在terminal中抛出
    if (isDev && !isHttpException) {
      throw error
    }

    if (isHttpException) { //判断是否已知错误
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
