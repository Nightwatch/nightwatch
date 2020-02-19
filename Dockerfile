# Client App
FROM node:12
WORKDIR /usr/src/app
COPY package.json yarn.lock ./
RUN yarn
COPY . .
EXPOSE 4000
CMD ["yarn", "api:dev"]
