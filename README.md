# Mon vieux Grimoire - site de notation de livres

# Instructions pour Configurer le Projet :

- clonez le dépôt : git clone https://github.com/Natacha-R/P6_Grimoire.git

- Copiez le fichier `example.env` et renommez-le en `.env` : cp example.env .env

- Ouvrez votre fichier `.env` dans un éditeur de texte et Remplacez `username` `password` `your_random_token_secret` par vos propres informations

  - Voici les 3 variables présentes dans le fichier .env :

  MONGODB_URL=mongodb+srv://username:password@cluster0.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
  RANDOM_TOKEN_SECRET=your_random_token_secret
  PORT=4000

- installez les dépendances avec la commande : npm install

- démarrez le projet avec la commande : npm start

---

- adresse de la partie frontend : http://localhost:3000

- adresse de la partie backend : http://localhost:4000
