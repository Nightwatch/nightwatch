# API
FROM node:12
WORKDIR /usr/src/app/api
COPY package.json yarn.lock ./
RUN yarn
COPY . .
COPY config config
COPY ormconfig.json ormconfig.json
EXPOSE 4000
CMD ["yarn", "api:dev"]

# Bot
FROM node:12
WORKDIR /usr/src/app/bot
COPY package.json yarn.lock ./
RUN yarn
COPY . .
COPY config config
COPY ormconfig.json ormconfig.json
CMD ["yarn", "bot:dev"]
