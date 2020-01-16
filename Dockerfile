# Client App
FROM node:10
ADD . /usr/src/app
WORKDIR /usr/src/app
RUN npm i
EXPOSE 4000
