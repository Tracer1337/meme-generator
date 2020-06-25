git pull

if [ "$1" = "install" ]
    then
        npm install
        cd editor
        npm install
        cd ..
fi

cd editor

npm run build

cd ..

rm -r ./dist/editor
mkdir ./dist/editor
mv ./editor/build/* ./dist/editor