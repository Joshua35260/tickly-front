# Étape 1: Construction de l'application
FROM node:22 AS build

# Définir le répertoire de travail
WORKDIR /app

# Copier les fichiers de package
COPY package*.json ./

# Installer les dépendances
RUN npm install

# Copier tout le reste du code de l'application
COPY . .

# Construire l'application Angular
RUN npm run build --prod

# Vérifier le contenu du répertoire de build
RUN ls -l /app/dist/tickly-front/browser
