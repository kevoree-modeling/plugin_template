#!/usr/bin/env bash
cd paperclip
npm install
gulp minify
cd ..
rm src/main/resources/*.js
cp paperclip/dist/*.js src/main/resources
cat src/main/resources/paperclip.js src/main/resources/parser.js > src/main/resources/template.js
cat src/main/resources/paperclip.min.js src/main/resources/parser.min.js > src/main/resources/template.min.js
rm src/main/resources/paperclip.js
rm src/main/resources/paperclip.min.js
rm src/main/resources/parser.js
rm src/main/resources/parser.min.js
mvn clean install