FROM node:18-alpine

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy source code
COPY . .

# Build TypeScript to JavaScript
RUN npm run build

# Expose port
EXPOSE 3000

# Start in production mode
CMD ["npm", "run", "start"]
