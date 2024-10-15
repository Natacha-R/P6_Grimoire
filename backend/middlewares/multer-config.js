// ************ Middleware permettant de gérer le téléchargement, stockage et optimisation des images **************//

// Import des modules
const multer = require("multer"); // permet de gérer les fichiers envoyés dans des formulaires via des requêtes http (télécharger images)
const sharp = require("sharp"); // module pour redimensionner et compresser les fichiers image
const path = require("path"); // aide à manipuler les chemins de fichiers
const fs = require("fs"); // permet d'interagir avec le système de fichiers (lire, écrire, supprimer des fichiers)

const MIME_TYPE = {
  "image/jpg": "jpg",
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
}; // identifier facilement le format du fichier en fonction de son type MIME (extrait de la requête lors de l’upload)

// Utilisation de memoryStorage pour stocker les fichiers temporairement dans la mémoire
const storage = multer.memoryStorage(); // (utile si on veut les manipuler avant de les enregistrer)

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // Limiter la taille des fichiers à 5MB
}).single("image"); // Champ de formulaire pour l'image

// Middleware pour redimensionner et optimiser les images
const optimizeImage = (req, res, next) => {
  if (!req.file) {
    return next(); // Si aucune image n'est fournie, passer à l'étape suivante
  }

  const originalName = req.file.originalname.split(" ").join("_"); // récupère le nom original du fichier envoyé
  const filenameArray = originalName.split(".");
  filenameArray.pop(); // Supprimer l'extension originale du fichier (comme .jpg ou .png)
  const filenameWithoutExtension = filenameArray.join("_"); // Le reste du nom du fichier est reconstruit

  // Récupérer l'extension en fonction du type MIME
  const extension = MIME_TYPE[req.file.mimetype] || "webp"; // Par défaut, utiliser "webp"
  const optimizedFilename =
    filenameWithoutExtension + Date.now() + "." + extension; // génère un nom de fichier unique en concaténant le nom original avec la date actuelle
  const outputPath = path.join(__dirname, "../images", optimizedFilename); // créer un chemin absolu vers le répertoire images, où le fichier optimisé sera sauvegardé

  // Utilisation de sharp pour redimensionner et compresser l'image
  sharp(req.file.buffer) // prend comme entrée le buffer de l'image (qui a été stocké temporairement en mémoire grâce à multer.memoryStorage)
    .resize(1024) // Redimensionner à 1024px de largeur max (conserver les proportions d'origine)
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

module.exports = { upload, optimizeImage }; // exporte upload et optimizeImage
