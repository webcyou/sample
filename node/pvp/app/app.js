/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var http = require('http');
var path = require('path');
var ECT = require('ect');
var battleSockets = require('./sockets/server.js');

var app = express();

// ect setting
app.engine('ect', ECT({ watch: true, root: __dirname + '/views', ext: '.ect' }).render);

// all environments
app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', path.join(__dirname, 'views'));
  app.set('view engine', 'ect');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

app.get('/', routes.index);
app.get('/battle', routes.battle);
app.get('/result', routes.result);

var server = http.createServer(app);
var io = require('socket.io').listen(server, { log: false });

server.listen(app.get('port'), function() {
  console.log('Express server listening on port ' + app.get('port'));
});

// socket.ioのコネクション設定
io.sockets.on('connection', battleSockets.onConnection);

