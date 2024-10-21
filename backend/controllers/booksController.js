// ************ Contrôleur pour gérer les opérations sur les livres **************//

// Importation des modules
const Book = require("../models/Book"); // // Modèle Mongoose pour les livres
const path = require("path"); // Module pour manipuler les chemins de fichiers de manière sécurisée et compatible (macOS, Windows...)
const fs = require("fs"); // Module pour interagir avec le système de fichiers (ex : suppression d'images)

// Récupérer tous les livres
exports.getAllBooks = (req, res, next) => {
  // exporte la fonction getAllBooks qui sera utilisée pour gérer la requête HTTP "GET" visant à récupérer tous les livres
  Book.find() // méthode Mongoose qui interroge la base de données MongoDB pour récupérer tous les livres (associée au modèle Book). Renvoie une promesse
    .then((books) => res.status(200).json(books)) // si reussi la methode then reçoit les books et renvoie une réponse http avec statut 200 et les données des livres au format JSON
    .catch((error) => res.status(400).json({ error })); // si erreur la méthode .catch() est exécutée (réponse statut 400 est envoyée avec objet JSON contenant l'erreur)
};

// Récupérer un livre par ID
exports.getOneBook = (req, res, next) => {
  Book.findOne({ _id: req.params.id }) // cherche un seul livre avec l'ID fourni par la requête
    .then((book) => {
      if (!book) {
        // Si aucun livre trouvé (book est null)
        return res.status(404).json({ message: "Livre non trouvé !" });
      }
      res.status(200).json(book); // Si un livre est trouvé, renvoyer le livre en JSON
    })
    .catch((error) => res.status(500).json({ error })); // Gérer les erreurs (ex: erreur de serveur ou format ID invalide)
};

// Récupérer les 3 livres avec la meilleure note
exports.getBestRatedBooks = (req, res, next) => {
  Book.find() // Récupère tous les livres sans filtre spécifique
    .sort({ averageRating: -1 }) // Trie les livres par leur champ averageRating
    .limit(3)
    .then((books) => res.status(200).json(books)) // si succès, renvoie les trois livres avec un statut 200
    .catch((error) => res.status(400).json({ error })); // si échec, renvoie une réponse avec un statut 400 et une description de l'erreur
};

// Ajouter un livre
exports.createBook = (req, res, next) => {
  const bookJson = JSON.parse(req.body.book); // Récupération des données du livre (objet JS)
  delete bookJson._id; // Supprime l'ID du livre si jamais il a été envoyé par erreur
  const book = new Book({
    ...bookJson, // Crée une nouvelle instance du modèle Book avec les données contenues dans bookJson (décomposition ... qui copie toutes les propriétés)
    userId: req.auth.userId, // lier le livre à l'utilisateur qui l'a créé (Authentification nécessaire)
    imageUrl: `${req.protocol}://${req.get("host")}/images/${
      req.file.filename
    }`, // construit l'URL complète de l'image envoyée, basée sur l’hôte du serveur et le fichier téléchargé (req.file.filename est généré lors de l'upload de l'image)
  });

  book
    .save() // Sauvegarde le livre dans la base de données MongoDB
    .then(() => res.status(201).json({ message: "Livre créé avec succès !" }))
    .catch((error) => res.status(400).json({ error }));
};

// Mettre à jour un livre
exports.updateBook = (req, res, next) => {
  const bookJson = req.file // si nouvelle image téléchargée
    ? {
        ...JSON.parse(req.body.book),
        imageUrl: `${req.protocol}://${req.get("host")}/images/${
          req.file.filename
        }`, // nouveau chemin de la nouvelle image optimisée
      }
    : { ...req.body }; // Si aucune nouvelle image n'est envoyée, on utilise seulement les données envoyées dans req.body pour la maj

  // Recherche du livre à mettre à jour
  Book.findOne({ _id: req.params.id })
    .then((book) => {
      // Vérification que l'utilisateur authentifié est bien le créateur du livre
      if (book.userId != req.auth.userId) {
        return res.status(403).json({
          message: "unauthorized request",
        }); // Compare l'ID de l'utilisateur stocké dans le livre avec celui de l'utilisateur authentifié
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
        { ...bookJson, _id: req.params.id } // On préserve l'ID d'origine du livre
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
      } // verifie si l'utilisateur authentifié est le créateur du livre

      // Supprimer l'image du système de fichiers avec fs.unlick()
      const pathToRemove = path.join("images", path.basename(book.imageUrl));
      fs.unlink(pathToRemove, (error) => {
        if (error) {
          console.log(error);
        }
      });

      // Supprimer le livre de la base de données avec book.deletOne
      Book.deleteOne({ _id: req.params.id })
        .then(() =>
          res.status(200).json({ message: "Livre supprimé avec succès !" })
        )
        .catch((error) => res.status(400).json({ error }));
    })
    .catch((error) => res.status(400).json({ error }));
};

// Noter un livre rateBook
exports.rateBook = (req, res, next) => {
  const { userId, rating } = req.body; // ce qui est envoyé par le client dans le corps de la requête (elle contient id utilisateur et note qu'il veut attribuer)
  //Permet de vérifier que la note est comprise entre 0 et 5 et n'utilise pas de valeurs invalides (utile si l'API est appelé en dehors du frontend)
  if (rating < 0 || rating > 5) {
    return res
      .status(400)
      .json({ message: "La note doit être comprise entre 0 et 5" });
  }

  // Recherche du livre à noter
  Book.findOne({ _id: req.params.id }) // méthode interroge la base de données MongoDB pour récupérer le livre correspondant à l'ID qui est passé dans l'URL
    .then((book) => {
      //Récupération des id d'utilisateurs ayant donnés une note
      const userRating = book.ratings.map((rating) => rating.userId); // crée un tableau contenant tous les userId des utilisateurs qui ont déjà noté le livre
      if (userRating.includes(req.auth.userId)) {
        // methode pour vérifier si l'utilisateur connecté a déjà donné une note
        return res
          .status(400)
          .json({ message: "L'utilisateur connecté a déjà noté le livre." });
      }
      // création nouvelle note
      const newRating = { userId, grade: rating }; // nouvel objet de notation (id utilisateur qui a donné la note / note fournie dans req.body.rating)
      const newRatings = [...book.ratings, newRating]; // nouveau tableau avec notes existantes du livre (book.ratings) et nouvelle note (newRating)
      // Calcul de la nouvelle note moyenne
      const total = newRatings.reduce((acc, curr) => acc + curr.grade, 0); // reduce : calculer la somme des notes de tous les utilisateurs / acc : somme accumulée des notes / curr.grade : note actuelle dans chq itération / 0: valeur initiale de acc (commence à 0)
      const averageRating = Math.round(total / newRatings.length); // calcul note moyenne (total des notes/nombre total de notes). math.round : arrondir le resultat à l'entier

      // Mise à jour du livre avec la nouvelle note et moyenne
      Book.updateOne(
        { _id: req.params.id },
        {
          $push: { ratings: newRating }, // commande MongoDB ajoute la nouvelle note au tableau de notes du livre en mémoire
          $set: { averageRating: averageRating }, // met à jour la note moyenne (averageRating) du livre avec la nouvelle moyenne calculée
        }
      ).then(() => {
        book.ratings.push(newRating); //  Ajoute la nouvelle note au tableau des notes du livre en mémoire
        book.averageRating = averageRating; // Met à jour la note moyenne en mémoire
        res.status(201).json(book); // envoi réponse succès et objet book mis à jour
      });
    })
    .catch((err) => res.status(404).json({ err })); // fonction qui capture l'erreur et renvoie une réponse 404 et détails de l'erreur dans objet JSON
};
