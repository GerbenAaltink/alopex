FROM node:8-alpine as node8x
COPY . /usr/app/
WORKDIR /usr/app

FROM node:9-alpine as node9x
COPY . /usr/app/
WORKDIR /usr/app

FROM node:10-alpine as node10x
COPY . /usr/app/
WORKDIR /usr/app

FROM node:11-alpine as node11x
COPY . /usr/app/
WORKDIR /usr/app

FROM node:12-alpine as node12x
COPY . /usr/app/
WORKDIR /usr/app

FROM node:13-alpine as node13x
COPY . /usr/app/
WORKDIR /usr/app




