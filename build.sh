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

rm -r ./public/editor
mkdir ./public/editor
mv ./editor/build/* ./public/editor