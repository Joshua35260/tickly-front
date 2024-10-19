# Étape 1: Construction de l'application Angular
FROM node:22 AS build

WORKDIR /app

# Copier package.json et package-lock.json
COPY package*.json ./

# Installer les dépendances
RUN npm install

# Copier le code de l'application
COPY . .

# Compiler l'application en mode production
RUN npm run build --prod

# Étape 2: Servir l'application avec Caddy
FROM caddy:latest

# Copier les fichiers de build vers le répertoire de Caddy
COPY --from=build /app/dist/tickly-front/browser /usr/share/caddy

# Exposer le port 80 pour Caddy
EXPOSE 80