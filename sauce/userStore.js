var bcrypt = require('bcrypt'),
    Boom =   require('Boom');

module.exports = UserStore();

function UserStore(){
  return {
    users: {},
    initialize: initialize,
    createUser: createUser,
    validateUser: validateUser
  }


  function initialize(){
    this.createUser('Luis', 'lmontealegre@nearsoft.com', 'password');
  }

  function createUser(name, email, password, callback){
    bcrypt.genSalt(10, function(err, salt) {
      bcrypt.hash(password, salt, function(err, hash){
        var user = {
          name: name,
          email: email,
          passwordHash: hash
        };
        if(this.users[email]){
          callback(Boom.conflict('Email already exists. Please login.'));
        } else {
          this.users[email] = user;
          if(callback) {
            callback();
          }
        }
      }.bind(this));
    }.bind(this));
  }

  function validateUser(email, password, callback) {
    var user = this.users[email];
    if(!user){
      callback(Boom.notFound('User does not exists.'));
      return;
    }
    bcrypt.compare(password, user.passwordHash, function(err, isValid){
      if(!isValid){
        callback(Boom.unauthorizaed('Password does not match.'));
      }

      callback(null, user);
    })
  }
}
