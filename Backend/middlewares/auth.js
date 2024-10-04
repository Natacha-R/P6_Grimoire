// ************ vérification token JWT dans les en-têtes des requêtes pour sécuriser les routes **************//

const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1]; // Récupère le token dans l'en-tête
    const decodedToken = jwt.verify(token, "RANDOM_TOKEN_SECRET"); // Vérifie et décode le token
    req.auth = {
      userId: decodedToken.userId,
    };
    if (req.body.userId && req.body.userId !== userId) {
      throw "Invalid user ID";
    } else {
      next();
    }
  } catch (error) {
    res.status(401).json({ error: "Requête non authentifiée !" });
  }
};
