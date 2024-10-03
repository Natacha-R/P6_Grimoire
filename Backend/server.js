// ************ Point d’entrée de l'application - Serveur principal Express **************//

const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const bookRoutes = require("./routes/bookRoutes"); // Importer les routes des livres
const authRoutes = require("./routes/authRoutes");
const cors = require("cors"); // Importer CORS pour gérer les requêtes cross-origin

// Chargement des variables d'environnement
dotenv.config();

const app = express();

// Middleware pour parser les requêtes JSON
app.use(express.json());

// Middleware CORS (permet de gérer les requêtes provenant d'autres origines)
app.use(cors());

// Utilisation des routes
app.use("/api/auth", authRoutes);
app.use("/api/books", bookRoutes);

// Connexion à MongoDB
mongoose
  .connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connexion à MongoDB locale réussie !"))
  .catch((error) => console.error("Erreur de connexion à MongoDB", error));

// Middleware de gestion des erreurs (rattrape les erreurs et envoie une réponse JSON appropriée)
app.use((err, req, res, next) => {
  res.status(err.status || 500).json({
    error: {
      message: err.message || "Erreur interne du serveur",
    },
  });
});

// Démarrer le serveur
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Le serveur est démarré sur http://localhost:${PORT}`);
});