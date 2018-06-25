/*
https://github.com/expressjs/express/issues/2596
var express = require('express')

var app = express()
var router = undefined

// this should be the only thing on your app
app.use(function (req, res, next) {
  // this needs to be a function to hook on whatever the current router is
  router(req, res, next)
})

function defineStuff() {
  router = express.Router()

  // define everything on _router_, not _app_
  router.get('/', ...)
}

// now do you watch and when something changes
// call defineStuff()
 */