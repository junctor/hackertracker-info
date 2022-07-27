npm run --prefix ../ht-export export
cp ../ht-export/out/*.json public/static/con/
cp -r ../ht-export/out/maps public/static/con/
bash ./tailwind-ht-colors.sh