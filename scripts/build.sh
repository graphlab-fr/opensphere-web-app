#!/usr/bin/env bash

# Re-builds the full page

# First retrieve all available docs
cd "$(dirname $0)"
cd ../doc
docs=$(ls -d *)

for d in $docs
do
  # Build each available language
  mkdocs build --config-file ./$d/mkdocs.yml
  mkdir ../build
  rm -R ../build/$d
  cp -R ./$d/site ../build/$d
done

cp ../dist/index.html ../build/