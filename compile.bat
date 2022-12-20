xcopy "test\" "nodejs/CALL/test\" /Y
xcopy "third-party\" "nodejs/CALL/third-party\" /Y
xcopy "config\" "nodejs/CALL/config\" /Y
xcopy "src/plugin/ShapeTemplates\" "nodejs/CALL/src/plugin/ShapeTemplates\" /Y
tsc
for /r nodejs\CALL\ %%i in (.\*.js) do uglifyjs %%i -c -m -o %%i