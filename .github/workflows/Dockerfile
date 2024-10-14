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

# Étape 2: Utiliser Caddy pour servir l'application
FROM caddy:alpine

# Copier les fichiers de build dans le répertoire de Caddy
COPY --from=build /app/dist/tickly-front/browser /usr/share/caddy

# Caddyfile par défaut qui sert les fichiers statiques
COPY Caddyfile /etc/caddy/Caddyfile
