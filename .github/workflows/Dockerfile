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

# Étape 2: Servir l'application avec Nginx
FROM nginx:alpine

# Copier les fichiers de build vers le répertoire de Nginx
COPY --from=build /app/dist/tickly-front/browser /usr/share/nginx/html

# Exposer le port 80
EXPOSE 80

# Commande par défaut pour démarrer Nginx
CMD ["nginx", "-g", "daemon off;"]
