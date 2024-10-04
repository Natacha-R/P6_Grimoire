// ************ Le modèle User permet de définir quelles informations un objet User contient **************//

const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

// Définit chacunes des colonnes de la base de données et leurs types
const userSchema = mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model("User", userSchema);
