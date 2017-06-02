F:
cd svnIdea\11.Static\operate
echo 1  >> C:\Users\Administrator\Desktop\autoTask\autoLog.txt
echo %date:~0,10%%time% >> C:\Users\Administrator\Desktop\autoTask\autoLog.txt
svn update >> C:\Users\Administrator\Desktop\autoTask\autoLog.txt