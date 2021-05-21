require('module-alias/register') //导入模块别名

const  Koa = require('koa')
const InitManager = require('./app/core/init')

const app = new Koa()

InitManager.initCore(app)
console.log('NODE_ENV', process.env.NODE_ENV)
app.listen(3333)
