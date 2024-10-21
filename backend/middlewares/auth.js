// ************ AUTHENTIFICATION : vérification token JWT dans les en-têtes des requêtes pour sécuriser les routes **************//

const jwt = require("jsonwebtoken"); //import module jsonwebtoken pour créer et vérifier les jetons (identifier un utilisateur)
require("dotenv").config(); // Charge les variables d'environnement depuis le fichier .env

module.exports = (req, res, next) => {
  // export du middleware pour l'utiliser dans d'autres fichiers de l'application (3P : requête entrante envoyé par le client, réponse à envoyer, passer à l'étape suivante)
  try {
    const token = req.headers.authorization.split(" ")[1]; // Récupère le token dans l'en-tête HTTP Authorization, split("")[1] extraire uniquement le jeton
    const decodedToken = jwt.verify(token, process.env.RANDOM_TOKEN_SECRET); // Vérifie et décode le token pour vérifier qu'il n'a pas été altéré et qu'il est valide (jeton + clé secrète)
    req.auth = {
      userId: decodedToken.userId, // On extrait l'userId du token décodé (permet d"utiliser l'id de l'utilisateur tout au long du traitement de la requête)
    };
    next(); // permet de continuer le traitement normal de la requête, car l'utilisateur est considéré comme authentifié
  } catch (error) {
    res.status(401).json({ error: "Requête non authentifiée !" });
  }
};
