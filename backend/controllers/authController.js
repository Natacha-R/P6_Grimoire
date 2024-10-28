// ************ Contrôleur pour gérer l'inscription et la connexion **************//

// Importation des modules
const bcrypt = require("bcrypt"); //  librairie utilisée pour hasher les mots de passe avant de les enregistrer dans la base de données
const jwt = require("jsonwebtoken"); // Utilisé pour générer des tokens d'authentification après la connexion
const User = require("../models/User"); // modèle de la collection User dans la base de données MongoDB (représente les utilisateurs du système avec leurs emails et mots de passe)
require("dotenv").config(); // Charger variables d'environnement depuis le fichier .env

// Inscription d'un nouveau compte utilisateur (méthode signup)
exports.signup = (req, res, next) => {
  console.log(req.body); // sert à afficher les données reçues (utile pour le débogage)
  // Création de l'utilisateur avec email et mot de passe (en clair)
  const user = new User({
    email: req.body.email,
    password: req.body.password, // Le modèle User va hasher le mot de passe automatiquement
  });

  user
    .save() // utilisateur est enregistré dans la base de données avec user.save()
    .then(() =>
      res.status(201).json({ message: "Utilisateur créé avec succès !" })
    )
    .catch((error) => {
      if (error.name === "ValidationError") {
        res.status(400).json({ error }); // Erreur 400 pour validation
      } else {
        res.status(500).json({ error }); // Erreur 500 pour autres erreurs
      }
    });
};

// Connexion d'un utilisateur (login)
exports.login = (req, res, next) => {
  User.findOne({ email: req.body.email }) // recherche un utilisateur dans la base de données qui correspond à l'email fourni lors de la connexion
    .then((user) => {
      if (!user) {
        return res.status(401).json({ message: "Utilisateur non trouvé !" });
      }
      bcrypt
        .compare(req.body.password, user.password) // comparer le mot de passe fourni par l'utilisateur avec le mot de passe hashé stocké dans la base de données
        .then((valid) => {
          if (!valid) {
            return res
              .status(401)
              .json({ message: "Mot de passe incorrect !" });
          }
          res.status(200).json({
            userId: user._id,
            token: jwt.sign(
              { userId: user._id },
              process.env.RANDOM_TOKEN_SECRET,
              {
                expiresIn: "24h",
              }
            ), // Si le mot de passe est correct, un token JWT est généré pour cet utilisateur pendant 24H
          });
        })
        .catch((error) => res.status(500).json({ error }));
    })
    .catch((error) => res.status(500).json({ error }));
};
