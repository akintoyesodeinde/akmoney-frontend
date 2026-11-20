# Stage 1: Reproducible Node.js dependency installation & React TypeScript production build
FROM node:20-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

# Default to same-origin /api reverse proxy route; no sensitive secrets embedded
ARG VITE_API_BASE_URL="/api"
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL
RUN npm run build

# Stage 2: Lightweight Hardened Nginx Runtime
FROM nginx:1.27-alpine AS runtime

COPY docker/nginx.conf /etc/nginx/nginx.conf
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD wget -q --spider http://127.0.0.1/health || exit 1

STOPSIGNAL SIGQUIT

CMD ["nginx", "-g", "daemon off;"]
