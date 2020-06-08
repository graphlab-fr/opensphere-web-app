#!/usr/bin/env bash

# Re-builds the full page

# First retrieve all available docs
cd "$(dirname $0)"
cd ../doc
docs=$(ls -d *)

rm -R ../build
mkdir ../build

for d in $docs
do
  # Build each available language
  mkdocs build --config-file ./$d/mkdocs.yml
  cp -R ./$d/site ../build/$d
done

cp ../dist/index.html ../build/