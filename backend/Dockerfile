FROM node:18-slim

# Install system dependencies
RUN apt-get update && apt-get install -y \
    libreoffice \
    poppler-utils \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install Node.js dependencies
RUN npm install --production

# Copy application code
COPY . .

# Create temp directories
RUN mkdir -p tmp/uploads tmp/outputs

# Expose port
EXPOSE 3001

# Start application
CMD ["npm", "start"]
