var Good = require('good'),
    GoodFile = require('good-file');

module.exports = {
  register: Good,
  options: {
    opsInterval: 5000,
    reporters: [
      {
        reporter: GoodFile,
        events: {
          ops: '*'
        },
        config: {
          path: './logs',
          prefix: 'hapi-process',
          rotate: 'daily'
        }
      },
      {
          reporter: GoodFile,
          events: {
            response: '*'
          },
          config: {
            path: './logs',
            prefix: 'hapi-response',
            rotate: 'daily'
          }
      },
      {
          reporter: GoodFile,
          events: {
            error: '*'
          },
          config: {
            path: './logs',
            prefix: 'hapi-error',
            rotate: 'daily'
          }
      }
    ]
  }
};
