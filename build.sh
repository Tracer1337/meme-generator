git pull

cd editor

if [ "$1" = "install" ]
    then
        npm install
        cd editor
        npm install
        cd ..
fi

npm run build

cd ..

rm -r ./dist/editor
mkdir ./dist/editor
mv ./editor/build/* ./dist/editor