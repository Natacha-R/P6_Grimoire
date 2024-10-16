// ************ Le modèle Book permet de définir quelles informations un objet Book contient **************//

// Importation de Mongoose
const mongoose = require("mongoose");

// Définit chacunes des colonnes de la base de données et leurs types
const bookSchema = mongoose.Schema({
  userId: { type: String, required: true }, // Quel utilisateur a ajouté un livre
  title: { type: String, required: true }, // titre du livre
  author: { type: String, required: true }, // nom de l'auteur du livre
  imageUrl: { type: String, required: true }, // image du livre
  year: { type: Number, required: true }, // année de publication du livre
  genre: { type: String, required: true }, // genre du livre
  ratings: [
    {
      userId: { type: String, required: true },
      grade: { type: Number, required: true },
    },
  ], // tableau qui contient les notes
  averageRating: { type: Number, required: true },
}); // note moyenne du livre

module.exports = mongoose.model("Book", bookSchema); // Exportation du Modèle book
