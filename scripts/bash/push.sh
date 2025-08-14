#!/bin/bash

# Our required variables before starting the process.
NAME=$(node -p "require('./package.json').name")
VERSION=$(node -p "require('./package.json').version")
BRANCH_NAME=$(node -p "require('./package.json').packagesBranch")

ZIP_FILENAME="$NAME.zip"


ZIP_PATH="`pwd`/$ZIP_FILENAME"
echo "$ZIP_PATH"

echo " "
echo "========"
echo " "
echo "Checkout to WP Root dir."
cd ../../../


echo " "
echo "========"
echo " "
echo "Check directory and Clone omnipress-packages repo."
[ -d "omnipress-packages" ] && rm -rf omnipress-packages
[ ! -d "omnipress-packages" ] && git clone git@github.com:everestthemes/omnipress-packages.git


echo " "
echo "========"
echo " "
echo "Verify if clone successful, exit if failed."
[ ! -d "omnipress-packages" ] && echo "Unable to clone directory. Check git ssh." && exit 0


echo " "
echo "========"
echo " "
echo "Go to packages directory."
cd omnipress-packages


echo " "
echo "========"
echo " "
echo "Checkout branch to branch: $BRANCH_NAME"
git checkout "$BRANCH_NAME"

echo " "
echo "========"
echo " "
echo "Check if folder with current version exits. Create if does not exits."
[ ! -d "v$VERSION" ] && mkdir "v$VERSION"

echo " "
[ ! -d "v$VERSION" ] && echo "Unable to create package version folder.." && exit 0


echo " "
echo "========"
echo " "
echo "Go to current package version directory: v$VERSION"
cd "v$VERSION"


echo " "
echo "========"
echo " "
echo "Remove zip file if already exits."
[ -f "$ZIP_FILENAME" ] && rm "$ZIP_FILENAME"

echo " "
echo "========"
echo " "
echo "Move zip file to package repo current version: v$VERSION"
echo "$ZIP_PATH"
mv "$ZIP_PATH" .

echo " "
echo "========"
echo " "
echo "Add files and commit to packages repo."
cd ../
git add . && git commit -m "Build: $VERSION" && git push origin "$BRANCH_NAME"

echo "Successfully pushed build to omnipress papckages"
echo "========"
echo " "
echo " "
