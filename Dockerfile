# syntax=docker/dockerfile:1

FROM node:20-alpine AS base
WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1
COPY package.json package-lock.json* ./
RUN npm install
COPY . .

# Local development stage (used by docker-compose)
FROM base AS development
EXPOSE 3000
CMD ["npm", "run", "dev"]

# Production stage (default, used by Render)
FROM base AS production
# Render injects service env vars as Docker build args.
# NEXT_PUBLIC_* values are inlined into the client bundle at build time,
# so this must be declared before `next build`.
ARG NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}
RUN npm run build
ENV NODE_ENV=production
EXPOSE 3000
# Bind to all interfaces on Render's $PORT (default 3000 elsewhere).
CMD ["sh", "-c", "npm start -- -H 0.0.0.0 -p ${PORT:-3000}"]
