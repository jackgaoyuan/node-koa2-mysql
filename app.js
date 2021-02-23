const  koa = require('koa')

const app = new koa()

app.use(async (ctx, next) => {
  console.log('ctx', ctx)
  const { num } = ctx
  if (!num) {
    ctx.num = 1
  } else {
    ctx.num = num + 1
  }
  await next()
})

app.use(async (ctx, next) => {
  console.log('num', ctx.num)
})

app.listen(3000)