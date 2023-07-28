@echo off
python buildSrc/compile.py

set name=bedrock_server_mod.exe

tasklist | find /i "%name%" > NUL
if "%ERRORLEVEL%"=="0" (
    taskkill /IM "%name%"
)

"../../%name%"