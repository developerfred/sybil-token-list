#!/usr/bin/env bash

# read versionn
VERSION=$(node -p -e "require('./package.json').version")

CHAIN[0]=dist/v$VERSION

for i in {1,3,4,10,56,97,100,122,137,250,288,42161,42220,43114,80001,1313161554}; do
  CHAIN[$i]=dist/v$VERSION/$i
done

mkdir -p dist
mkdir -p latest

# build the latest version
for i in "${!CHAIN[@]}"; do
  printf "Generate for chain id: %s to folder: %s\n" "$i" "${CHAIN[$i]}"
  mkdir -p "${CHAIN[$i]}"
  touch "${CHAIN[$i]}/blacklist.json"
  node scripts/generate-erc20.js $i > "${CHAIN[$i]}/blacklist.json"
done

node scripts/generate-erc721.js > "dist/sybil_blacklist_nft.json"

# build the current version
#cp dist/v${VERSION}/tokens.json "dist/mask.json"
cp -r dist/v"${VERSION}/" "dist/latest"
cp dist/sybil_blacklist_nft.json "dist/sybil_blacklist_nft_v_$(echo $VERSION | sed "s/\./_/g").json"

echo "v${VERSION} is built."
