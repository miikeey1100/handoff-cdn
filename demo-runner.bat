@echo off
setlocal
color 0F
mode con: cols=110 lines=34

:TITLE
cls
echo.
echo  ============================================================
echo.
echo     H A N D O F F - C D N   v0.5.1
echo     Design-to-Code Protocol  .  Built with Opus 4.7
echo.
echo  ============================================================
echo.
echo     Scene 1  -  The Arena (plain prompt vs. Handoff-CDN)
echo     Scene 2  -  Visual Grader (your HTML vs. a bundle)
echo.
echo     Press any key to start Scene 1...
echo.
pause >nul

:SCENE1
cls
echo.
echo  [SCENE 1 / 2]  npx handoff-cdn arena --mock
echo  ------------------------------------------------------------
echo.
timeout /t 1 /nobreak >nul
call npx handoff-cdn arena --mock
echo.
echo  ------------------------------------------------------------
echo  Scene 1 complete. Press any key for Scene 2...
pause >nul

:SCENE2
cls
echo.
echo  [SCENE 2 / 2]  npx handoff-cdn grade demo-output.html --against aerodrop --visual --mock
echo  ------------------------------------------------------------
echo.
timeout /t 1 /nobreak >nul
call npx handoff-cdn grade demo-output.html --against aerodrop --visual --mock
echo.
echo  ------------------------------------------------------------

:OUTRO
echo.
echo  ============================================================
echo     That's Handoff-CDN. Pixel-perfect UI, streamed.
echo     npm install -g handoff-cdn
echo     github.com/miikeey1100/handoff-cdn
echo  ============================================================
echo.
pause
endlocal
