const Koa = require('koa')
const serve = require('koa-static')
const Router = require('koa-router')
const path = require('path')

const appData = require('./data.json')
const seller = appData.seller
const goods = appData.goods
const ratings = appData.ratings


const router = new Router({
  prefix: '/api'
})

router
  .get('/seller', async ctx => {
    ctx.body = {
      errno: 0,
      data: seller
    }
  })
  .get('/goods', async ctx => {
    ctx.body = {
      errno: 0,
      data: goods
    }
  })
  .get('/ratings', async ctx => {
    ctx.body = {
      errno: 0,
      data: ratings
    }
  })

const app = new Koa()

app.use(serve(path.join(__dirname, './dist')))

app.use(router.routes()).use(router.allowedMethods())

const PORT = process.env.PORT || 9094

app.listen(PORT, () => {
  console.log(`Server started at port:${PORT}!`)
})
