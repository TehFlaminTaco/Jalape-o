VERSION=$(cat ./src/App.tsx | grep "const VERSION = " | tr -d -c 0-9)
echo "Building project..."
echo "BUILD VERISON: v"$VERSION
echo "LATEST VERISON: v"$(cat ./docs/version.txt)

if [ $VERSION -eq $(cat ./docs/version.txt) ]; then
    read -p "Build version same as latest! Continue? [y/n] " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]
    then
        [[ "$0" = "$BASH_SOURCE" ]] && exit 1 || return 1
    fi
    rm -rf ./docs/$VERSION
fi
printf "%s" "$VERSION" > "./docs/version.txt"
npm run build
find ./dist -name '*.*' -exec sed -i -e 's|"/assets|"./assets|g' {} \;
mv ./dist ./docs/$VERSION
