# Usamos Node.js oficial
FROM node:20

# Crear directorio de la app
WORKDIR /usr/src/app

# Copiar package.json y package-lock.json
COPY package*.json ./

# Instalar dependencias
RUN npm install

# Copiar todo el código fuente
COPY . .

# Exponer el puerto
EXPOSE 3000

# Comando por defecto
CMD ["npm", "run", "dev"]
