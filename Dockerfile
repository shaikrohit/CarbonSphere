# Stage 1: Build static React assets
FROM node:20-alpine AS builder

WORKDIR /app

# Copy dependency manifests
COPY package*.json ./

# Install all dependencies (including devDependencies needed for build)
RUN npm install

# Copy source code
COPY . .

# Compile optimized static bundle
RUN npm run build

# Stage 2: Serve compiled assets with high performance Nginx web server
FROM nginx:alpine

# Copy custom Nginx server configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy compiled static assets from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Expose Cloud Run default port
EXPOSE 8080

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
