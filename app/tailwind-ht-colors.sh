#!/bin/bash
if [ ! -f ./tailwind-ht-safelist.json ]; then
  echo '{"colors":[]}' > ./tailwind-ht-safelist.json
fi

COLORS=$(jq '.[].tags[].color_background' ./public/ht/tags.json | sort -u | tr '\n' ',' | sed 's/.$//')
COLORS=["$COLORS"]
jq -r -c --argjson colors "$COLORS" '.colors = $colors' ./tailwind-ht-safelist.json > c.tmp && mv c.tmp ./tailwind-ht-safelist.json
