@echo off
echo ======================================
echo 正在删除 node_modules 和 package-lock.json
echo ======================================

:: 删除 node_modules 文件夹（静默模式）
rd /s /q node_modules

:: 删除 package-lock.json 文件
del /f /q package-lock.json

echo ======================================
echo 清理完成！
echo ======================================
pause
