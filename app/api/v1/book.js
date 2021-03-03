const Router = require('koa-router')
const router = new Router()

router.get('/v1/book/latest', (ctx, next) => {
  ctx.body = { content: 'v1 book latest' }
})

module.exports = router
