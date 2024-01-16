const Joi = require('joi');

// Middleware de validation pour les films
const validateMovie = (req, res, next) => {
  const schema = Joi.object({
    title: Joi.string().required(),
    director: Joi.string().required(),
    year: Joi.string().required(),
    color: Joi.string().required(),
    duration: Joi.number().required(),
    // Ajoutez d'autres validations selon votre modèle de données
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(422).json({ error: error.details[0].message });
  }

  next();
};

// Middleware de validation pour les utilisateurs
const validateUser = (req, res, next) => {
  const schema = Joi.object({
    firstname: Joi.string().required(),
    lastname: Joi.string().required(),
    email: Joi.string().email().required(),
    city: Joi.string().required(),
    language: Joi.string().required(),
    // Ajoutez d'autres validations selon votre modèle de données
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(422).json({ error: error.details[0].message });
  }

  next();
};

module.exports = { validateMovie, validateUser };