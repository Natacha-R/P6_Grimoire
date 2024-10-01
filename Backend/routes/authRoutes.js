//************ Routes d'authentification

const express = require("express");
const router = express.Router();

// Route pour l'inscription
router.post("/signup", (req, res) => {
  const { username, password } = req.body;

  // Simuler l'enregistrement d'un utilisateur
  res.status(201).json();
});

// Route pour la connexion
router.post("/login", (req, res) => {
  const { username, password } = req.body;
  // Simuler une vérification des identifiants
  if (username === "test" && password === "test") {
    res.status(200).json();
  } else {
    res.status(401).json();
  }
});

module.exports = router;
