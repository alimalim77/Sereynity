const Joi = require("joi");

const userValidationSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().pattern(new RegExp("^[a-zA-Z0-9]{8,30}$")).required(), // Ensures that the password contains only alphanumeric characters and is between 8 and 30 characters long
});

const userValidation = {
  body: (req, res, next) => {
    const { error } = userValidationSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }
    next();
  },
};

module.exports = {
  userValidation,
};
