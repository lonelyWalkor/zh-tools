F:
cd svnIdea\09.Implements
echo 2  >> %~dp0autoLog.txt
echo %date:~0,10% %time% >> %~dp0autoLog.txt
svn update >> %~dp0autoLog.txt
