#! /bin/bash
#- http://docs.spmjs.org/doc/
#- npm install spm-init -g
#- $ npm install spm-build -g
#- $ spm plugin install deploy
#build @spm build, First, you should install spm and spm-build:
#Note: you must copy this file into your each seajs costomized module directory
#e.g. sea-libs/slideshow/build.sh/build.bat
echo "`spm build` executing..."
spm build

CWD=$(pwd)
# we can't move cd '../../tools/' to node ../../tools/deploy-module.js
cd ../../tools/

node deploy-module.js -p $CWD