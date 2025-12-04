FROM node:24-slim

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install --omit-dev

COPY . .

EXPOSE 3000

RUN addgroup --system nodejs \
    && adduser --system --ingroup nodejs nodejs

USER nodejs

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:3000/health || exit 1

CMD ["node", "-r", "dotenv/config", "server.js"]
