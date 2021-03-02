#!/bin/sh
set -- *.md
while [ $# -gt 0 ]
do
        pandoc -s ${1} -o ${1%.md}.html \
        --standalone \
        --number-sections \
        --template=template.html \
        --toc
        shift
    if [ $# -gt 0 ]
    then
        pandoc -s ${1} -o ${1%.md}.html \
        --standalone \
        --number-sections \
        --template=template.html \
        --toc
        shift
    fi
  wait
done
