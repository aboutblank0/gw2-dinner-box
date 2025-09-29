npm run build

rm -rf docs/*
cp -r dist/* docs/

git add docs
git commit -m "Update GitHub Pages"

git push origin main

echo "GitHub Pages updated! Visit https://aboutblank0.github.io/gw2-dinner-box/"

