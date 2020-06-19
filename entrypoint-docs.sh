#!/bin/bash
cd /usr/app/
rm -rf node_modules
npm install 
npm install -g js-beautify
js-beautify *.js
js-beautify tests/*.js
npm run standard
npm run docs

