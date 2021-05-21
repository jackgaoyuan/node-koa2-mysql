const Router = require('koa-router')
const _ = require('lodash')
const { PositiveIntegerValidator, ClassicValidator } = require('@validators/validator')
const { Auth } = require('../../middleware/auth')
const { SCOPE } = require('../../lib/const')
const { Movie, Sentence, Music } = require('../../models/classic')
const { Flow } = require('../../models/flow')
const { Art } = require('../../models/art')
const { Favor } = require('@models/favor') // 使用别名改写
const { parse } = require('basic-auth')

const router = new Router({ prefix: '/v1/classic' })

// 获取最新的期刊
router.get('/latest', new Auth(SCOPE.USER).m, async (ctx) => {
  // 权限系统分级，不同角色有不同的权限，通过scope来实现分级
  // 每个API也有一个level，scope大于API的level，则用户可以访问
  const flow = await Flow.findOne({
    order: [
      ['index', 'DESC']
    ]
  })

  const art = await Art.getData(flow.art_id, flow.type)
  // 获取用户对一个art的点赞信息
  const like_status = await Favor.userLikeIt(flow.art_id, flow.type, ctx.auth.uid)
  // 序列化：对象转换成可传输格式的过程，node中序列化是调用object的toJson方法将object转换成json格式
  // 如果想设置sequalize对象的值，不能直接用art.index = flow.index,因为sequalize
  // 的值在art.dataValues里面，最好使用sequalize内置方法setDataValue改变值
  art.setDataValue('index', flow.index)
  art.setDataValue('like_status', like_status)
  ctx.body = art
})

// 获取特定期刊详情
router.get('/:type/:id', new Auth().m, async (ctx) => {
  const v = await new ClassicValidator().validate(ctx)
  const id = v.get('path.id')
  const type = parseInt(v.get('path.type'))
  const art = await Art.getData(id, type)
  ctx.body = art
})

// 获取当前一期的下一期
router.get('/:index/next', new Auth().m, async (ctx) => {
  const v = await new PositiveIntegerValidator().validate(ctx, {
    id: 'index'
  })
  const index = v.get('path.index')

  const flow = await Flow.findOne({
    where: { index: index + 1 }
  })
  if (!flow) {
    throw new global.errs.NotFound()
  }
  const art = await Art.getData(flow.art_id, flow.type)
  const like_status = await Favor.userLikeIt(flow.art_id, flow.type, ctx.auth.uid)
  art.setDataValue('index', flow.index)
  art.setDataValue('like_status', like_status)
  ctx.body = art
})

// 获取当前一期的上一期
router.get('/:index/previous', new Auth().m, async (ctx) => {
  const v = await new PositiveIntegerValidator().validate(ctx, {
    id: 'index'
  })
  const index = v.get('path.index')

  const flow = await Flow.findOne({
    where: { index: index - 1 }
  })
  if (!flow) {
    throw new global.errs.NotFound()
  }
  const art = await Art.getData(flow.art_id, flow.type)
  const like_status = await Favor.userLikeIt(flow.art_id, flow.type, ctx.auth.uid)
  art.setDataValue('index', flow.index)
  art.setDataValue('like_status', like_status)
  ctx.body = art
})

// 获取特定一期的点赞信息
router.get('/:type/:id/favor', new Auth().m, async (ctx) => {
  const v = await new ClassicValidator().validate(ctx)
  const id = v.get('path.id')
  const type = parseInt(v.get('path.type'))
  const art = await Art.getData(id, type)
  if (!art) { // 如果art不存在抛出异常
    throw new global.errs.NotFound()
  }
  const like_status = await Favor.userLikeIt(id, type, ctx.auth.uid)
  ctx.body = {
    fav_nums: art.fav_nums,
    like_status
  }
})

// 获取用户所有点赞期刊列表
router.get('/favor', new Auth().m, async ctx => {
  const uid = ctx.auth.uid
})


module.exports = router
