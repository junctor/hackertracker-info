rm -rf ../ht-exports/out
mkdir -p ../ht-exports/out
npm run --prefix ../ht-export export
cp -r ../ht-export/out/ht/ public/ht
bash ./tailwind-ht-colors.sh