@ECHO OFF

SET CWD=%~dp0

REM use `CALL` keywords as only then the program control returns to the caller.

REM install bower dependancy
ECHO "bower install -> install project bower dependancy!\n"
CALL bower install

REM install app theme dependancy!
ECHO "bower isntall -> in /pafboots for theme dependancy! \n"
CD pafboots
CALL bower install 
CD %CWD% 

REM install app testing local server depandany.
ECHO "npm install -> in /server for testing server dependancy! \n"
CD server 
CALL npm install

CD %CWD%

PAUSE