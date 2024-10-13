// ************ Route gestion des livres (création, modification, suppression, affichage et notation) **************//

const express = require("express");
const router = express.Router();
const bookController = require("../controllers/booksController");
const authMiddleware = require("../middlewares/auth"); // Middleware pour vérifier le token JWT
const { upload, optimizeImage } = require("../middlewares/multer-config"); // Importer upload et optimizeImage

// Récupérer tous les livres
router.get("/", bookController.getAllBooks);

// Récupérer les 3 livres ayant la meilleure note moyenne
router.get("/bestrating", bookController.getBestRatedBooks);

// Récupérer un livre spécifique par ID
router.get("/:id", bookController.getOneBook);

// Ajouter un nouveau livre (image via multer, puis optimisation avec sharp)
router.post(
  "/",
  authMiddleware,
  upload,
  optimizeImage,
  bookController.createBook
);

// Mettre à jour un livre par ID (image via multer, puis optimisation avec sharp)
router.put(
  "/:id",
  authMiddleware,
  upload,
  optimizeImage,
  bookController.updateBook
);

// Supprimer un livre par ID
router.delete("/:id", authMiddleware, bookController.deleteBook);

// Noter un livre
router.post("/:id/rating", authMiddleware, bookController.rateBook);

module.exports = router;
