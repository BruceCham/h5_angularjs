@ECHO OFF

::Call 从一个批处理程序调用另一个批处理程序，并且不终止父批处理程序。
::因为直接这里调用spm build 会终止后面的depoly-module 执行，所以针对WINDOW 单独用了一个CALL 

SET CWD=%~dp0
:: invoke spm build.bat for windows
CALL ../../tools/spmbuild.bat %CWD%

:: node location
SET NODE=node.exe

CD ../../tools/

%NODE% deploy-module.js -p %CWD%

CD %CWD%