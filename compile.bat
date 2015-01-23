@ECHO OFF

SET CWD=%~dp0

REM declare the deploy directory.

REM ../deploy  or any available directory path.
SET DEPLOY="../deployed/150122/"

REM node location
SET NODE=node.exe

REM -t deploy target directory, -d cutomized deploy modules.

REM build style components.

CD buildtool


%NODE% tools/deploy-project.js -t %DEPLOY% -d [\"../"\", \"../content"\",\"../app"\""]


CD %CWD%