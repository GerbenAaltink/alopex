FROM node:11-alpine as node11x
COPY . /usr/app/
WORKDIR /usr/app
RUN npm install sqlite3@4.1.1

FROM node:12-alpine as node12x
COPY . /usr/app/
WORKDIR /usr/app
RUN npm install sqlite3@4.1.1

FROM node:13-alpine as node13x
COPY . /usr/app/
WORKDIR /usr/app
RUN npm install sqlite3@4.1.1




