// ************ Middleware permettant de gérer le téléchargement et le stockage des images **************//

const multer = require("multer");
const sharp = require("sharp");
const path = require("path");
const fs = require("fs");

const MIME_TYPE = {
  "image/jpg": "jpg",
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

// Utilisation de memoryStorage pour stocker les fichiers temporairement dans la mémoire
const storage = multer.memoryStorage();

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // Limiter la taille des fichiers à 5MB
}).single("image"); // Champ de formulaire pour l'image

// Middleware pour redimensionner et optimiser les images
const optimizeImage = (req, res, next) => {
  if (!req.file) {
    return next(); // Si aucune image n'est fournie, passer à l'étape suivante
  }

  const originalName = req.file.originalname.split(" ").join("_");
  const filenameArray = originalName.split(".");
  filenameArray.pop(); // Supprimer l'extension originale
  const filenameWithoutExtension = filenameArray.join("_");

  // Récupérer l'extension en fonction du type MIME
  const extension = MIME_TYPE[req.file.mimetype] || "jpg"; // Par défaut, utiliser "jpg"
  const optimizedFilename =
    filenameWithoutExtension + Date.now() + "." + extension;
  const outputPath = path.join(__dirname, "../images", optimizedFilename);

  // Utilisation de sharp pour redimensionner et optimiser l'image
  sharp(req.file.buffer)
    .resize(1024) // Redimensionner à 1024px de largeur max (conserver les proportions)
    .toFormat(extension, { quality: 80 }) // Compresser à une qualité de 80%
    .toFile(outputPath, (err) => {
      if (err) {
        return next(err); // En cas d'erreur, passer l'erreur au middleware suivant
      }

      // Ajouter l'image optimisée aux infos de requête pour la suite
      req.file.path = outputPath;
      req.file.filename = optimizedFilename;
      next();
    });
};

module.exports = { upload, optimizeImage };
