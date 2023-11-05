@echo off
start cmd /k "cd /d %~dp0 && title New CMD in Script Location && activate zb && uvicorn main:app --reload"
