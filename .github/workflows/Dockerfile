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

# Vérifier le contenu du dossier de sortie
RUN ls -la /app/dist/tickly-front

# Étape 2: Servir l'application avec Caddy
FROM caddy:latest

# Copier les fichiers de build vers le répertoire de Caddy
COPY --from=build /app/dist/tickly-front/browser /usr/share/caddy

# Exposer le port 80 (par défaut pour Caddy)
EXPOSE 80

