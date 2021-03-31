const Router = require('koa-router')
const _ = require('lodash')
const { PositiveIntegerValidator } = require('../../validators/validator')
const { Auth } = require('../../middleware/auth')
const { SCOPE } = require('../../lib/const')
const { Movie, Sentence, Music } = require('../../models/classic')
const { Flow } = require('../../models/flow')

const router = new Router({ prefix: '/v1/classic' })

router.get('/latest', new Auth(SCOPE.USER).m, async (ctx, next) => {
  // 权限系统分级，不同角色有不同的权限，通过scope来实现分级
  // 每个API也有一个level，scope大于API的level，则用户可以访问
  const flow = await Flow.findOne({
    order: [
      ['index', 'DESC']
    ]
  })
  ctx.body = flow
})

module.exports = router