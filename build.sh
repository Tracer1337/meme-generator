cd editor

if [ "$1" = "install" ]
    then npm run install
fi

npm run build

cd ..

rm -r ./dist/editor
mv ./editor/build/* ./dist/editor