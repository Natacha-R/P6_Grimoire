// ************ Le modèle User permet de définir quelles informations un objet User contient **************//

// Importation des modules
const mongoose = require("mongoose"); // bibliothèque utilisée pour interagir avec la base de données MongoDB
const bcrypt = require("bcrypt"); // Import de bcrypt pour le hashage du mot de passe
const uniqueValidator = require("mongoose-unique-validator"); // plugin Mongoose qui assure que certaines valeurs, soient uniques (mail)

// Définit chacunes des colonnes de la base de données et leurs types
const userSchema = mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email),
      message: "Veuillez fournir un email valide",
    },
  }, // adresse mail
  password: {
    type: String,
    required: true,
    minlength: [4, "Le mot de passe doit contenir au moins 4 caractères"],
  }, // mot de passe
});

userSchema.plugin(uniqueValidator, { message: "Cet email est déjà utilisé." }); // ajoute le plugin mongoose-unique-validator au schéma (mail)

// Middleware Mongoose `pre-save` pour hasher le mot de passe avant l'enregistrement
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next(); // Ne pas hasher si le mot de passe n'a pas changé

  try {
    const salt = await bcrypt.genSalt(10); // Générer un salt avec 10 rounds
    this.password = await bcrypt.hash(this.password, salt); // Hasher le mot de passe
    next(); // Passer à l'étape suivante
  } catch (error) {
    next(error); // // Gérer les erreurs de hashage
  }
});

module.exports = mongoose.model("User", userSchema); // Exportation du modèle User
