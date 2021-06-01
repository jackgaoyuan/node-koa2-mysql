const Router = require('koa-router')
const { HotBook } = require('../../models/hotBook')

const router = new Router({ prefix: '/v1/book' })

router.get('/hot_book', async (ctx, next) => {
  const favors = await HotBook.getAll()
  ctx.body = { books: favors }
})
// 将图书基础数据做成一个服务

module.exports = router
