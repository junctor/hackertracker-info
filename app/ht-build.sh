rm -rf ../ht-export/out
rm -rf public/ht
mkdir -p ../ht-export/out
npm run --prefix ../ht-export export
cp -r ../ht-export/out/ht/ public/ht
bash ./tailwind-ht-colors.sh