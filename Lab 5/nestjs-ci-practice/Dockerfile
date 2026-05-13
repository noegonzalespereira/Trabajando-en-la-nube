# Etapa 1: Build
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
# Instalamos todas las dependencias para compilar
RUN npm install
COPY . .
RUN npm run build

# Etapa 2: Runtime
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
# Instalamos solo dependencias de producción
RUN npm ci --only=production
# Copiamos la carpeta dist compilada
COPY --from=builder /app/dist ./dist

EXPOSE 3001
# En NestJS el punto de entrada suele ser dist/main
CMD ["node", "dist/main"]