git pull

cd editor

if [ "$1" = "install" ]
    then npm install
fi

npm run build

cd ..

rm -r ./dist/editor
mkdir ./dist/editor
mv ./editor/build/* ./dist/editor