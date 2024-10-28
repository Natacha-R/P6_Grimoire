// ************ Middleware validation Email & Mot de passe **************//

const validator = require("validator");

exports.validateSignup = (req, res, next) => {
  const { email, password } = req.body;

  // Vérification l'email
  if (!validator.isEmail(email)) {
    return res.status(400).json({ message: "Email invalide" });
  }

  // Vérification mot de passe
  if (password.length < 4) {
    return res.status(400).json({
      message: "Le mot de passe doit contenir au moins 4 caractères",
    });
  }

  next();
};
