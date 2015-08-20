var fs = require('fs');

module.exports = cardStore();

function cardStore(){
  var cards = {};

  return {
    initialize: initialize,
    cards: cards
  }

  function initialize() {
    this.cards = require('../cards.json');
  }
}
