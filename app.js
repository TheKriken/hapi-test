var port = process.env.PORT || 3000;
var Hapi = require('Hapi'),
    Inert = require('inert'),
    Vision = require('vision'),
    Joi = require('joi'),
    Boom = require('boom'),
    GoodConfig = require('./goodConfig'),
    cardStore = require('./sauce/cardStore'),
    userStore = require('./sauce/userStore');

cardStore.initialize();
userStore.initialize();

var server = new Hapi.Server();

server.connection({ port: port });

server.register([Inert, Vision, GoodConfig, require('hapi-auth-cookie')], function () {

  //Configure authentication strategy
  server.auth.strategy('session', 'cookie', {
    password: 'meinPesswerd',
    redirectTo: '/login',
    isSecure: false
  });

  //Set default authentication strategy to default
  server.auth.default('session');

  //Set view engine to handlebars and set template path
  server.views({
    engines:{
      html: require('handlebars')
    },
    path: './templates'
  });

  //Check if there's an error to redirect to an error page
  server.ext('onPreResponse', function(request, reply){
    if(request.response.isBoom){
      return reply.view('error', request.response);
    }
    reply.continue();
  });

  //Set routes
  server.route(require('./sauce/routes'));

  //Start server
  server.start(function(){
    console.log('Magic happens on ' + server.info.uri);
  });
}, function(err){
  console.log(err);
});
