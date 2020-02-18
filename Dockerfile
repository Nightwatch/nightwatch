# Client App
FROM node:12
ADD . /usr/src/app
WORKDIR /usr/src/app
RUN yarn
EXPOSE 4000
CMD ["yarn", "api:dev"]
