const Router = require('koa-router')
const _ = require('lodash')
const { PositiveIntegerValidator } = require('../../validators/validator')
const { Auth } = require('../../middleware/auth')
const { SCOPE } = require('../../lib/const')
const { Movie, Sentence, Music } = require('../../models/classic')
const { Flow } = require('../../models/flow')
const { Art } = require('../../models/art')

const router = new Router({ prefix: '/v1/classic' })

router.get('/latest', new Auth(SCOPE.USER).m, async (ctx, next) => {
  // 权限系统分级，不同角色有不同的权限，通过scope来实现分级
  // 每个API也有一个level，scope大于API的level，则用户可以访问
  const flow = await Flow.findOne({
    order: [
      ['index', 'DESC']
    ]
  })

  const art = await Art.getData(flow.art_id, flow.type)
  // 序列化：对象转换成可传输格式的过程，node中序列化是将object转换成json格式
  // 如果想设置sequalize对象的值，不能直接用art.index = flow.index,因为sequalize
  // 的值在art.dataValues里面，最好使用sequalize内置方法setDataValue改变值
  art.setDataValue('index', flow.index)
  ctx.body = art
})

module.exports = router
