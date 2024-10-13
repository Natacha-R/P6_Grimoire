// ************ AUTHENTIFICATION : vérification token JWT dans les en-têtes des requêtes pour sécuriser les routes **************//

const jwt = require("jsonwebtoken"); //import module jsonwebtoken pour créer et vérifier les jetons (identifier un utilisateur)

module.exports = (req, res, next) => {
  // export du middleware pour l'utiliser dans d'autres fichiers de l'application
  try {
    const token = req.headers.authorization.split(" ")[1]; // Récupère le token dans l'en-tête HTTP Authorization, split("")[1] extraire uniquement le jeton
    const decodedToken = jwt.verify(token, "RANDOM_TOKEN_SECRET"); // Vérifie et décode le token
    req.auth = {
      userId: decodedToken.userId,
    };
    next();
  } catch (error) {
    res.status(401).json({ error: "Requête non authentifiée !" });
  }
};
