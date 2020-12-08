var finalhandler = require('finalhandler')
var http = require('http')
var serveStatic = require('serve-static')
var serve = serveStatic('./', { 'index': ['index.html', 'index-prod.html'] })
http.createServer(function onRequest (req, res) {
serve(req, res, finalhandler(req, res))
}).listen(3000)
