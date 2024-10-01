//************ point d’entrée de l'application - Serveur principal Express

const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

// Chargement des variables d'environnement
dotenv.config();

const app = express();

// Middleware pour parser les requêtes JSON
app.use(express.json());

// Importation des routes
const authRoutes = require("./routes/authRoutes");
const bookRoutes = require("./routes/bookRoutes");

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

// Démarrer le serveur
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Le serveur est démarré sur http://localhost:${PORT}`);
});
