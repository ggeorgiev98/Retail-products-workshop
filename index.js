require('dotenv').config()

const mongoose = require('mongoose')
const express = require('express')
const indexRouter = require('./routes')
const authRouter = require('./routes/auth')
const productRouter = require('./routes/product')
const accessoryRouter = require('./routes/accessory')
const app = express()

mongoose.connect(process.env.URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}, (err) => {
  if (err) {
    console.error(err)
    throw err
  }

  console.log('Database is setup and running')
})

require('./config/express')(app)

app.use('/', authRouter)
app.use('/', productRouter)
app.use('/', accessoryRouter)
app.use('/', indexRouter)

app.get('*', (req, res) => {
  res.render('404', {
    title: 'Error | SoftUni-Project'
  })
})

app.listen(process.env.PORT, console.log(`Listening on port ${process.env.PORT}!`))


