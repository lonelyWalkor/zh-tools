F:
cd svnIdea\11.Static\operate
echo 1  >> %~dp0autoLog.txt
echo %date:~0,10% %time% >> %~dp0autoLog.txt
svn update >> %~dp0autoLog.txt