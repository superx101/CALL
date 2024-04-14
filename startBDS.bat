@echo off
set "programDir=E:\Mincraft_File\bedrock\servers\dev"
set "programPath=%programDir%/bedrock_server_mod.exe"

tasklist | find /i "%programPath%" >nul
if %errorlevel% equ 0 (
    taskkill /f /im "%programPath%"
)

start "" "%programPath%"