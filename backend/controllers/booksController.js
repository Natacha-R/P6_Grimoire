// ************ Contrôleur pour gérer les opérations sur les livres **************//

const Book = require("../models/Book");
const path = require("path");
const fs = require("fs");

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
  const bookJson = JSON.parse(req.body.book); // Récupération des données du livre
  delete bookJson._id; // On s'assure de ne pas envoyer d'ID dans les données reçues

  const book = new Book({
    ...bookJson,
    userId: req.auth.userId, // Authentification nécessaire
    imageUrl: `${req.protocol}://${req.get("host")}/images/${
      req.file.filename
    }`, // Utilisation de l'image optimisée
  });

  book
    .save()
    .then(() => res.status(201).json({ message: "Livre créé avec succès !" }))
    .catch((error) => res.status(400).json({ error }));
};

// Mettre à jour un livre
exports.updateBook = (req, res, next) => {
  const bookJson = req.file
    ? {
        ...JSON.parse(req.body.book),
        imageUrl: `${req.protocol}://${req.get("host")}/images/${
          req.file.filename
        }`, // Utilisation de la nouvelle image optimisée
      }
    : { ...req.body }; // Si aucune nouvelle image n'est envoyée, on utilise les autres données

  // Recherche du livre à mettre à jour
  Book.findOne({ _id: req.params.id })
    .then((book) => {
      // Vérification que l'utilisateur authentifié est bien le créateur du livre
      if (book.userId != req.auth.userId) {
        return res.status(403).json({
          message: "unauthorized request",
        });
      }

      // Si une nouvelle image est envoyée, supprimer l'ancienne du serveur
      if (req.file) {
        const pathToRemove = path.join("images", path.basename(book.imageUrl));
        fs.unlink(pathToRemove, (error) => {
          if (error) {
            console.log(error);
          }
        });
      }

      // Mise à jour du livre dans la base de données
      Book.updateOne(
        { _id: req.params.id },
        { ...bookJson, _id: req.params.id } // On préserve l'ID du livre
      )
        .then(() =>
          res
            .status(200)
            .json({ message: "Le livre a été modifié avec succès !" })
        )
        .catch((error) => res.status(400).json({ error }));
    })
    .catch((error) => res.status(400).json({ error }));
};

// Supprimer un livre
exports.deleteBook = (req, res, next) => {
  Book.findOne({ _id: req.params.id })
    .then((book) => {
      if (book.userId != req.auth.userId) {
        return res.status(403).json({ message: "Requête non autorisée" });
      }

      // Supprimer l'image du système de fichiers
      const pathToRemove = path.join("images", path.basename(book.imageUrl));
      fs.unlink(pathToRemove, (error) => {
        if (error) {
          console.log(error);
        }
      });

      // Supprimer le livre de la base de données
      Book.deleteOne({ _id: req.params.id })
        .then(() =>
          res.status(200).json({ message: "Livre supprimé avec succès !" })
        )
        .catch((error) => res.status(400).json({ error }));
    })
    .catch((error) => res.status(400).json({ error }));
};

// Noter un livre
exports.rateBook = (req, res, next) => {
  const { userId, rating } = req.body;
  //Permet de vérifier que la note soumise est comprise entre 0 et 5 et n'utilise pas de valeurs invalides (utile si l'API est appelé en dehors du frontend)
  if (rating < 0 || rating > 5) {
    return res
      .status(400)
      .json({ message: "La note doit être comprise entre 0 et 5" });
  }

  Book.findOne({ _id: req.params.id })
    .then((book) => {
      //Récupération des id d'utilisateurs ayant donnés une note
      const userRating = book.ratings.map((rating) => rating.userId); // extrait tous les userId des notes du livre dans un tableau
      if (userRating.includes(req.auth.userId)) {
        // methode pour vérifier si l'utilisateur connecté a déjà donné une note
        return res
          .status(400)
          .json({ message: "L'utilisateur connecté a déjà noté le livre." });
      }

      const newRating = { userId, grade: rating };
      const newRatings = [...book.ratings, newRating];

      const total = newRatings.reduce((acc, curr) => acc + curr.grade, 0);
      const averageRating = Math.round(total / newRatings.length);

      Book.updateOne(
        { _id: req.params.id },
        {
          $push: { ratings: newRating },
          $set: { averageRating: averageRating },
        }
      ).then(() => {
        book.ratings.push(newRating);
        book.averageRating = averageRating;
        res.status(201).json(book);
      });
    })
    .catch((err) => res.status(404).json({ err }));
};
