#!/bin/bash
cd /usr/app/
rm -rf node_modules
npm install 
npm run standard
npm test

