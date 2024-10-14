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

# Étape 2: Utiliser Caddy pour servir l'application
FROM caddy:alpine

# Copier les fichiers de build dans le répertoire de Caddy
COPY --from=build /app/dist/tickly-front/browser /usr/share/caddy

# Vérifier le contenu de /usr/share/caddy
RUN ls -l /usr/share/caddy