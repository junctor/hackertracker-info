rm -rf ../ht-exports/out/con
npm run --prefix ../ht-export export
cp -r ../ht-export/out/con public/static/
bash ./tailwind-ht-colors.sh