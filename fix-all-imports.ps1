# Final comprehensive path fixing script
$files = Get-ChildItem -Path "src\pages_temp" -Filter "*.jsx"

foreach ($file in $files) {
    $content = Get-Content $file.FullName -Raw
    
    # Fix all import paths for pages_temp files
    # API imports
    $content = $content -replace 'from\s+[''"]\.\.\/api\/axios[''"]', 'from "../shared/api_temp/axios"'
    $content = $content -replace 'from\s+[''"]\.\.\/api\/auth[''"]', 'from "../shared/api_temp/auth"'
    $content = $content -replace 'from\s+[''"]\.\.\/api\/bootstrapAuth[''"]', 'from "../shared/api_temp/bootstrapAuth"'
    
    # Helper imports
    $content = $content -replace 'from\s+[''"]\.\.\/helpers\/loadRazorpay[''"]', 'from "../shared/lib/loadRazorpay"'
    $content = $content -replace 'from\s+[''"]\.\.\/helpers\/paginationHelpers[''"]', 'from "../shared/lib/paginationHelpers"'
    $content = $content -replace 'from\s+[''"]\.\.\/helpers\/userHelpers[''"]', 'from "../shared/lib/userHelpers"'
    
    # Skelton imports  
    $content = $content -replace 'from\s+[''"]\.\.\/skeltons\/([^''"]*)Skelton[''"]', 'from "../shared/ui/skeltons/$1Skelton"'
    $content = $content -replace 'from\s+[''"]\.\.\/skeltons\/([^''"]*)Skeleton[''"]', 'from "../shared/ui/skeltons/$1Skeleton"'
    
    # Component imports
    $content = $content -replace 'from\s+[''"]\.\.\/components\/(\w+)[''"]', 'from "../components_temp/$1"'
    
    Set-Content -Path $file.FullName -Value $content -NoNewline
}

Write-Host "All import paths fixed in pages_temp!"
