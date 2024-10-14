// ************ Route gestion des livres (création, modification, suppression, affichage et notation) **************//

// Importation des modules
const express = require("express"); // Utilisé pour gérer les routes
const router = express.Router(); // Permet de regrouper les routes liées à la gestion des livres
const bookController = require("../controllers/booksController"); // contrôleur des livres (qui contient toutes les fonctions de gestion des livres)
const authMiddleware = require("../middlewares/auth"); // Middleware pour vérifier si l'utilisateur est authentifié (token JWT)
const { upload, optimizeImage } = require("../middlewares/multer-config"); // Importer upload et optimizeImage (upload et optimisation images)

// Récupérer tous les livres
router.get("/", bookController.getAllBooks);

// Récupérer les 3 livres les mieux notés
router.get("/bestrating", bookController.getBestRatedBooks);

// Récupérer un livre spécifique par ID
router.get("/:id", bookController.getOneBook);

// Ajouter un nouveau livre (image via multer, puis optimisation avec sharp)
router.post(
  "/",
  authMiddleware, // middleware vérification du token utilisé pour s'assurer que seuls les utilisateurs authentifiés peuvent ajouter des livres
  upload, // permet d'uploader une image associée au livre (géré par Multer)
  optimizeImage, // Après l'upload, l'image est optimisée (taille et qualité) avec Sharp
  bookController.createBook // Fonction du contrôleur qui crée et enregistre le nouveau livre dans la base de données
);

// Mettre à jour un livre par ID (image via multer, puis optimisation avec sharp)
router.put(
  "/:id",
  authMiddleware, // Vérifie que l'utilisateur est authentifié pour pouvoir modifier un livre
  upload, // Si l'utilisateur envoie une nouvelle image pour le livre, elle sera uploadée
  optimizeImage, // L'image sera optimisée après l'upload
  bookController.updateBook // Fonction du contrôleur qui gère la mise à jour des informations du livre dans la base de données
);

// Supprimer un livre par ID
router.delete("/:id", authMiddleware, bookController.deleteBook);

// Noter un livre
router.post("/:id/rating", authMiddleware, bookController.rateBook);

module.exports = router; // exporte le routeur configuré avec toutes les routes liées à la gestion des livres (permet à l'application d'utiliser ces routes)
