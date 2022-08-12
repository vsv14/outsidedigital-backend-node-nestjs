FROM node:16.14.0-alpine3.14

WORKDIR /usr/app

COPY package*.json ./

RUN npm install

COPY . .

