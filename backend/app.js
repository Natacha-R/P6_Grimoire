// ************ Structure principale du serveur backend (utilisation Express.js, un framework web pour Node.js, ainsi que MongoDB via Mongoose) **************//

// importations des modules
const express = require("express"); // framework qui permet de créer des serveurs web
const path = require("path"); // module intégré à Node.js qui permet de gérer les chemins de fichiers
const cors = require("cors"); // middleware qui permet de configurer les CORS (permet au navigateur d'accéder à des ressources sur des serveurs)
const mongoose = require("mongoose"); // bibliothèque qui facilite les interactions avec MongoDB (base de données NoSQL)
require("dotenv").config(); //  permet de charger des variables d'environnement depuis un fichier .env (garder des informations sensibles)

// Création de l'application Express
const app = express();

// Connexion à MongoDB
mongoose
  .connect(process.env.MONGODB_URL)
  .then(() => console.log("connexion ok"))
  .catch(() => console.log("connexion ko"));

// Mise en place de middlewares
app.use(cors()); // permet à l'applications d'accéder à ce serveur
app.use(express.json()); // Permet de transformer les données JSON des requêtes entrantes en objet JavaScript accessible via req.body
app.use(express.urlencoded({ extended: true })); // Permet de transformer les données envoyées via des formulaires HTML en objets JavaScript
app.use((req, res, next) => {
  // en-têtes et méthodes HTTP autorisés
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  next(); // signifie que le middleware a terminé son travail
});

// Définition routes du backend
const authRoutes = require("./routes/authRoutes"); // Importe le fichier authRoutes qui contient les routes liées à l'authentification
const bookRoutes = require("./routes/booksRoutes"); // Importe le fichier booksRoutes qui contient les routes liées à la gestion des livres
app.use("/api/auth", authRoutes); // Toutes les routes définies dans authRoutes seront accessibles sous le chemin /api/auth
app.use("/api/books", bookRoutes); // Toutes les routes définies dans booksRoutes seront accessibles sous le chemin /api/books
app.use("/images", express.static(path.join(__dirname, "images"))); // permet de rendre accessibles les images (statiques) via des url

// Exportation de l'application
module.exports = app;
