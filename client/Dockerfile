FROM node:18-alpine AS build
WORKDIR /app

ENV CI=true
ENV NG_CLI_ANALYTICS=false

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build:production

FROM nginx:alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf

COPY --from=build /app/dist/client /usr/share/nginx/html

EXPOSE 80
