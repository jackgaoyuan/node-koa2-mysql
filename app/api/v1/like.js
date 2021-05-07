const Router = require('koa-router')
const { Favor } = require('../../models/favor')
const { Auth } = require('../../middleware/auth')
const { LikeValidator } = require('../../validators/validator')
const { success } = require('../../lib/helper')

const router = new Router({ prefix: '/v1/like' })

router.post('/', new Auth().m, async ctx => {
  const v = await new LikeValidator().validate(ctx, { id: 'art_id' }) // validator第二个参数定义别名
  const { art_id, type } = ctx.request.body
  await Favor.like(art_id, type, ctx.auth.uid)
  success()
})

router.post('/cancel', new Auth().m, async ctx => {
  const v = await new LikeValidator().validate(ctx, { id: 'art_id' }) // validator第二个参数定义别名,validator原本检测id，现在检测art_id
  const { art_id, type } = ctx.request.body
  await Favor.dislike(art_id, type, ctx.auth.uid)
  success()
})

module.exports = router