FROM node:22.12-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3000

# Jalankan Next.js development server
CMD ["npm", "run", "dev"]