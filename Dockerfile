FROM node:12
ADD . /usr/src/app
WORKDIR /usr/src/app
RUN npm i
EXPOSE 4000
