npm run --prefix ../ht-export export
cp ../ht-export/out/*.json public/static/conf/
cp -r ../ht-export/out/maps public/static/conf/
bash ./tailwind-ht-colors.sh