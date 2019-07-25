const appData = require('./public/muck/data')

const { seller, goods, ratings } = appData

module.exports = {
  devServer: {
    before(app) {
      app.get('/api/seller', (req, res) => res.json({ errno: 0, data: seller }))
      app.get('/api/goods', (req, res) => res.json({ errno: 0, data: goods }))
      app.get('/api/ratings', (req, res) =>
        res.json({ errno: 0, data: ratings })
      )
    }
  }
}
