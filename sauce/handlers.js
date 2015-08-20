var uuid = require('uuid'),
    fs = require('fs'),
    Joi = require('joi')
    Boom = require('boom'),
    cardStore = require('./cardStore'),
    userStore = require('./userStore'),
    schemas = require('./schemas'),
    Mandrill = require('mandrill-api/mandrill').Mandrill;

module.exports = Handlers();

function Handlers(){
  var mandrillClient = new Mandrill('xBc9hWpKZEz6EBgQ2TFIaw');

  return {
    newCards: newCards,
    deleteCard: deleteCard,
    saveCard: saveCard,
    cards: cards,
    card: card,
    sendCard: sendCard,
    login: login,
    logout: logout,
    register: register,
    upload: upload
  }

  function newCards(request, reply) {
    if(request.method === 'get') {
      return reply.view('new', { card_images: mapImages() });
    } else {
      Joi.validate(request.payload, schemas.cardSchema, function(err, val){
        if(err){
          return reply(Boom.badRequest(err.details[0].message));
        }

        var card = {
          name: val.name,
          email: val.recipient_email,
          sender_name: val.sender_name,
          sender_email: val.sender_email,
          card_image: val.card_image
        };

        saveCard(card);
        console.log(card);
        return reply.redirect('/cards');
      })
    }
  }

  function cards(request, reply){
    reply.view('cards', { cards: getCards(request.auth.credentials.email) })
  }

  function deleteCard(request, reply) {
    delete cardStore.cards[request.params.id];
    reply();
  }

  function saveCard(card){
    var id = uuid.v1();
    card.id = id;
    cardStore.cards[id] = card;
  }

  function mapImages(){
    return fs.readdirSync('./public/images/cards');
  }

  function getCards(email){
    var cards = [];
    for(var key in cardStore.cards){
      if(cardStore.cards[key].sender_email === email){
        cards.push(cardStore.cards[key]);
      }
    }
    return cards;
  }

  function login(request, reply){
    Joi.validate(request.payload, schemas.loginSchema, function(err, val){
      if(err){
        return reply(Boom.unauthorized('Invalid Credentials'));
      }

      userStore.validateUser(val.email, val.password, function(err, user){
        if(err) {
          return reply(err);
        }

        request.auth.session.set(user);
        reply.redirect('/cards');
      })
    })
  }

  function logout(request, reply){
    request.auth.session.clear();
    reply.redirect('/');
  }

  function register(request, reply){
    Joi.validate(request.payload, schemas.registerSchema, function(err, val){
      if(err){
        return reply(Boom.unauthorized('Invalid Credentials'));
      }
      userStore.createUser(val.name, val.email, val.password, function(err, user){
        if(err) {
          return reply(err);
        }

        reply.redirect('/cards');
      })
    })
  }

  function upload(request, reply){
    var image = request.payload.upload_image;
    if(image.bytes){
      fs.link(image.path, 'public/images/cards/' + image.filename, function(){
        fs.unlink(image.path);
      });
    }
    reply.redirect('/cards');
  }

  function sendCard(request, reply){
    var card = cardStore.cards[request.params.id];
    request.server.render('email', card, function(err, rendered){
      var message = {
        html: rendered,
        subject: 'A greeting from hapi Greetings',
        from_email: card.sender_email,
        from_name: card.sender_name,
        to: [
          {
            email: card.recipient_email,
            name: card.name,
            type: 'to'
          }
        ]
      }

      mandrillClient.messages.send({
        message: message
      }, function(result){
        if(result.reject_reason){
          console.log(result.reject_reason);
          reply(Boom.badRequest('Could not send card'));
        }

        reply.redirect('/cards')
      }, function(err){
        console.log(err);
        reply(Boom.badRequest('Could not send card'));
      })
    });
  }

  function card(request, reply){
    var card = cardStore.cards[request.params.id];
    return reply.view('card', card);
  }
}
