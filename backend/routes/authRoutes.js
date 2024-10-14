// ************ Routes Connexion d'un utilisateur **************//

// Importation des modules
const express = require("express"); // framework utilisé pour gérer les routes et requêtes HTTP
const router = express.Router(); // fonctionnalité d'Express qui permet de regrouper les routes liées dans un même module
const authController = require("../controllers/authController"); // contrôleur qui contient les logiques pour les actions d'authentification

// Route inscription d'un utilisateur
router.post("/signup", authController.signup);

// Route connexion d'un utilisateur
router.post("/login", authController.login);

// Exportation du routeur
module.exports = router; // permet à d'autres parties de l'application d'utiliser ces routes
