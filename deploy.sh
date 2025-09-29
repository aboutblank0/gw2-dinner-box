# Build
if ! npm run build; then
  echo "Build failed!"
  exit 1
fi

rm -rf docs/* || { echo "Failed to remove old docs"; exit 1; }
cp -r dist/* docs/ || { echo "Failed to copy build to docs"; exit 1; }

# Commit changes
git add docs || { echo "git add failed"; exit 1; }
git commit -m "Update GitHub Pages" || echo "Nothing to commit"

if ! git push origin main; then
  echo "git push failed!"
  exit 1
fi

echo "GitHub Pages updated! Visit https://aboutblank0.github.io/gw2-dinner-box/"
