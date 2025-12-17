FROM node:22-alpine

WORKDIR /app

# Salin file dependensi
COPY package*.json ./

# Install dependensi
RUN npm install

# Salin semua kode sumber
COPY . .

# Build aplikasi Next.js (Wajib untuk production)
RUN npm run build

# Next.js berjalan di port 3000 secara default
EXPOSE 3000

# Jalankan aplikasi
CMD ["npm", "start"]