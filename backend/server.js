// ************ Mise en place serveur HTTP **************//

// Importation des modules
const http = require("http");
const app = require("./app");

// Fonction normalizePort pour normaliser le port d'écoute
const normalizePort = (val) => {
  const port = parseInt(val, 10);

  if (isNaN(port)) {
    return val;
  }
  if (port >= 0) {
    return port;
  }
  return false;
};

// Definition du port
const port = normalizePort(process.env.PORT || "4000");
app.set("port", port);

// Gestion des erreus lors du démarrage du server avec errorHandler
const errorHandler = (error) => {
  if (error.syscall !== "listen") {
    throw error;
  }
  const address = server.address();
  const bind =
    typeof address === "string" ? "pipe " + address : "port: " + port;
  switch (error.code) {
    case "EACCES":
      console.error(bind + " requires elevated privileges.");
      process.exit(1);
      break;
    case "EADDRINUSE":
      console.error(bind + " is already in use.");
      process.exit(1);
      break;
    default:
      throw error;
  }
};

// Création du serveur HTTP en passant l'application app
const server = http.createServer(app);

// Gestion des événements error et listening
server.on("error", errorHandler); // Lorsque le serveur rencontre une erreur, il passe cette erreur à la fonction errorHandler
// message logué dans la console indiquant que le serveur est prêt, et précisant le port ou le pipe utilisé
server.on("listening", () => {
  const address = server.address();
  const bind = typeof address === "string" ? "pipe " + address : "port " + port;
  console.log("Listening on " + bind);
});

// Démarrage du sevreur (écouter sur le port défini plus tôt dans la variable port)
server.listen(port);
