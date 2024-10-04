// ************ Route gestion des livres (création, modification, suppression, affichage et notation) **************//

const express = require("express");
const router = express.Router();
const bookController = require("../controllers/booksController");
const authMiddleware = require("../middlewares/auth"); // Middleware pour vérifier le token JWT
const multer = require("../middlewares/multer-config"); // Pour la gestion des fichiers image

// Récupérer tous les livres
router.get("/", bookController.getAllBooks);

// Récupérer les 3 livres ayant la meilleure note moyenne
router.get("/bestrating", bookController.getBestRatedBooks);

// Récupérer un livre spécifique par ID
router.get("/:id", bookController.getOneBook);

// Ajouter un nouveau livre (image via multer)
router.post("/", authMiddleware, multer, bookController.createBook);

// Mettre à jour un livre par ID
router.put("/:id", authMiddleware, multer, bookController.updateBook);

// Supprimer un livre par ID
router.delete("/:id", authMiddleware, bookController.deleteBook);

// Noter un livre
router.post("/:id/rating", authMiddleware, bookController.rateBook);

module.exports = router;
