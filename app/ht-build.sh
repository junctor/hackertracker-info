rm -rf ../ht-exports/out
npm install --prefix ../ht-export
npm run --prefix ../ht-export export
cp -r ../ht-export/out/ht/ public/ht
bash ./tailwind-ht-colors.sh