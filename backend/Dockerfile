FROM node:20-bullseye

# Install system dependencies for document conversion
RUN apt-get update && apt-get install -y \
    libreoffice \
    poppler-utils \
    ghostscript \
    fonts-dejavu \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy package files first (better cache)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# If using TypeScript, uncomment:
# RUN npm run build

# Create temp directories
RUN mkdir -p tmp/uploads tmp/outputs

EXPOSE 3001

CMD ["npm", "start"]
