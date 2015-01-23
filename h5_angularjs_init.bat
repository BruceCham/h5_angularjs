@ECHO OFF

SET CWD=%~dp0

REM install bower dependancy
ECHO "bower install -> install project bower dependancy!\n"
bower install

REM install app theme dependancy!
ECHO "bower isntall -> in /pafboots for theme dependancy! \n"
CD pafboots
bower install 
CD %CWD% 

REM install app testing local server depandany.
ECHO "npm install -> in /server for testing server dependancy! \n"
CD server 
npm install

CD %CWD%