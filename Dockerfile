# API
FROM node:12
WORKDIR /usr/src/app/api
COPY package.json yarn.lock ./
RUN yarn
COPY . .
EXPOSE 4000
CMD ["yarn", "api:dev"]

# Bot
FROM node:12
WORKDIR /usr/src/app/bot
COPY package.json yarn.lock ./
RUN yarn
COPY . .
CMD ["yarn", "bot:dev"]
