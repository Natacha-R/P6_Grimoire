// ************ Le modèle Book permet de définir quelles informations un objet Book contient **************//

const mongoose = require("mongoose");

// Définit chacunes des colonnes de la base de données et leurs types
const bookSchema = mongoose.Schema({
  userId: { type: String, required: true },
  title: { type: String, required: true },
  author: { type: String, required: true },
  imageUrl: { type: String, required: true },
  year: { type: Number, required: true },
  genre: { type: String, required: true },
  ratings: [{ userId: String, grade: Number }],
  averageRatings: { type: Number, required: true },
});

module.exports = mongoose.model("Book", bookSchema);
