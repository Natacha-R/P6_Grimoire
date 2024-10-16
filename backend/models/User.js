// ************ Le modèle User permet de définir quelles informations un objet User contient **************//

// Importation des modules
const mongoose = require("mongoose"); // bibliothèque utilisée pour interagir avec la base de données MongoDB
const uniqueValidator = require("mongoose-unique-validator"); // plugin Mongoose qui assure que certaines valeurs, soient uniques (mail)

// Définit chacunes des colonnes de la base de données et leurs types
const userSchema = mongoose.Schema({
  email: { type: String, required: true, unique: true }, // adresse mail
  password: { type: String, required: true }, // mot de passe utilisateur
});

userSchema.plugin(uniqueValidator); // ajoute le plugin mongoose-unique-validator au schéma (mail)

module.exports = mongoose.model("User", userSchema); // Exportation du modèle User
