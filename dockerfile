# Gunakan image Node.js versi 18 (varian alpine agar lebih ringan)
FROM node:22.12-alpine

# Set working directory di dalam container
WORKDIR /app

# Copy package.json dan package-lock.json terlebih dahulu (biar caching lebih efisien)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy seluruh source code aplikasi
COPY . .

# Build aplikasi Next.js (outputnya ke .next)
RUN npm run build

# Expose port default Next.js
EXPOSE 3000

# Jalankan Next.js dalam mode production
CMD ["npm", "start"]