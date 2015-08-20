var Joi = require('joi');

module.exports = Schemas();

function Schemas(){
  var cardSchema = Joi.object().keys({
    name: Joi.string().min(3).max(50).required(),
    recipient_email: Joi.string().email().required(),
    sender_name: Joi.string().min(3).max(50).required(),
    sender_email: Joi.string().email().required(),
    card_image: Joi.string().regex(/.+\.(jpg|bmp|png|gif)\b/).required()
  });

  var loginSchema = Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().min(4).max(32).required()
  });

  var registerSchema = Joi.object().keys({
    name: Joi.string().min(3).max(50).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(4).max(32).required()
  })

  return {
    cardSchema: cardSchema,
    loginSchema: loginSchema,
    registerSchema: registerSchema
  }

}
