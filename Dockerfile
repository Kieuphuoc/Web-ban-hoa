FROM node:20-alpine

WORKDIR /app

# Install dependencies based on the preferred package manager
COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml* ./
RUN npm install

# Rebuild the source code only when needed
COPY . .

# Environment variables must be present at build time
ARG DATABASE_URL
ENV DATABASE_URL=${DATABASE_URL}

# Create output directory for Prisma Client
RUN mkdir -p src/generated/prisma

# Build application
RUN npx prisma generate
# RUN npm run build

# If using npm run dev, we don't need build above (for development).
# But for production-like container, build is usually done.
# Since user is in development, let's keep it simple or just use `npm run dev` directly if volume mounting.

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

CMD ["npm", "run", "dev"]
