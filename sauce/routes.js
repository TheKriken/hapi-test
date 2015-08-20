var Handlers = require('./handlers')

module.exports = [
  {
    path: '/',
    method: 'GET',
    handler: {
      file: 'templates/index.html'
    },
    config: {
      auth: false
    }
  },
  {
    path: '/assets/{path*}',
    method: 'GET',
    handler: {
      directory: {
        path: './public',
        listing: false
      }
    },
    config: {
      auth: false
    }
  },
  {
    path: '/cards/new',
    method: ['GET', 'POST'],
    handler: Handlers.newCards
  },
  {
    path: '/cards',
    method: 'GET',
    handler: Handlers.cards
  },
  {
    path: '/cards/{id}',
    method: 'DELETE',
    handler: Handlers.deleteCard
  },
  {
    path: '/login',
    method: 'GET',
    handler: {
      file: 'templates/login.html'
    },
    config: {
      auth: false
    }
  },
  {
    path: '/login',
    method: 'POST',
    handler: Handlers.login,
    config: {
      auth: false
    },
  },
  {
    path: '/logout',
    method: 'GET',
    handler: Handlers.logout
  },
  {
    path: '/register',
    method: 'GET',
    handler: {
      file: 'templates/register.html'
    },
    config: {
      auth: false
    }
  },
  {
    path: '/register',
    method: 'POST',
    handler: Handlers.register,
    config: {
      auth: false
    }
  },
  {
    path: '/upload',
    method: 'GET',
    handler: {
      file: 'templates/upload.html'
    }
  },
  {
    path: '/upload',
    method: 'POST',
    handler: Handlers.upload,
    config: {
      payload: {
        output: 'file',
        uploads: 'public/images'
      }
    }
  },
  {
    path: '/cards/{id}/send',
    method: 'GET',
    handler: Handlers.card
  },
  {
    path: '/cards/{id}',
    method: 'GET',
    handler: Handlers.sendCard
  }
];
