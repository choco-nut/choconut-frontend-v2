# PowerShell script to refactor Context API imports to Zustand
# Run from: c:\projects\choconut_frontend_optimized\choconut-frontend

$files = Get-ChildItem -Path "src\pages_temp","src\components_temp" -Filter "*.jsx" -Recurse

foreach ($file in $files) {
    Write-Host "Processing: $($file.FullName)"
    
    $content = Get-Content $file.FullName -Raw
    
    # Replace UserContext imports
    $content = $content -replace 'import\s*{\s*UserContext\s*}\s*from\s*[''"].*?UserContext.*?[''"];?', ''
    $content = $content -replace 'import\s*{\s*useAuth\s*}\s*from\s*[''"].*?AuthContext.*?[''"];?', ''
    
    # Replace AdminContext imports
    $content = $content -replace 'import\s*{\s*AdminContext\s*}\s*from\s*[''"].*?AdminContext.*?[''"];?', ''
    
    # Replace NotificationContext imports  
    $content = $content -replace 'import\s*{\s*useNotifications\s*}\s*from\s*[''"].*?NotificationContext.*?[''"];?', ''
    
    # Replace ChatContext imports
    $content = $content -replace 'import\s*{\s*useChat\s*}\s*from\s*[''"].*?ChatContext.*?[''"];?', ''
    
    # Replace useContext calls
    $content = $content -replace 'const\s*{([^}]+)}\s*=\s*useContext\s*\(\s*UserContext\s*\)\s*;?', 'const {$1} = useUserStore();'
    $content = $content -replace 'const\s*{([^}]+)}\s*=\s*useContext\s*\(\s*AdminContext\s*\)\s*;?', 'const {$1} = useAdminStore();'
    $content = $content -replace 'const\s*{([^}]+)}\s*=\s*useNotifications\s*\(\s*\)\s*;?', 'const {$1} = useNotificationStore();'
    $content = $content -replace 'const\s*{([^}]+)}\s*=\s*useChat\s*\(\s*\)\s*;?', 'const {$1} = useChatStore();'
    
    # Clean up multiple blank lines
    $content = $content -replace '(\r?\n){3,}', "`r`n`r`n"
    
    Set-Content -Path $file.FullName -Value $content -NoNewline
}

Write-Host "Refactoring complete! Now manually add Zustand imports to each file."
