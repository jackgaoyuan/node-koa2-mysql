const Router = require('koa-router')
const { TokenValidator, NotEmptyValidator } = require('../../validators/validator')
const { LoginType } = require('../../lib/const')
const { User } = require('../../models/user')
const { generateToken } = require('../../core/util')
const { Auth } = require('../../middleware/auth')
const { WXManager } = require('../../services/wx')

const router = new Router({
  prefix: '/v1/token' // 设置该router挂载的请求的前缀
})

router.post('/', async (ctx) => {
  const v = await new TokenValidator().validate(ctx)
  const { account, type, secret } = ctx.request.body
  let token
  switch (type) {
    case LoginType.USER_EMAIL:
      token = await emailLogin(account, secret)
      break
    case LoginType.USER_MINI_PROGRAM:
      token = await WXManager.codeToToken(account)
      break
    default:
      throw new global.errs.ParameterException('没有相应的处理函数')
  }
  ctx.body = {
    token
  }
})
 
router.post('/verify', async (ctx) => {
  const v = await new NotEmptyValidator().validate(ctx)
  const { token } = ctx.request.body || {}
  const result = Auth.verifyToken(token)
  ctx.body = {
    is_valid: result
  }
})

const emailLogin = async (account, secret) => {
  const user = await User.verifyEmailPassword(account, secret) // 验证用户登陆信息
  const token = generateToken(user.id, Auth.USER) // 根据用户id生成token
  return token
}

module.exports = router