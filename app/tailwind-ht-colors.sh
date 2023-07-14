#!/bin/bash
COLORS=$(jq '.[].type.color' ./public/ht/events.json | sort -u | tr '\n' ',' | sed 's/.$//')
COLORS=["$COLORS"]
jq -r -c --argjson colors "$COLORS" '.colors = $colors' ./tailwind-ht-safelist.json > c.tmp && mv c.tmp ./tailwind-ht-safelist.json
