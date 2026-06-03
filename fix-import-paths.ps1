# Fix import paths in components_temp files
$files = Get-ChildItem -Path "src\components_temp\admin" -Filter "*.jsx" -Recurse

foreach ($file in $files) {
    $content = Get-Content $file.FullName -Raw
    
    # Fix relative paths for admin components
    # From admin/pages or admin/sections, go up 4 levels to reach src/entities
    $content = $content -replace 'from\s+[''"]\.\.\/entities\/', 'from "../../../entities/'
    $content = $content -replace 'from\s+[''"]\.\.\/features\/', 'from "../../../features/'
    
    Set-Content -Path $file.FullName -Value $content -NoNewline
}

# Fix components_temp root level files
$files = Get-ChildItem -Path "src\components_temp" -Filter "*.jsx" | Where-Object { -not $_.PSIsContainer }

foreach ($file in $files) {
    $content = Get-Content $file.FullName -Raw
    
    # From components_temp root, go up 1 level to reach src/entities
    $content = $content -replace 'from\s+[''"]\.\.\/entities\/', 'from "../entities/'
    $content = $content -replace 'from\s+[''"]\.\.\/features\/', 'from "../features/'
    
    Set-Content -Path $file.FullName -Value $content -NoNewline
}

# Fix components_temp/routes files
$files = Get-ChildItem -Path "src\components_temp\routes" -Filter "*.jsx"

foreach ($file in $files) {
    $content = Get-Content $file.FullName -Raw
    
    # From components_temp/routes, go up 2 levels to reach src/entities
    $content = $content -replace 'from\s+[''"]\.\.\/entities\/', 'from "../../entities/'
    $content = $content -replace 'from\s+[''"]\.\.\/features\/', 'from "../../features/'
    
    Set-Content -Path $file.FullName -Value $content -NoNewline
}

# Fix components_temp/Products files  
$files = Get-ChildItem -Path "src\components_temp\Products" -Filter "*.jsx"

foreach ($file in $files) {
    $content = Get-Content $file.FullName -Raw
    
    # From components_temp/Products, go up 2 levels to reach src/entities
    $content = $content -replace 'from\s+[''"]\.\.\/entities\/', 'from "../../entities/'
    $content = $content -replace 'from\s+[''"]\.\.\/features\/', 'from "../../features/'
    
    Set-Content -Path $file.FullName -Value $content -NoNewline
}

Write-Host "Import paths fixed!"
