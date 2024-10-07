// ************ route Connexion d'un utilisateur **************//

const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");

// Inscription d'un utilisateur
router.post("/signup", authController.signup);

// Connexion d'un utilisateur
router.post("/login", authController.login);

module.exports = router;

// Si le user ID ne correspond pas, renvoyer : 403: unauthorized request
