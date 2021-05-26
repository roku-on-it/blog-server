# DEVELOPMENT
FROM node:14.15.4-alpine as dev

WORKDIR /app

COPY package*.json ./

RUN npm i

COPY . .

RUN rm -rf dist
RUN npm run build

# PRODUCTION
FROM node:14.15.4-alpine as prod

ARG NODE_ENV=prod
ENV NODE_ENV=${NODE_ENV}

WORKDIR /app

COPY package*.json ./

RUN npm i

COPY .env* ./
COPY --from=dev /app/dist ./dist

CMD ["node", "dist/main"]
