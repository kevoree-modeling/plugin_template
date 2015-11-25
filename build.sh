cd paperclip
npm install
gulp minify
cd ..
rm src/main/resources/*.js
cp paperclip/dist/*.js src/main/resources
mvn clean install