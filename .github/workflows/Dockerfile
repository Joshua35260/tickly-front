# Utiliser une image de Node.js comme base
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

# Utiliser une image Nginx pour servir l'application
FROM nginx:alpine

# Copier les fichiers de build dans le répertoire de Nginx
COPY --from=build /app/dist/tickly-front /usr/share/nginx/html

# Exposer le port 80
EXPOSE 80

# Lancer Nginx
CMD ["nginx", "-g", "daemon off;"]
