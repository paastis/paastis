# Etape 1: Construire l'image
FROM node:16

# Définir le répertoire de travail dans le conteneur
WORKDIR /app

# Copier les fichiers package.json et package-lock.json
COPY package*.json ./

# Installer les dépendances du projet
RUN npm install

# Copier les autres fichiers du projet dans le conteneur
COPY . .

# Compiler les fichiers TypeScript en JavaScript
RUN npm run build

# Exposer le port sur lequel l'application va tourner
EXPOSE 3000

# Attendre que PostgreSQL et Redis soient prêts avant de démarrer l'application
# Utilisez dockerize ou un script d'attente pour cela, selon votre préférence
# (dockerize n'est pas inclus par défaut, vous devrez l'ajouter ou utiliser une méthode alternative)
# RUN npm install -g dockerize
# CMD dockerize -wait tcp://postgres:5432 -wait tcp://redis:6379 -timeout 60s npm run migrate && npm start

# Utilisez cette ligne si vous n'utilisez pas dockerize ou une méthode d'attente
CMD npm run migrate && npm start
