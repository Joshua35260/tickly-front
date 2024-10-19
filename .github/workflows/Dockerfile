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

# Étape 2: Servir l'application avec Nginx
FROM nginx:latest

# Copier les fichiers de build vers le répertoire de Nginx
COPY --from=build /app/dist/tickly-front/browser /usr/share/nginx/html

# Copier le fichier de configuration de Nginx
COPY ./nginx.conf /etc/nginx/conf.d/default.conf

# Exposer le port 80 pour Nginx
EXPOSE 80
