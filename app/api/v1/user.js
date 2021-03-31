const Router = require('koa-router')
const { RegisterValidator } = require('../../validators/validator')
const { User } = require('../../models/user')
const { success } = require('../../lib/helper')

const router = new Router({
  prefix: '/v1/user' // 设置该router挂载的请求的前缀
})

// 注册，新增数据
router.post('/register', async (ctx = {}) => {
  // validator应该放在第一行，如果验证失败会抛出error，下面的程序就不会被执行
  const v = await new RegisterValidator().validate(ctx)
  const { email, password1, password2, nickname } = ctx.request.body

  const user = {
    email,
    password: password1,
    nickname,
  }
  await User.create(user)
  success()
})

module.exports = router
