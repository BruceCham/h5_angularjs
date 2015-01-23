#! /bin/bash

# declare the deploy directory.
deploypath="../deployed/150122/"  #../deploy  or any available directory path.

# echo ${deploypath}
# -t deploy target directory, -d cutomized deploy modules.
# 
# build style components.
cd buildtool
node tools/deploy-project.js -t ${deploypath} -d '["../", "../content", "../app"]'
