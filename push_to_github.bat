@echo off
chcp 65001 > nul
echo ============================================================
echo   RESEARCH QUESTIONNAIRE PLATFORM - GITHUB SETUP HELPER
echo   ប្រព័ន្ធជំនួយការដាក់កូដចូលទៅកាន់ GITHUB
echo ============================================================
echo.

where git >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] មិនទាន់រកឃើញ Git ក្នុងកុំព្យូទ័ររបស់អ្នកនៅឡើយទេ។
    echo សូមទាញយក និងតំឡើង Git ជាមុនសិនតាមរយៈ: https://git-scm.com/download/win
    echo បន្ទាប់ពីតំឡើងរួច សូមបិទ ហើយបើកផ្ទាំង Terminal ឡើងវិញ។
    echo.
    pause
    exit /b 1
)

echo [1/4] កំពុងពិនិត្យ និងចាប់ផ្តើម Git Repository...
if not exist ".git" (
    git init
    git branch -M main
)

echo [2/4] កំពុងរៀបចំឯកសារ (git add .)...
git add .

echo [3/4] កំពុង Commit កូដ...
git commit -m "feat: complete WISN workforce questionnaire platform for RH Stung Trang"

echo.
echo [4/4] ភ្ជាប់ទៅកាន់ GitHub Repository
echo ------------------------------------------------------------
set /p REPO_URL="សូមបញ្ចូល URL នៃ GitHub Repository របស់អ្នក (ឧ. https://github.com/username/research-survey.git): "

if "%REPO_URL%"=="" (
    echo [!] មិនបានបញ្ចូល URL ទេ។ អ្នកអាចរុញតាមក្រោយដោយប្រើ: git remote add origin ^<URL^>
    pause
    exit /b 0
)

git remote remove origin >nul 2>nul
git remote add origin %REPO_URL%

echo.
echo កំពុង Push ឡើងទៅកាន់ GitHub (Branch: main)...
git push -u origin main

if %errorlevel% equ 0 (
    echo.
    echo ============================================================
    echo [SUCCESS] បានដាក់កូដចូល GitHub ដោយជោគជ័យ!
    echo ============================================================
) else (
    echo.
    echo [NOTE] ប្រសិនបើទាមទារសិទ្ធិ Login សូមចូល Login តាមផ្ទាំង Browser ឬបង្កើត GitHub Personal Access Token (PAT)។
)

pause
