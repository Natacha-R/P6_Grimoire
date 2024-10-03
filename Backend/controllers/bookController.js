// ************ Contrôleur pour gérer les opérations sur les livres **************//

const Book = require("../models/book");

// Récupérer tous les livres
exports.getAllBooks = (req, res, next) => {
  Book.find()
    .then((books) => res.status(200).json(books))
    .catch((error) => res.status(400).json({ error }));
};

// Récupérer un livre par ID
exports.getOneBook = (req, res, next) => {
  Book.findOne({ _id: req.params.id })
    .then((book) => res.status(200).json(book))
    .catch((error) => res.status(404).json({ error }));
};

// Récupérer les 3 livres avec la meilleure note
exports.getBestRatedBooks = (req, res, next) => {
  Book.find()
    .sort({ averageRating: -1 })
    .limit(3)
    .then((books) => res.status(200).json(books))
    .catch((error) => res.status(400).json({ error }));
};

// Ajouter un livre
exports.createBook = (req, res, next) => {
  const book = new Book({
    ...req.body,
    userId: req.auth.userId, // Authentification nécessaire
    averageRating: 0,
    ratings: [],
  });
  book
    .save()
    .then(() => res.status(201).json({ message: "Livre créé avec succès !" }))
    .catch((error) => res.status(400).json({ error }));
};

// Mettre à jour un livre
exports.updateBook = (req, res, next) => {
  Book.updateOne({ _id: req.params.id }, { ...req.body, _id: req.params.id })
    .then(() => res.status(200).json({ message: "Livre mis à jour !" }))
    .catch((error) => res.status(400).json({ error }));
};

// Supprimer un livre
exports.deleteBook = (req, res, next) => {
  Book.deleteOne({ _id: req.params.id })
    .then(() => res.status(200).json({ message: "Livre supprimé !" }))
    .catch((error) => res.status(400).json({ error }));
};

// Noter un livre
exports.rateBook = (req, res, next) => {
  Book.findOne({ _id: req.params.id })
    .then((book) => {
      if (!book) {
        return res.status(404).json({ message: "Livre non trouvé !" });
      }
      const rating = {
        userId: req.auth.userId,
        grade: req.body.rating,
      };
      book.ratings.push(rating);
      book.averageRating =
        book.ratings.reduce((acc, curr) => acc + curr.grade, 0) /
        book.ratings.length;
      book
        .save()
        .then(() => res.status(200).json(book))
        .catch((error) => res.status(400).json({ error }));
    })
    .catch((error) => res.status(400).json({ error }));
};
