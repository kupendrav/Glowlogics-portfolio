@echo off
setlocal
set "BUNDLED_MVN=%~dp0..\..\major-projects\Learning-platform\tools\apache-maven-3.9.9\bin\mvn.cmd"
set "WRAPPER_DIST=%USERPROFILE%\.m2\wrapper\dists\apache-maven-3.9.9"

if not exist "%BUNDLED_MVN%" (
    if exist "%WRAPPER_DIST%" (
        for /d %%D in ("%WRAPPER_DIST%\*") do (
            if exist "%%~fD\bin\mvn.cmd" (
                set "BUNDLED_MVN=%%~fD\bin\mvn.cmd"
                goto run_maven
            )
        )
    )

    where mvn >nul 2>nul
    if not errorlevel 1 (
        set "BUNDLED_MVN=mvn"
        goto run_maven
    )

    echo ERROR: Maven not found.
    echo Looked for:
    echo   1. %BUNDLED_MVN%
    echo   2. %WRAPPER_DIST%\*\bin\mvn.cmd
    echo   3. mvn on PATH
    exit /b 1
)

 :run_maven
call "%BUNDLED_MVN%" %*
exit /b %errorlevel%
