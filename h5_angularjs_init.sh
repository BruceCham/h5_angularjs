#! /bin/bash
#

echo "bower install -> install project bower dependancy!\n"
# install bower dependancy
bower install

#install app theme dependancy!
echo "bower isntall -> in /pafboots for theme dependancy! \n"
cd pafboots
bower install 
# install app testing local server depandany.
echo "npm install -> in /server for testing server dependancy! \n"
cd ../server 
npm install

# install build tool lib depandany!
echo "npm install -> in /buildtool lib dependancy! \n"
cd ../buildtool 
npm install








