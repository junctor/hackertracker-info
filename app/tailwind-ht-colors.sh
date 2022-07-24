#!/bin/bash
COLORS=$(jq '.[].type.color' ./public/static/conf/events.json | sort -u)
jq -r -c --argjson colors $COLORS '.colors = [$colors]' ./tailwind-ht-safelist.json > colors.tmp && mv colors.tmp ./tailwind-ht-safelist.json
