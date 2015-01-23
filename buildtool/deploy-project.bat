@ECHO OFF

REM declare the deploy directory.

REM ../deploy  or any available directory path.
SET DEPLOY="../builtPackage/141030/"

REM node location
SET NODE=node.exe

REM -t deploy target directory, -d cutomized deploy modules.

REM build style components.

%NODE% tools/deploy-project.js -t %DEPLOY% -d [\"../"\", \"../content"\",\"../app"\",\"../app/styles"\"]