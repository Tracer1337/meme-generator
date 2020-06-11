cd editor

if [ "$1" = "install" ]
    then npm run install
fi

npm run build

cd ..

mv ./editor/build/* ./dist/editor